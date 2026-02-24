# Tesserix Design System - Monorepo Migration Plan

## Overview
Migrate `tesserix-ui` to a monorepo structure supporting both web and React Native components under the `@tesserix/*` scope.

## Goals
- ✅ Share design tokens across web and native platforms
- ✅ Establish an Expo-first React Native package that also works in bare RN apps
- ✅ Use independent versioning with Changesets-managed releases
- ✅ Unified documentation with platform-specific guides
- ✅ Separate Storybook instances for web and native
- ✅ Keep a lightweight `tesserix-ui` alias package for future migration compatibility

---

## Final Structure

```
tesserix-ui/                          # Monorepo root
├── packages/
│   ├── tokens/                       # @tesserix/tokens
│   │   ├── src/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── breakpoints.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                          # @tesserix/web (current tesserix-ui)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── .storybook/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── native/                       # @tesserix/native (new)
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── utils/
│       │   └── index.ts
│       ├── .storybook/
│       ├── package.json
│       └── tsconfig.json
│
├── apps/
│   ├── docs/                         # Unified docs site (Vercel)
│   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── getting-started/
│   │   │   │   ├── web.mdx
│   │   │   │   └── native.mdx
│   │   │   └── tokens.mdx
│   │   └── package.json
│   │
│   └── storybook-native/             # RN Storybook app (optional)
│       ├── .storybook/
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── storybook-ci.yml          # Chromatic for web
│       ├── storybook-native-ci.yml   # Chromatic for native
│       ├── deploy-docs.yml           # Vercel deployment
│       ├── publish.yml               # npm publish all packages
│       └── ci.yml                    # Build, test, lint
│
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspaces config
├── turbo.json                        # Turborepo config
├── tsconfig.base.json                # Shared TypeScript config
└── .changeset/                       # Changesets for versioning
```

---

## Phase 1: Setup Monorepo Infrastructure

### 1.1 Initialize Monorepo Tools
- [ ] Install pnpm: `npm install -g pnpm`
- [ ] Install Turborepo: `pnpm add -Dw turbo`
- [ ] Install Changesets: `pnpm add -Dw @changesets/cli && pnpm changeset init`
- [ ] Create `pnpm-workspace.yaml`
- [ ] Create `turbo.json`
- [ ] Update root `package.json` with workspace config

### 1.2 Create NPM Organization
- [ ] Create NPM org: `npm org create tesserix`
- [ ] Add team members if needed
- [ ] Configure publishing permissions

### 1.3 Setup Base Configurations
- [ ] Create `tsconfig.base.json` for shared TypeScript config
- [ ] Setup ESLint shared config
- [ ] Setup Prettier config
- [ ] Setup shared testing config (Vitest/Jest)

---

## Phase 2: Extract Design Tokens Package

### 2.1 Create Tokens Package
- [ ] Create `packages/tokens/` directory
- [ ] Initialize `package.json` with name `@tesserix/tokens`
- [ ] Extract design tokens from current codebase:
  - Colors (primitives + semantic)
  - Spacing scale
  - Typography (font families, sizes, weights, line heights)
  - Border radius
  - Shadows
  - Breakpoints
  - Z-index scale
  - Transitions/animations

### 2.2 Token Format
Choose platform-agnostic format:
```typescript
// packages/tokens/src/colors.ts
export const colors = {
  primitive: {
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      // ...
    },
  },
  semantic: {
    primary: {
      default: '#3b82f6',
      hover: '#2563eb',
      // ...
    },
  },
};
```

### 2.3 Build & Publish Setup
- [ ] Configure TypeScript build (emit .d.ts files)
- [ ] Add build script: `tsc -p tsconfig.json`
- [ ] Test local consumption
- [ ] Publish v1.0.0 to npm

---

## Phase 3: Migrate Web Package

### 3.1 Move Current Code
- [ ] Create `packages/web/` directory
- [ ] Move all current source code to `packages/web/src/`
- [ ] Move Storybook config to `packages/web/.storybook/`
- [ ] Move tests to `packages/web/`

### 3.2 Update Package Configuration
- [ ] Update `package.json`:
  - Change name to `@tesserix/web`
  - Add dependency on `@tesserix/tokens`
  - Update exports and entry points
- [ ] Update imports to use `@tesserix/tokens`
- [ ] Update TypeScript config to extend base config

### 3.3 Maintain Backward Compatibility
Create alias package for `tesserix-ui`:
- [ ] Create `packages/tesserix-ui/` (small wrapper)
- [ ] Re-export everything from `@tesserix/web`
- [ ] Add deprecation notice in README
- [ ] Publish with notice: "This package is deprecated. Use @tesserix/web instead."
- [ ] Document that there are currently no external consumers, so this alias is preventive for future migrations

### 3.4 Update Documentation & Storybook
- [ ] Update Storybook stories paths
- [ ] Update component imports in stories
- [ ] Test Storybook build locally
- [ ] Update Chromatic project settings if needed

---

## Phase 4: Create React Native Package

### 4.1 Setup Native Package Structure
- [ ] Create `packages/native/` directory
- [ ] Initialize `package.json` with name `@tesserix/native`
- [ ] Add dependencies:
  - `react-native`
  - `@tesserix/tokens`
  - Platform-specific libs (if needed)
- [ ] Expo-first compatibility baseline:
  - Add Expo example app under `apps/` for real-consumer testing
  - Ensure Metro workspace resolution works with monorepo packages
  - Avoid native modules that require ejecting unless explicitly planned
  - Keep package compatible with bare React Native consumers

### 4.2 Create Core Components
Start with essentials (reimplement using RN primitives):
- [ ] **Layout**: Box, Stack, Flex, Container
- [ ] **Typography**: Text, Heading
- [ ] **Buttons**: Button, IconButton
- [ ] **Forms**: TextInput, Checkbox, Radio, Switch
- [ ] **Feedback**: Alert, Toast, Spinner
- [ ] **Data Display**: Card, Badge, Avatar

### 4.3 Setup React Native Storybook
- [ ] Install `@storybook/react-native`
- [ ] Configure `.storybook/main.js`
- [ ] Create example stories
- [ ] Setup Storybook app in `apps/storybook-native/` (optional)
- [ ] Configure for iOS/Android testing

### 4.4 Platform-Specific Adaptations
- [ ] Create platform utilities (iOS vs Android detection)
- [ ] Implement platform-specific component variants
- [ ] Add gesture handling (if needed)
- [ ] Test on both iOS and Android
- [ ] Validate both Expo app and bare RN app consumption paths before publish

---

## Phase 5: Unified Documentation Site

### 5.1 Setup Docs Site
- [ ] Move/create `apps/docs/`
- [ ] Setup Next.js or Vite-based docs site
- [ ] Configure to consume both `@tesserix/web` and `@tesserix/native`
- [ ] Add dependency on `@tesserix/tokens`

### 5.2 Create Documentation Structure
```
apps/docs/pages/
├── index.mdx                    # Homepage
├── getting-started/
│   ├── installation.mdx
│   ├── web.mdx                  # Web setup guide
│   └── native.mdx               # RN setup guide
├── tokens/
│   ├── colors.mdx
│   ├── typography.mdx
│   └── spacing.mdx
└── components/
    ├── button/
    │   ├── index.mdx            # Overview & design principles
    │   ├── web.mdx              # Web implementation
    │   └── native.mdx           # Native implementation
    └── ...
```

### 5.3 Integrate Storybooks
- [ ] Embed/link web Storybook
- [ ] Link to native Storybook (if deployed)
- [ ] Add platform switcher UI
- [ ] Add code examples for both platforms

### 5.4 Deploy
- [ ] Deploy to Vercel
- [ ] Update custom domain (if applicable)
- [ ] Add deployment preview for PRs

---

## Phase 6: CI/CD & Automation

### 6.1 Build Pipeline
Create `.github/workflows/ci.yml`:
- [ ] Run on all packages with Turborepo caching
- [ ] Lint all packages
- [ ] Type check all packages
- [ ] Run tests for all packages
- [ ] Build all packages

### 6.2 Storybook CI
Update `.github/workflows/storybook-ci.yml`:
- [ ] Build web Storybook
- [ ] Publish to Chromatic
- [ ] Comment PR with Storybook link

Create `.github/workflows/storybook-native-ci.yml`:
- [ ] Build native Storybook
- [ ] Publish to Chromatic (RN support)
- [ ] Comment PR with Storybook link

### 6.3 Publishing Workflow
Create `.github/workflows/publish.yml`:
- [ ] Trigger via Changesets release flow (release PR + publish step), with optional manual dispatch
- [ ] Build all packages
- [ ] Run tests
- [ ] Publish changed packages to npm using Changesets
- [ ] Create GitHub release

### 6.4 Changesets Integration
- [ ] Configure `.changeset/config.json`
- [x] Setup versioning strategy: independent
- [ ] Add changeset bot to PRs
- [ ] Document how to add changesets

---

## Phase 7: Migration & Publishing

### 7.1 Pre-publish Checklist
- [ ] All packages build successfully
- [ ] All tests pass
- [ ] Storybook builds for both platforms
- [ ] Documentation site builds
- [ ] Local testing of published packages (use `npm link` or `pnpm link`)
- [ ] Validate Expo sample app installs and runs with workspace packages
- [ ] Validate bare RN sample app installs and runs with published `@tesserix/native`

### 7.2 Initial Publish
Publish in order:
1. [ ] Publish `@tesserix/tokens@1.0.0`
2. [ ] Publish `@tesserix/web@2.0.0` (breaking change due to rename)
3. [ ] Publish `tesserix-ui@2.0.0` (deprecated alias)
4. [ ] Publish `@tesserix/native@1.0.0`

### 7.3 Update Existing Consumers
For web consumers:
```diff
{
  "dependencies": {
-   "tesserix-ui": "^1.2.1"
+   "@tesserix/web": "^2.0.0"
  }
}
```

### 7.4 Communication
- [ ] Publish migration guide
- [ ] Announce on npm (in README)
- [ ] Update GitHub repository description
- [ ] Notify existing users (if applicable)

---

## Phase 8: Post-Migration

### 8.1 Monitor & Support
- [ ] Monitor npm downloads
- [ ] Watch for issues/bugs
- [ ] Provide migration support
- [ ] Update documentation based on feedback

### 8.2 Future Enhancements
- [ ] Add `@tesserix/icons` package (shared icon set)
- [ ] Add `@tesserix/cli` for scaffolding
- [ ] Add `@tesserix/eslint-config`
- [ ] Add `@tesserix/tailwind-preset` (for web)
- [ ] Consider `react-native-web` for code sharing

---

## Package Versioning Strategy

### Selected: Independent Versioning
Each package has its own version:
- `@tesserix/tokens@1.0.0`
- `@tesserix/web@2.0.0`
- `@tesserix/native@1.0.0`

Release orchestration will be handled by Changesets.

---

## Testing Strategy

### Per Package
- **tokens**: Type tests, export validation
- **web**: Unit tests (Vitest), component tests (Testing Library)
- **native**: Unit tests (Jest), component tests (React Native Testing Library)

### Integration
- Test consuming packages locally
- Test Storybook builds
- Visual regression testing (Chromatic)

---

## Timeline Estimate

| Phase | Estimated Time |
|-------|---------------|
| Phase 1: Monorepo Setup | 1-2 days |
| Phase 2: Tokens Package | 2-3 days |
| Phase 3: Web Package Migration | 3-4 days |
| Phase 4: Native Package Creation | 1-2 weeks |
| Phase 5: Unified Documentation | 3-5 days |
| Phase 6: CI/CD Setup | 2-3 days |
| Phase 7: Publishing | 1 day |
| Phase 8: Post-Migration | Ongoing |
| **Total** | **3-4 weeks** |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking changes for future consumers | Medium | Keep `tesserix-ui` alias package, maintain migration guide from day one |
| Native component parity delays | Medium | Start with core components, add more iteratively |
| Expo and bare RN compatibility drift | High | Maintain both Expo and bare RN sample apps in CI smoke checks |
| CI/CD complexity increases | Medium | Use Turborepo caching, optimize builds |
| Documentation maintenance overhead | Low | Use automated tools, share content where possible |
| NPM scope name conflicts | Low | Already verified `@tesserix` is available |

---

## Success Metrics

- [ ] All packages published successfully
- [ ] Zero downtime for existing consumers
- [ ] Both Storybook instances deployed
- [ ] Unified docs site live
- [ ] CI/CD green for all packages
- [ ] First native component library ready for consumption
- [ ] Positive feedback from early adopters

---

## Questions to Resolve

1. **Monorepo Tool**: Turborepo, Nx, or plain pnpm workspaces?
   - **Recommendation**: Turborepo (balance of features and simplicity)

2. **Native Storybook Deployment**: Deploy separately or within main docs?
   - **Recommendation**: Deploy separately, link from docs

3. **Component Parity**: Should native match web 1:1 or adapt to platform?
   - **Recommendation**: Adapt to platform conventions

4. **TypeScript**: Strict mode for all packages?
   - **Recommendation**: Yes, enable strict mode

5. **Native baseline**: Is Expo sample app required in CI for every publish?
   - **Recommendation**: Yes (plus periodic bare RN compatibility checks)

---

## Resources

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Changesets](https://github.com/changesets/changesets)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Storybook React Native](https://storybook.js.org/tutorials/intro-to-storybook/react-native/en/get-started/)
- [Design Tokens Community Group](https://design-tokens.github.io/community-group/)

---

## Next Steps

1. Review and approve this plan
2. Create GitHub project board for tracking
3. Begin Phase 1: Monorepo setup
4. Schedule regular sync meetings for progress updates

---

*Last Updated: 2026-02-25*
