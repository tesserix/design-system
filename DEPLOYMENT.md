# Tesserix Design System - Deployment Guide

This document describes how to deploy the Tesserix Design System Storybook and Documentation site to Vercel and integrate with Chromatic for visual testing.

## Prerequisites

- Node.js 20+
- pnpm 10+
- Vercel account
- Chromatic account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Vercel Deployment Token
VERCEL_TOKEN=your_vercel_token_here

# Chromatic Project Token
CHROMATIC_PROJECT_TOKEN=your_chromatic_token_here
```

**Note:** The `.env` file is git-ignored and should never be committed.

## Vercel Deployment

We have two separate Vercel deployments:

1. **Storybook** - Interactive component playground at `ui.tesserix.app`
2. **Documentation** - Comprehensive docs site at `docs.tesserix.app`

### Storybook Deployment

**Automatic Deployment (Recommended):**

1. Connect your GitHub repository to Vercel
2. Configure the project settings:
   - **Project Name:** `tesserix-storybook`
   - **Root Directory:** `./` (repository root)
   - **Framework Preset:** Other
   - **Build Command:** `pnpm build && pnpm --filter @tesserix/storybook build-storybook`
   - **Output Directory:** `apps/storybook/storybook-static`
   - **Install Command:** `pnpm install`

3. Add environment variables in Vercel dashboard:
   - `CHROMATIC_PROJECT_TOKEN` (optional, for Chromatic integration)

4. Deploy!

### Documentation Site Deployment

**Automatic Deployment (Recommended):**

1. Add a second project in Vercel from the same repository
2. Configure the project settings:
   - **Project Name:** `tesserix-docs`
   - **Root Directory:** `apps/docs`
   - **Framework Preset:** Next.js
   - **Build Command:** `cd ../.. && pnpm build && pnpm --filter @tesserix/docs build`
   - **Output Directory:** `.next`
   - **Install Command:** `cd ../.. && pnpm install`

3. Deploy!

### Manual Deployment

To deploy manually using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy Storybook to production
cd /path/to/design-system
vercel --prod

# Deploy Docs to production
cd apps/docs
vercel --prod
```

## Chromatic Integration

Chromatic provides visual testing and review for your Storybook components.

### Automatic Visual Testing

Visual regression tests run automatically on every PR via GitHub Actions (`.github/workflows/chromatic.yml`).

### Manual Chromatic Publish

To manually publish to Chromatic:

```bash
# Build Storybook first
pnpm --filter @tesserix/storybook build-storybook

# Publish to Chromatic
cd apps/storybook
pnpm chromatic --project-token=$CHROMATIC_PROJECT_TOKEN
```

### GitHub Setup

Add the Chromatic project token to your GitHub repository secrets:

1. Go to your repository Settings > Secrets and variables > Actions
2. Add a new secret named `CHROMATIC_PROJECT_TOKEN`
3. Paste your Chromatic project token

## Project URLs

After deployment, your projects will be available at:

- **Storybook:** https://ui.tesserix.app
- **Documentation:** https://docs.tesserix.app
- **Chromatic:** https://www.chromatic.com/builds?appId=your-app-id

## Build Scripts

### Storybook

```bash
# Development
pnpm --filter @tesserix/storybook dev

# Build Storybook
pnpm --filter @tesserix/storybook build-storybook

# Build all packages (required before Storybook build)
pnpm build

# Publish to Chromatic
pnpm --filter @tesserix/storybook chromatic

# Complete build and publish
pnpm --filter @tesserix/storybook chromatic:build
```

### Documentation Site

```bash
# Development
pnpm --filter @tesserix/docs dev

# Build docs
pnpm --filter @tesserix/docs build

# Start production server locally
pnpm --filter @tesserix/docs start

# Build all packages first (required before docs build)
pnpm build
```

## Deployment Features

### Storybook

The deployed Storybook includes:

- ✅ **123+ React Native components** rendered via react-native-web
- ✅ **All web components** from @tesserix/web
- ✅ **23 theme variants** with light/dark mode support
- ✅ **Accessibility testing** with @storybook/addon-a11y
- ✅ **Interactive controls** for all component props
- ✅ **Auto-generated documentation** from JSDoc comments

### Documentation Site

The deployed documentation site includes:

- ✅ **123+ component documentation pages** with examples and API references
- ✅ **15 hook documentation pages** with usage examples
- ✅ **11 utility documentation pages**
- ✅ **Full-text search** powered by Nextra
- ✅ **Dark mode support**
- ✅ **Mobile-responsive design**
- ✅ **Code syntax highlighting**
- ✅ **Interactive examples**

## Troubleshooting

### Build Fails

If the build fails, ensure all packages are built first:

```bash
pnpm build
```

### Missing Components in Storybook

Verify the component is exported from the package index:

- Web: `packages/web/src/index.ts`
- Native: `packages/native/src/index.ts`

### Documentation Site Build Fails

Ensure all packages are built before building docs:

```bash
pnpm build
pnpm --filter @tesserix/docs build
```

Check that the Next.js version is compatible (requires Next.js 16+)

### Chromatic Upload Fails

Check your Chromatic project token is set correctly:

```bash
echo $CHROMATIC_PROJECT_TOKEN
```

## Support

For issues or questions:

- GitHub Issues: https://github.com/tesserix/design-system/issues
- Documentation: https://docs.tesserix.app
- Storybook: https://ui.tesserix.app
