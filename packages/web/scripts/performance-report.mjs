import { gzipSync } from "node:zlib"
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const metrics = [
  { id: "esm", path: join(rootDir, "dist", "index.mjs") },
  { id: "cjs", path: join(rootDir, "dist", "index.js") },
  { id: "types", path: join(rootDir, "dist", "index.d.ts") },
]

const formatKb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`
const roundKb = (bytes) => Number((bytes / 1024).toFixed(2))
const reportFile = process.env.PERFORMANCE_REPORT_FILE ?? join(rootDir, "artifacts", "performance-report.json")

const report = {
  generatedAt: new Date().toISOString(),
  metrics: {},
}

console.log("Performance Report")
console.log("------------------")

for (const metric of metrics) {
  const rawBytes = statSync(metric.path).size
  const source = readFileSync(metric.path)
  const gzipBytes = gzipSync(source).byteLength

  console.log(`${metric.id.toUpperCase()} raw: ${formatKb(rawBytes)} | gzip: ${formatKb(gzipBytes)}`)
  report.metrics[metric.id] = {
    rawKb: roundKb(rawBytes),
    gzipKb: roundKb(gzipBytes),
    path: metric.path,
  }
}

const bundleLimitKb = Number(process.env.BUNDLE_SIZE_LIMIT_KB ?? 70)
const esmGzipKb = gzipSync(readFileSync(join(rootDir, "dist", "index.mjs"))).byteLength / 1024

if (esmGzipKb > bundleLimitKb) {
  console.error(`\nESM bundle exceeds budget (${esmGzipKb.toFixed(2)} KB > ${bundleLimitKb} KB)`)
  process.exit(1)
}

console.log(`\nBundle budget check passed (${esmGzipKb.toFixed(2)} KB <= ${bundleLimitKb} KB)`)

report.bundleLimitKb = bundleLimitKb
report.budgetStatus = "pass"

mkdirSync(join(rootDir, "artifacts"), { recursive: true })
writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`)
console.log(`Performance report written to ${reportFile}`)
