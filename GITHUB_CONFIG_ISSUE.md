# GitHub API Configuration Issue

## Problem Summary

The application is pulling `websiteData.json` from the **wrong GitHub repository and branch**:
- **Currently pulling from**: `TMuse333/next-js-template` (experiment branch)
- **Should be pulling from**: `TMuse333/samurai-training` (development branch)

## Root Cause

The GitHub API configuration relies on environment variables that are **not set**, causing it to fall back to incorrect defaults:

```typescript
// frontend/src/lib/config.ts
REPO_NAME: process.env.REPO_NAME || "next-js-template"  // ❌ Wrong default
CURRENT_BRANCH: process.env.CURRENT_BRANCH || "experiment"  // ❌ Wrong default
```

## Impact

- All website data loads from the wrong repository
- Changes may be saved to the wrong repository
- Version control shows commits from the wrong repo
- Data synchronization issues

## Solution

### Option 1: Set Environment Variables (Recommended)

Set these environment variables in your deployment (Vercel, etc.):

```env
REPO_OWNER=TMuse333
REPO_NAME=samurai-training
CURRENT_BRANCH=development
PRODUCTION_BRANCH=main
GITHUB_TOKEN=ghp_your_token_here
```

### Option 2: Update Defaults in Code (Temporary Fix)

The defaults have been updated in `frontend/src/lib/config.ts` to:
- `REPO_NAME`: `"samurai-training"` ✅
- `CURRENT_BRANCH`: `"development"` ✅

**Note**: This works for local development, but environment variables should still be set for production deployments.

## Files Affected

- `frontend/src/lib/config.ts` - Configuration source
- `frontend/src/app/api/versions/get-latest/route.ts` - Uses `GITHUB_CONFIG`
- `frontend/src/app/api/versions/switch-github/route.ts` - Uses `GITHUB_CONFIG`
- `frontend/src/app/api/versions/create-github/route.ts` - Uses `GITHUB_CONFIG`
- `frontend/src/stores/slices/websiteDataSlice.ts` - Loads data using `GITHUB_CONFIG`

## Verification

After setting environment variables, verify the configuration by:

1. Check server logs on startup - should show:
   ```
   ✅ GitHub config initialized: {
     repoOwner: 'TMuse333',
     repoName: 'samurai-training',
     currentBranch: 'development',
     ...
   }
   ```

2. Check browser console when loading data - should show:
   ```
   🔵 [websiteDataSlice] Loading from GitHub: { branch: 'development', ... }
   🔵 [get-latest] Request: { repoName: 'samurai-training', branch: 'development', ... }
   ```

3. Verify API calls are going to correct repo:
   - Should see: `https://api.github.com/repos/TMuse333/samurai-training/...`
   - NOT: `https://api.github.com/repos/TMuse333/next-js-template/...`

## Required Environment Variables

| Variable | Required | Default (if not set) | Correct Value |
|----------|----------|---------------------|---------------|
| `REPO_OWNER` | No | `TMuse333` | `TMuse333` ✅ |
| `REPO_NAME` | **Yes** | ~~`next-js-template`~~ | `samurai-training` |
| `CURRENT_BRANCH` | **Yes** | ~~`experiment`~~ | `development` |
| `PRODUCTION_BRANCH` | No | `main` | `main` ✅ |
| `GITHUB_TOKEN` | **Yes** | (empty) | Your GitHub token |

## Next Steps

1. **Set environment variables** in your deployment platform (Vercel dashboard, etc.)
2. **Redeploy** the application to pick up new environment variables
3. **Verify** the configuration is correct using the verification steps above
4. **Test** loading website data to confirm it's coming from the correct repository

---

**Created**: $(date)  
**Issue**: GitHub API pulling from wrong repository  
**Status**: Fixed in code defaults, but environment variables should be set for production

