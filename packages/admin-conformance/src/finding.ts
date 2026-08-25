/**
 * One conformance result.
 *
 * A finding is either a pass, a failure, or a skip. There is deliberately no
 * "warning": the contract's §5 says the suite **fails on any implemented
 * endpoint that deviates**, and a warning is how a deviation becomes permanent.
 */
export type Status = "pass" | "fail" | "skip"

export interface Finding {
  readonly endpoint: string
  /** The contract section this check enforces, e.g. "4.1". */
  readonly section: string
  readonly status: Status
  /** What was checked, phrased so a passing line reads as a statement of fact. */
  readonly check: string
  /** Present on a failure: what was seen, and what the contract requires. */
  readonly detail?: string
}

export const pass = (
  endpoint: string,
  section: string,
  check: string,
): Finding => ({ endpoint, section, status: "pass", check })

export const fail = (
  endpoint: string,
  section: string,
  check: string,
  detail: string,
): Finding => ({ endpoint, section, status: "fail", check, detail })

export const skip = (
  endpoint: string,
  section: string,
  check: string,
  detail?: string,
): Finding => ({ endpoint, section, status: "skip", check, detail })

export const failed = (findings: readonly Finding[]): Finding[] =>
  findings.filter((f) => f.status === "fail")
