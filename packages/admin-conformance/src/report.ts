import type { Finding, Status } from "./finding"

/**
 * Renders `Finding[]` for a CI log, and decides the exit code.
 *
 * Everything here is shaped by where the output is actually read: a scrolled
 * log, long after the run, by someone who did not write the change. That makes
 * two properties matter more than the prose — a failure must be impossible to
 * skim past, and the same findings must always render the same bytes so a log
 * diff shows what changed rather than how the findings happened to be ordered.
 */

export interface ReportOptions {
  /**
   * Force colour on or off. Left undefined, it is decided from the
   * environment — see `shouldUseColor`.
   */
  readonly color?: boolean
  /** Injectable for tests. Defaults to `process.env`. */
  readonly env?: Readonly<Record<string, string | undefined>>
  /** Injectable for tests. Defaults to whether stdout is a TTY. */
  readonly isTty?: boolean
}

const RESET = `${String.fromCharCode(27)}[0m`

const SGR: Readonly<Record<Status, string>> = {
  pass: `${String.fromCharCode(27)}[32m`,
  fail: `${String.fromCharCode(27)}[31m`,
  skip: `${String.fromCharCode(27)}[33m`,
}

/** Fixed width so the check text of every line starts in the same column. */
const LABEL: Readonly<Record<Status, string>> = {
  pass: "PASS",
  fail: "FAIL",
  skip: "SKIP",
}

/**
 * Decides whether to emit ANSI codes.
 *
 * Default OFF under CI or when stdout is not a terminal. A CI log viewer that
 * does not interpret the codes prints them literally, so every line arrives
 * wrapped in `[31m`-style noise — and the failure, the one thing the reader
 * came for, is the hardest line to pick out of it. An explicit `color` always
 * wins: a caller who has checked their own renderer knows better than this
 * heuristic does.
 */
function shouldUseColor(options: ReportOptions): boolean {
  if (options.color !== undefined) return options.color

  const env = options.env ?? process.env
  if (env["CI"]) return false

  return options.isTty ?? Boolean(process.stdout?.isTTY)
}

/**
 * Orders two strings by code unit rather than by locale.
 *
 * `localeCompare` is the obvious choice and the wrong one: its ordering
 * depends on the machine's locale and ICU build, so the same findings would
 * render in a different order on a developer's laptop and on the CI runner —
 * which is exactly the diff noise the sort exists to remove.
 */
const byCodeUnit = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0)

/**
 * Groups findings by endpoint, preserving each group's input order.
 *
 * Insertion order of the map is not relied on; the caller sorts the keys.
 */
function groupByEndpoint(
  findings: readonly Finding[],
): Map<string, Finding[]> {
  const groups = new Map<string, Finding[]>()
  for (const finding of findings) {
    const existing = groups.get(finding.endpoint)
    if (existing) existing.push(finding)
    else groups.set(finding.endpoint, [finding])
  }
  return groups
}

/**
 * Sorts a group by section then check.
 *
 * Copies first: sorting in place would reorder the caller's array, and a
 * formatter that mutates its input is a bug waiting for the second caller.
 * Ties keep input order — `Array.prototype.sort` is stable — which is enough
 * for determinism because two findings alike in both fields render alike.
 */
function sortFindings(findings: readonly Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => byCodeUnit(a.section, b.section) || byCodeUnit(a.check, b.check),
  )
}

const count = (findings: readonly Finding[], status: Status): number =>
  findings.filter((f) => f.status === status).length

function countsLine(findings: readonly Finding[]): string {
  return [
    `${count(findings, "pass")} passed`,
    `${count(findings, "fail")} failed`,
    `${count(findings, "skip")} skipped`,
  ].join(", ")
}

function renderFinding(finding: Finding, color: boolean): string[] {
  const label = color
    ? `${SGR[finding.status]}${LABEL[finding.status]}${RESET}`
    : LABEL[finding.status]

  const lines = [`  ${label}  §${finding.section}  ${finding.check}`]

  // A failure without its detail says only that something is wrong, which
  // sends the reader to reproduce the run locally to find out what. A skip's
  // detail is the reason it was skipped, and is just as worth having.
  if (finding.detail) {
    lines.push(`        ${finding.detail}`)
  }
  return lines
}

/**
 * Formats findings as a plain-text report.
 *
 * Failures are printed twice on purpose: once in place, under the endpoint
 * they belong to, and once in a recap at the end. The recap is what survives a
 * long run — the reader lands at the bottom of the log, and the failures are
 * already there.
 */
export function formatReport(
  findings: readonly Finding[],
  options: ReportOptions = {},
): string {
  const color = shouldUseColor(options)
  const groups = groupByEndpoint(findings)
  const endpoints = [...groups.keys()].sort(byCodeUnit)

  const lines: string[] = ["admin-conformance", ""]

  for (const endpoint of endpoints) {
    const group = sortFindings(groups.get(endpoint) ?? [])
    lines.push(`${endpoint}  (${countsLine(group)})`)
    for (const finding of group) {
      lines.push(...renderFinding(finding, color))
    }
    lines.push("")
  }

  const failures = sortFindings(findings.filter((f) => f.status === "fail")).sort(
    (a, b) => byCodeUnit(a.endpoint, b.endpoint),
  )
  if (failures.length > 0) {
    const heading = `${failures.length} failing check${failures.length === 1 ? "" : "s"}`
    lines.push(color ? `${SGR.fail}${heading}${RESET}` : heading)
    for (const finding of failures) {
      lines.push(`  ${finding.endpoint}  §${finding.section}  ${finding.check}`)
      if (finding.detail) lines.push(`        ${finding.detail}`)
    }
    lines.push("")
  }

  // Printed even for an empty run: "0 checks" is a real result — it means
  // nothing was declared, or the declaration never reached the runner — and a
  // report that prints nothing at all looks like a crash.
  lines.push(
    `Summary: ${findings.length} checks — ${countsLine(findings)} across ${endpoints.length} endpoint${endpoints.length === 1 ? "" : "s"}`,
  )

  return `${lines.join("\n")}\n`
}

/**
 * The process exit code for a run.
 *
 * Any failure fails the build; skips never do. A skip means the product did
 * not declare that endpoint, and partial implementation is legitimate — the
 * contract is explicit that only a *declared* endpoint which deviates is a
 * failure. Failing on skips would push products to declare everything at once
 * or nothing at all, and nothing at all is what they would choose.
 */
export function exitCode(findings: readonly Finding[]): number {
  return findings.some((f) => f.status === "fail") ? 1 : 0
}
