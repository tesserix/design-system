import { gzipSync } from "node:zlib"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const bundlePath = join(rootDir, "dist", "index.mjs")
const limitKb = Number(process.env.BUNDLE_SIZE_LIMIT_KB ?? 70)

const source = readFileSync(bundlePath, "utf8")
const gzippedBytes = gzipSync(source).byteLength
const gzippedKb = gzippedBytes / 1024

console.log(`Bundle size (gzip): ${gzippedKb.toFixed(2)} KB`)
console.log(`Limit: ${limitKb} KB`)

if (gzippedKb > limitKb) {
  console.error(`Bundle size check failed: ${gzippedKb.toFixed(2)} KB exceeds ${limitKb} KB`)
  process.exit(1)
}

console.log("Bundle size check passed")
