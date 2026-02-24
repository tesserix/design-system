import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/web.ts',
    'src/native.tsx',
    'src/custom/index.tsx',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  external: ['react', 'react-native', 'react-native-svg', 'lucide-react', 'lucide-react-native'],
})
