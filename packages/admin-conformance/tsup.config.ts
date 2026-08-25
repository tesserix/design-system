import { defineConfig } from "tsup"

export default defineConfig({
  // Two entries: the library (for anyone embedding the runner) and the CLI,
  // which is what §5 of the contract actually documents.
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: false,
  // The published bin is `dist/cli.js` — CJS, so it runs under `npx` without
  // depending on the consuming repo's "type" field.
  //
  // The shebang is NOT set here: a tsup banner applies to every entry, and a
  // "#!" line on the library entry is noise at best. It lives at the top of
  // src/cli.ts instead, which esbuild preserves for an entry file.
})
