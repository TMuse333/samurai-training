/**
 * Vercel Operations Utility
 *
 * Handles Vercel deployment operations:
 * - Triggering deployments
 * - Checking deployment status
 * - Waiting for deployments to complete
 */

export interface DeploymentStatus {
  state: 'QUEUED' | 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED';
  url?: string;
  readyState?: string;
}

export interface DeploymentResult {
  success: boolean;
  state: DeploymentStatus['state'];
  url?: string;
  deploymentId?: string;
  error?: string;
}

const VERCEL_API_BASE = 'https://api.vercel.com';

/**
 * Get Vercel API headers
 */
function getHeaders(): HeadersInit {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN environment variable is not set');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Trigger a Vercel deployment
 *
 * @param projectId - Vercel project ID
 * @param branch - Git branch to deploy (default: main)
 * @returns Deployment ID
 */
export async function triggerVercelDeployment(
  projectId: string,
  branch: string = 'main'
): Promise<string> {
  try {
    console.log(`🚀 Triggering Vercel deployment...`);
    console.log(`  - Project ID: ${projectId}`);
    console.log(`  - Branch: ${branch}`);

    // Vercel automatically deploys when you push to a branch
    // We just need to trigger a deployment hook or wait for auto-deploy
    // For now, we'll use the deployments API to create a new deployment

    const response = await fetch(`${VERCEL_API_BASE}/v13/deployments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        name: projectId,
        project: projectId,
        target: 'production',
        gitSource: {
          type: 'github',
          ref: branch,
          repoId: projectId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Vercel API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const deploymentId = data.id || data.uid;

    if (!deploymentId) {
      throw new Error('No deployment ID returned from Vercel');
    }

    console.log(`✅ Deployment triggered: ${deploymentId}`);
    return deploymentId;
  } catch (error: any) {
    console.error('❌ Failed to trigger deployment:', error.message);
    throw error;
  }
}

/**
 * Get deployment status
 *
 * @param deploymentId - Vercel deployment ID
 * @returns DeploymentStatus
 */
export async function getDeploymentStatus(
  deploymentId: string
): Promise<DeploymentStatus> {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v13/deployments/${deploymentId}`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Vercel API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    return {
      state: data.readyState || data.state || 'QUEUED',
      url: data.url ? `https://${data.url}` : undefined,
      readyState: data.readyState,
    };
  } catch (error: any) {
    console.error('❌ Failed to get deployment status:', error.message);
    throw error;
  }
}

/**
 * Wait for deployment to be ready
 *
 * @param deploymentId - Vercel deployment ID
 * @param timeout - Timeout in milliseconds (default: 10 minutes)
 * @param pollInterval - Polling interval in milliseconds (default: 5 seconds)
 * @returns DeploymentResult
 */
export async function waitForDeploymentReady(
  deploymentId: string,
  timeout: number = 600000, // 10 minutes
  pollInterval: number = 5000 // 5 seconds
): Promise<DeploymentResult> {
  console.log(`⏳ Waiting for deployment to be ready...`);
  console.log(`  - Deployment ID: ${deploymentId}`);
  console.log(`  - Timeout: ${timeout / 1000}s`);

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const status = await getDeploymentStatus(deploymentId);

      console.log(`  📊 Status: ${status.state}`);

      // Check if deployment is complete
      if (status.state === 'READY') {
        console.log(`✅ Deployment ready: ${status.url}`);
        return {
          success: true,
          state: 'READY',
          url: status.url,
          deploymentId,
        };
      }

      // Check if deployment failed
      if (status.state === 'ERROR') {
        console.error('❌ Deployment failed');
        return {
          success: false,
          state: 'ERROR',
          deploymentId,
          error: 'Deployment failed',
        };
      }

      // Check if deployment was canceled
      if (status.state === 'CANCELED') {
        console.error('❌ Deployment was canceled');
        return {
          success: false,
          state: 'CANCELED',
          deploymentId,
          error: 'Deployment was canceled',
        };
      }

      // Still building/queued, wait and check again
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error: any) {
      console.error('❌ Error checking deployment status:', error.message);
      // Don't fail immediately, retry
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  // Timeout reached
  console.error('❌ Deployment timeout reached');
  return {
    success: false,
    state: 'BUILDING', // Assume still building
    deploymentId,
    error: `Deployment timeout after ${timeout / 1000}s`,
  };
}

/**
 * Get latest deployment for a project
 *
 * @param projectId - Vercel project ID
 * @returns Deployment info or null
 */
export async function getLatestDeployment(projectId: string): Promise<any | null> {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=1`,
      {
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Vercel API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    if (data.deployments && data.deployments.length > 0) {
      return data.deployments[0];
    }

    return null;
  } catch (error: any) {
    console.error('❌ Failed to get latest deployment:', error.message);
    return null;
  }
}

/**
 * Get deployment URL from project
 *
 * @param projectId - Vercel project ID
 * @returns Production URL or null
 */
export async function getProjectUrl(projectId: string): Promise<string | null> {
  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects/${projectId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Vercel API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();

    // Get production URL
    if (data.targets && data.targets.production) {
      return `https://${data.targets.production.url}`;
    }

    // Fallback to project name
    if (data.name) {
      return `https://${data.name}.vercel.app`;
    }

    return null;
  } catch (error: any) {
    console.error('❌ Failed to get project URL:', error.message);
    return null;
  }
}

/**
 * Wait for Vercel auto-deployment after GitHub push
 *
 * After pushing to main via GitHub API, Vercel automatically detects the change
 * and triggers a deployment via GitHub integration. This function polls for that
 * deployment to complete.
 *
 * @param projectId - Vercel project ID
 * @param timeout - Timeout in milliseconds (default: 10 minutes)
 * @param pollInterval - Polling interval in milliseconds (default: 10 seconds)
 * @returns DeploymentResult
 */
export async function waitForVercelAutoDeployment(
  projectId: string,
  timeout: number = 600000, // 10 minutes
  pollInterval: number = 10000 // 10 seconds
): Promise<DeploymentResult> {
  console.log('\n🌐 Waiting for Vercel auto-deployment...');
  console.log(`  - Project ID: ${projectId}`);
  console.log(`  - Timeout: ${timeout / 1000}s`);
  console.log(`  - Note: Vercel auto-deploys via GitHub integration\n`);

  const startTime = Date.now();
  let lastDeploymentId: string | null = null;

  while (Date.now() - startTime < timeout) {
    try {
      // Get latest deployment for this project
      const latestDeployment = await getLatestDeployment(projectId);

      if (latestDeployment) {
        const deploymentId = latestDeployment.uid || latestDeployment.id;

        // If this is a new deployment (different from last check)
        if (deploymentId !== lastDeploymentId) {
          console.log(`  📦 New deployment detected: ${deploymentId}`);
          lastDeploymentId = deploymentId;
        }

        const state = latestDeployment.readyState || latestDeployment.state;
        console.log(`  📊 Status: ${state}`);

        // Check if deployment is complete
        if (state === 'READY') {
          const url = latestDeployment.url
            ? `https://${latestDeployment.url}`
            : await getProjectUrl(projectId);

          console.log(`\n✅ Vercel deployment complete!`);
          console.log(`  🔗 URL: ${url}\n`);

          return {
            success: true,
            state: 'READY',
            url: url || undefined,
            deploymentId,
          };
        }

        // Check if deployment failed
        if (state === 'ERROR') {
          console.error('\n❌ Vercel deployment failed\n');
          return {
            success: false,
            state: 'ERROR',
            deploymentId,
            error: 'Deployment failed',
          };
        }

        // Check if deployment was canceled
        if (state === 'CANCELED') {
          console.error('\n❌ Vercel deployment was canceled\n');
          return {
            success: false,
            state: 'CANCELED',
            deploymentId,
            error: 'Deployment was canceled',
          };
        }

        // Still building/queued, wait and check again
      } else {
        console.log('  ⏳ No deployment found yet, waiting for Vercel to detect GitHub push...');
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch (error: any) {
      console.error(`  ⚠️  Error checking deployment status: ${error.message}`);
      // Don't fail immediately, retry
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  // Timeout reached
  console.error('\n❌ Vercel deployment timeout reached');
  console.error(`  Waited ${timeout / 1000}s but deployment did not complete\n`);
  return {
    success: false,
    state: 'BUILDING',
    deploymentId: lastDeploymentId || undefined,
    error: `Deployment timeout after ${timeout / 1000}s`,
  };
}

/**
 * Full Vercel deployment workflow (DEPRECATED - Use waitForVercelAutoDeployment)
 *
 * @deprecated Use waitForVercelAutoDeployment instead. Vercel auto-deploys via GitHub integration.
 * @param projectId - Vercel project ID
 * @param branch - Git branch to deploy
 * @param dryRun - If true, simulates deployment without calling Vercel API
 * @returns DeploymentResult
 */
export async function deployToVercel(
  projectId: string,
  branch: string = 'main',
  dryRun: boolean = false
): Promise<DeploymentResult> {
  console.warn('⚠️  deployToVercel() is deprecated. Use waitForVercelAutoDeployment() instead.');
  console.warn('⚠️  Vercel auto-deploys via GitHub integration when main branch is updated.\n');

  if (dryRun) {
    console.log('🧪 DRY RUN MODE - Simulating Vercel auto-deployment wait\n');
    console.log('📋 DRY RUN - What would happen:\n');
    console.log(`1. ✓ GitHub push to main triggers Vercel auto-deployment`);
    console.log(`2. ✓ Poll Vercel API for deployment status`);
    console.log(`3. ✓ Wait for deployment to be ready`);
    console.log(`4. ✓ Return deployment URL`);
    console.log('\n✅ DRY RUN complete!\n');

    return {
      success: true,
      state: 'READY',
      url: `https://${projectId}.vercel.app (dry-run)`,
      deploymentId: 'dry-run-deployment-id',
    };
  }

  // Use the new auto-deployment waiting function
  return waitForVercelAutoDeployment(projectId);
}
