# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your tokens:**
   - Edit `.env.local` and add your actual tokens
   - **Never commit `.env.local`** - it's already in `.gitignore`

## Required Tokens

### GitHub Token
**Required for:** Version control, saving changes, GitHub API operations

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Samurai Training - Website Builder"
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. Copy the token and add to `.env.local`:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```

### Vercel Token
**Required for:** Deployments, Vercel API operations

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "Samurai Training - Deployments"
4. Scope: Full Account (or specific team)
5. Copy the token and add to `.env.local`:
   ```env
   VERCEL_API_TOKEN=your_vercel_token_here
   VERCEL_TOKEN=your_vercel_token_here  # Some code uses this name
   ```

## Environment Variable Reference

### Server-Side Only (API Routes)
These are **NOT** exposed to the browser:
- `GITHUB_TOKEN` - GitHub API authentication
- `VERCEL_API_TOKEN` / `VERCEL_TOKEN` - Vercel API authentication
- `OPENAI_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Claude API key
- `MONGODB_URI` - Database connection string

### Client-Side Accessible (NEXT_PUBLIC_ prefix)
These **ARE** exposed to the browser:
- `NEXT_PUBLIC_REPO_TYPE` - Repository type (monorepo/polyrepo)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NEXT_PUBLIC_SITE_URL` - Site URL
- `NEXT_PUBLIC_USER_ID` - User identifier

## Security Notes

⚠️ **IMPORTANT:**
- **Never** add `NEXT_PUBLIC_` prefix to tokens or secrets
- **Never** commit `.env.local` to git
- Tokens should only be used in API routes (server-side)
- For production, set environment variables in your hosting platform (Vercel, etc.)

## Troubleshooting

### "GITHUB_TOKEN not set" error
- Check that `.env.local` exists in the `frontend/` directory
- Verify the token is correct (starts with `ghp_`)
- Restart your dev server after adding the token

### "VERCEL_API_TOKEN not set" error
- Check that `.env.local` exists
- Verify the token is correct
- Restart your dev server after adding the token

### Environment variables not loading
1. Make sure the file is named `.env.local` (not `.env`)
2. Make sure it's in the `frontend/` directory (same level as `package.json`)
3. Restart your Next.js dev server: `npm run dev`

## Production Deployment

For production deployments (Vercel, etc.), set environment variables in your hosting platform's dashboard:

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable from `.env.example`
4. Select the appropriate environments (Production, Preview, Development)

### Other Platforms
Refer to your hosting platform's documentation for setting environment variables.

