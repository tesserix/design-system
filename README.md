# Tesserix Design System

A comprehensive design system for web and React Native applications, built with TypeScript, Tailwind CSS, and shadcn/ui principles.

## 🏗️ Monorepo Structure

```
tesserix/design-system
├── packages/
│   ├── tokens/          # @tesserix/tokens - Design tokens (colors, spacing, typography)
│   ├── web/             # @tesserix/web - Web components (React + Tailwind)
│   └── native/          # @tesserix/native - React Native components
├── apps/
│   └── docs/            # Documentation site
└── MONOREPO_MIGRATION_PLAN.md
```

## 📦 Packages

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
React Native components for iOS and Android (Expo-first).

```bash
pnpm add @tesserix/native
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Clone the repository
git clone git@github.com:tesserix/design-system.git
cd design-system

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

## 🛠️ Development

### Available Scripts

```bash
# Build all packages
pnpm build

# Run in development mode
pnpm dev

# Lint all packages
pnpm lint

# Type check all packages
pnpm type-check

# Run tests
pnpm test

# Run Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

### Adding a Changeset

When making changes, add a changeset to track versions:

```bash
pnpm changeset
```

### Publishing

```bash
# Version packages based on changesets
pnpm version-packages

# Build and publish to registry
pnpm release
```

## 📚 Documentation

Comprehensive documentation will be available at the docs site (coming soon).

## 🎨 Design Principles

- **Consistent**: Unified design language across web and mobile
- **Accessible**: WCAG 2.1 AA compliant
- **Performant**: Optimized for production use
- **Flexible**: Theming and customization support
- **Type-safe**: Full TypeScript support

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines (coming soon).

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [GitHub Repository](https://github.com/tesserix/design-system)
- [Documentation](https://design-system.tesserix.dev) (coming soon)
- [Storybook](https://storybook.tesserix.dev) (coming soon)

---

Built with ❤️ by Tesserix
