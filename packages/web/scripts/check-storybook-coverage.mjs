import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const COVERAGE_FINAL_FILE = path.resolve("coverage/coverage-final.json")
const COVERAGE_SUMMARY_FILE = path.resolve("coverage/coverage-summary.json")

const GLOBAL_THRESHOLDS = {
  statements: 75,
  branches: 65,
  functions: 70,
  lines: 75,
}

const FILE_THRESHOLDS = [
  {
    suffix: "src/components/data-table/data-table.tsx",
    thresholds: { statements: 90, branches: 75, functions: 95, lines: 95 },
  },
  {
    suffix: "src/components/context-menu/context-menu.tsx",
    thresholds: { statements: 90, branches: 70, functions: 85, lines: 95 },
  },
  {
    suffix: "src/components/dialog/dialog.tsx",
    thresholds: { statements: 90, branches: 75, functions: 90, lines: 92 },
  },
  {
    suffix: "src/components/sheet/sheet.tsx",
    thresholds: { statements: 90, branches: 75, functions: 90, lines: 92 },
  },
]

const percent = (covered, total) => (total === 0 ? 100 : (covered / total) * 100)

const getMetrics = (entry) => {
  const statementCounts = Object.values(entry.s ?? {})
  const functionCounts = Object.values(entry.f ?? {})
  const lineCounts = Object.values(entry.l ?? {})
  const branchCounts = Object.values(entry.b ?? {}).flatMap((branchHits) => branchHits)

  const statementCovered = statementCounts.filter((count) => count > 0).length
  const functionCovered = functionCounts.filter((count) => count > 0).length
  const lineCovered = lineCounts.filter((count) => count > 0).length
  const branchCovered = branchCounts.filter((count) => count > 0).length

  return {
    statements: percent(statementCovered, statementCounts.length),
    functions: percent(functionCovered, functionCounts.length),
    lines: percent(lineCovered, lineCounts.length),
    branches: percent(branchCovered, branchCounts.length),
  }
}

const formatMetric = (value) => value.toFixed(2)

const assertThresholds = (label, metrics, thresholds, errors) => {
  for (const [metric, threshold] of Object.entries(thresholds)) {
    const actual = metrics[metric]
    if (actual < threshold) {
      errors.push(
        `${label}: ${metric} ${formatMetric(actual)}% is below threshold ${threshold}%`
      )
    }
  }
}

const loadFromCoverageFinal = () => {
  const raw = readFileSync(COVERAGE_FINAL_FILE, "utf8")
  const coverage = JSON.parse(raw)

  const metricsByFile = Object.fromEntries(
    Object.entries(coverage).map(([filePath, entry]) => [filePath, getMetrics(entry)])
  )

  const globalAccumulator = {
    statements: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
    lines: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
  }

  for (const entry of Object.values(coverage)) {
    const statementCounts = Object.values(entry.s ?? {})
    const functionCounts = Object.values(entry.f ?? {})
    const lineCounts = Object.values(entry.l ?? {})
    const branchCounts = Object.values(entry.b ?? {}).flatMap((branchHits) => branchHits)

    globalAccumulator.statements.covered += statementCounts.filter((count) => count > 0).length
    globalAccumulator.statements.total += statementCounts.length

    globalAccumulator.functions.covered += functionCounts.filter((count) => count > 0).length
    globalAccumulator.functions.total += functionCounts.length

    globalAccumulator.lines.covered += lineCounts.filter((count) => count > 0).length
    globalAccumulator.lines.total += lineCounts.length

    globalAccumulator.branches.covered += branchCounts.filter((count) => count > 0).length
    globalAccumulator.branches.total += branchCounts.length
  }

  const globalMetrics = {
    statements: percent(globalAccumulator.statements.covered, globalAccumulator.statements.total),
    functions: percent(globalAccumulator.functions.covered, globalAccumulator.functions.total),
    lines: percent(globalAccumulator.lines.covered, globalAccumulator.lines.total),
    branches: percent(globalAccumulator.branches.covered, globalAccumulator.branches.total),
  }

  return { metricsByFile, globalMetrics }
}

const loadFromCoverageSummary = () => {
  const summaryRaw = readFileSync(COVERAGE_SUMMARY_FILE, "utf8")
  const summary = JSON.parse(summaryRaw)

  const globalMetrics = {
    statements: Number(summary?.total?.statements?.pct ?? 0),
    branches: Number(summary?.total?.branches?.pct ?? 0),
    functions: Number(summary?.total?.functions?.pct ?? 0),
    lines: Number(summary?.total?.lines?.pct ?? 0),
  }

  const metricsByFile = Object.fromEntries(
    Object.entries(summary)
      .filter(([filePath]) => filePath !== "total")
      .map(([filePath, entry]) => [
        filePath,
        {
          statements: Number(entry?.statements?.pct ?? 0),
          branches: Number(entry?.branches?.pct ?? 0),
          functions: Number(entry?.functions?.pct ?? 0),
          lines: Number(entry?.lines?.pct ?? 0),
        },
      ])
  )

  return { metricsByFile, globalMetrics }
}

let metricsByFile
let globalMetrics

if (existsSync(COVERAGE_FINAL_FILE)) {
  ;({ metricsByFile, globalMetrics } = loadFromCoverageFinal())
} else if (existsSync(COVERAGE_SUMMARY_FILE)) {
  ;({ metricsByFile, globalMetrics } = loadFromCoverageSummary())
} else {
  console.error("Coverage threshold check failed:")
  console.error(`- Missing ${COVERAGE_FINAL_FILE} and ${COVERAGE_SUMMARY_FILE}`)
  process.exit(1)
}

const errors = []
assertThresholds("Global", globalMetrics, GLOBAL_THRESHOLDS, errors)

for (const rule of FILE_THRESHOLDS) {
  const match = Object.entries(metricsByFile).find(([filePath]) => filePath.endsWith(rule.suffix))
  if (!match) {
    errors.push(`Missing coverage entry for ${rule.suffix}`)
    continue
  }
  const [, metrics] = match
  assertThresholds(rule.suffix, metrics, rule.thresholds, errors)
}

if (errors.length > 0) {
  console.error("Coverage threshold check failed:")
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log("Coverage threshold check passed.")
console.log(
  `Global coverage: statements ${formatMetric(globalMetrics.statements)}%, branches ${formatMetric(globalMetrics.branches)}%, functions ${formatMetric(globalMetrics.functions)}%, lines ${formatMetric(globalMetrics.lines)}%`
)
