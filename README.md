# Tesserix Design System

A comprehensive design system for web and React Native applications, built with TypeScript, Tailwind CSS, and shadcn/ui principles.

## Links

- **Documentation**: [docs.tesserix.app](https://docs.tesserix.app)
- **Storybook**: [ui.tesserix.app](https://ui.tesserix.app)
- **Chromatic**: [chromatic.com/library?appId=699e8c384ce106a70ccc4c6d](https://www.chromatic.com/library?appId=699e8c384ce106a70ccc4c6d)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Build System | Turborepo + pnpm workspaces |
| Language | TypeScript 5.9 |
| Web | React 19, Tailwind CSS, Radix UI |
| Native | React Native 0.76, Expo |
| Animations | Framer Motion |
| Testing | Jest, Vitest, React Testing Library |
| Docs | Storybook 10 |
| Visual Regression | Chromatic |
| Versioning | Changesets |
| CI/CD | GitHub Actions |

## Monorepo Structure

```
design-system/
├── packages/
│   ├── tokens/          # @tesserix/tokens - Design tokens (colors, spacing, typography)
│   ├── web/             # @tesserix/web - Web components (React + Tailwind)
│   └── native/          # @tesserix/native - React Native components (30+ components)
├── apps/
│   └── storybook/       # Storybook app with a11y addon
├── turbo.json           # Turborepo pipeline config
├── pnpm-workspace.yaml  # Workspace definition
└── tsconfig.base.json   # Shared TypeScript config
```

## Packages

### @tesserix/tokens

Platform-agnostic design tokens shared across web and native.

```bash
pnpm add @tesserix/tokens
```

### @tesserix/web

React components for web applications built with Tailwind CSS.

```bash
pnpm add @tesserix/web
```

### @tesserix/native

React Native components for iOS and Android (Expo-first). Includes 30+ components: SafeAreaView, DataGrid, Form, Tabs, DragAndDrop, InfiniteScroll, and more.

```bash
pnpm add @tesserix/native
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
git clone git@github.com:tesserix/design-system.git
cd design-system

pnpm install
pnpm build
pnpm dev
```

## Development

### Available Scripts

```bash
pnpm build            # Build all packages
pnpm dev              # Run in development mode
pnpm lint             # Lint all packages
pnpm type-check       # Type check all packages
pnpm test             # Run tests
pnpm storybook        # Run Storybook
pnpm build-storybook  # Build Storybook
```

### Adding a Changeset

When making changes, add a changeset to track versions:

```bash
pnpm changeset
```

### Publishing

```bash
pnpm version-packages   # Version packages based on changesets
pnpm release             # Build and publish to registry
```

## Design Principles

- **Consistent**: Unified design language across web and mobile
- **Accessible**: WCAG 2.1 AA compliant
- **Performant**: Optimized for production use
- **Flexible**: Theming and customization support
- **Type-safe**: Full TypeScript support

## License

MIT
