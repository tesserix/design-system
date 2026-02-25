import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..', '..')

const config: StorybookConfig = {
  stories: [
    '../../../packages/web/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../../../packages/native/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    'storybook/essentials',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config, { configType }) {
    config.plugins = config.plugins || []
    config.plugins.push(tailwindcss())

    // Ensure esbuild handles JSX properly with automatic React runtime
    config.esbuild = config.esbuild || {}
    config.esbuild.jsx = 'automatic'
    config.esbuild.jsxDev = configType === 'DEVELOPMENT'

    // Make React available globally for react-native-web
    config.define = config.define || {}
    config.define.global = 'globalThis'
    config.define['process.env.NODE_ENV'] =
      configType === 'PRODUCTION' ? '"production"' : '"development"'

    // Allow Storybook/Vite to load stories and source files from monorepo packages.
    config.server = config.server || {}
    config.server.fs = config.server.fs || {}
    config.server.fs.allow = Array.from(
      new Set([...(config.server.fs.allow || []), repoRoot, join(repoRoot, 'packages')])
    )

    // Configure react-native-web aliases
    config.resolve = config.resolve || {}
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : Object.entries(config.resolve.alias || {}).map(([find, replacement]) => ({
          find,
          replacement,
        }))

    const rnWebPath = join(__dirname, '../node_modules/react-native-web')
    const styleqPath = join(repoRoot, 'node_modules/.pnpm/styleq@0.1.3/node_modules/styleq')
    config.resolve.alias = [
      ...existingAliases,
      { find: /^react-native$/, replacement: rnWebPath },
      { find: /^react-native-web$/, replacement: rnWebPath },
      { find: /^react-native-web\/(.*)$/, replacement: `${rnWebPath}/$1` },
      {
        find: /^inline-style-prefixer\/lib\/(.*)$/,
        replacement: 'inline-style-prefixer/es/$1',
      },
      {
        find: /^postcss-value-parser$/,
        replacement: join(__dirname, 'shims/postcss-value-parser.ts'),
      },
      {
        find: /^@react-native\/normalize-colors$/,
        replacement: join(__dirname, 'shims/normalize-colors.ts'),
      },
      {
        find: /^@react-native\/normalize-colors\/index$/,
        replacement: join(__dirname, 'shims/normalize-colors.ts'),
      },
      {
        find: /^@react-native\/normalize-colors\/index\.js$/,
        replacement: join(__dirname, 'shims/normalize-colors.ts'),
      },
      {
        find: /^styleq$/,
        replacement: `${styleqPath}/dist/styleq.js`,
      },
      {
        find: /^styleq\/transform-localize-style$/,
        replacement: `${styleqPath}/dist/transform-localize-style.js`,
      },
      {
        find: /^styleq\/transform-localize-style\.js$/,
        replacement: `${styleqPath}/dist/transform-localize-style.js`,
      },
      {
        find: /^fbjs\/lib\/invariant$/,
        replacement: join(__dirname, 'shims/fbjs-invariant.ts'),
      },
      {
        find: /^fbjs\/lib\/invariant\.js$/,
        replacement: join(__dirname, 'shims/fbjs-invariant.ts'),
      },
      {
        find: /^fbjs\/lib\/warning$/,
        replacement: join(__dirname, 'shims/fbjs-warning.ts'),
      },
      {
        find: /^fbjs\/lib\/warning\.js$/,
        replacement: join(__dirname, 'shims/fbjs-warning.ts'),
      },
      {
        find: /^nullthrows$/,
        replacement: join(__dirname, 'shims/nullthrows.ts'),
      },
      {
        find: /^nullthrows\/nullthrows$/,
        replacement: join(__dirname, 'shims/nullthrows.ts'),
      },
      {
        find: /^nullthrows\/nullthrows\.js$/,
        replacement: join(__dirname, 'shims/nullthrows.ts'),
      },
      {
        find: /^@react-native-community\/datetimepicker$/,
        replacement: join(__dirname, 'shims/datetimepicker.tsx'),
      },
      { find: /^@tesserix\/native$/, replacement: join(repoRoot, 'packages/native/src/index.ts') },
      {
        find: /^@tesserix\/native\/(.*)$/,
        replacement: `${join(repoRoot, 'packages/native/src')}/$1`,
      },
      { find: /^@tesserix\/web$/, replacement: join(repoRoot, 'packages/web/src/index.ts') },
      { find: /^@tesserix\/web\/(.*)$/, replacement: `${join(repoRoot, 'packages/web/src')}/$1` },
      { find: /^@tesserix\/hooks$/, replacement: join(repoRoot, 'packages/hooks/src/index.ts') },
      {
        find: /^@tesserix\/hooks\/(.*)$/,
        replacement: `${join(repoRoot, 'packages/hooks/src')}/$1`,
      },
      { find: /^@tesserix\/utils$/, replacement: join(repoRoot, 'packages/utils/src/index.ts') },
      {
        find: /^@tesserix\/utils\/(.*)$/,
        replacement: `${join(repoRoot, 'packages/utils/src')}/$1`,
      },
      { find: /^@tesserix\/icons$/, replacement: join(repoRoot, 'packages/icons/src/index.ts') },
      { find: /^@tesserix\/icons\/(.*)$/, replacement: `${join(repoRoot, 'packages/icons/src')}/$1` },
      { find: /^@tesserix\/tokens$/, replacement: join(repoRoot, 'packages/tokens/src/index.ts') },
      {
        find: /^@tesserix\/tokens\/(.*)$/,
        replacement: `${join(repoRoot, 'packages/tokens/src')}/$1`,
      },
    ]

    // Add react-native file extensions
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      ...(config.resolve.extensions || []),
    ]

    // Completely exclude react-native from processing
    config.optimizeDeps = config.optimizeDeps || {}
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      'react-native',
      '@react-native/normalize-colors',
      '@react-native/virtualized-lists',
      '@react-native/assets-registry',
    ]
    config.optimizeDeps.force = true
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'react-native-web',
    ]
    config.optimizeDeps.needsInterop = config.optimizeDeps.needsInterop || []

    // Tell Vite to not try to process react-native at all
    config.build = config.build || {}
    config.build.commonjsOptions = {
      ...(config.build.commonjsOptions || {}),
      exclude: [/node_modules\/react-native\//],
    }

    return config
  },
}

export default config
