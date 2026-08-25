import { describe, expect, it } from "vitest"

import { parseArgs, USAGE } from "./cli"

describe("parseArgs", () => {
  const argv = (...args: string[]) => ["--base", "https://x/api/v1/platform", ...args]

  it("reads the documented invocation from contract §5", () => {
    const parsed = parseArgs(
      ["--base", "https://m.invalid/api/v1/platform", "--slug", "mark8ly"],
      { ADMIN_CONFORMANCE_SECRET: "s" },
    )
    expect(parsed.base).toBe("https://m.invalid/api/v1/platform")
    expect(parsed.slug).toBe("mark8ly")
    expect(parsed.secret).toBe("s")
  })

  it("supports --key=value as well as --key value", () => {
    const parsed = parseArgs(
      ["--base=https://m.invalid", "--slug=kora"],
      { ADMIN_CONFORMANCE_SECRET: "s" },
    )
    expect(parsed.slug).toBe("kora")
  })

  // The secret must never be a flag. Anything passed on argv shows up in `ps`,
  // in CI step logs that echo the command, and in shell history.
  it("takes the secret from the environment, never from a flag", () => {
    expect(() => parseArgs(argv("--secret", "hunter2"), {})).toThrow(/environment|--secret/i)
  })

  it("refuses to run without a secret rather than reporting a wall of 401s", () => {
    expect(() => parseArgs(argv("--slug", "x"), {})).toThrow(/secret/i)
  })

  it("requires --base", () => {
    expect(() => parseArgs(["--slug", "x"], { ADMIN_CONFORMANCE_SECRET: "s" }))
      .toThrow(/--base/)
  })

  // Mounting at the wrong prefix returns 403 at the service mesh, before the
  // application — invisible in the product's own logs. Warning at parse time
  // is far cheaper than the afternoon that costs.
  it("warns when the base URL looks like it is missing a platform prefix", () => {
    const parsed = parseArgs(
      ["--base", "https://m.invalid/api/v1", "--slug", "mark8ly"],
      { ADMIN_CONFORMANCE_SECRET: "s" },
    )
    expect(parsed.warnings.join(" ")).toMatch(/prefix|platform/i)
  })

  it("does not warn on a base that already carries the prefix", () => {
    const parsed = parseArgs(
      ["--base", "https://m.invalid/api/v1/platform", "--slug", "mark8ly"],
      { ADMIN_CONFORMANCE_SECRET: "s" },
    )
    expect(parsed.warnings).toEqual([])
  })

  it("rejects an unknown flag rather than ignoring it", () => {
    expect(() => parseArgs(argv("--slugg", "x"), { ADMIN_CONFORMANCE_SECRET: "s" }))
      .toThrow(/--slugg/)
  })

  it("defaults the declaration path to the conventional filename", () => {
    const parsed = parseArgs(argv("--slug", "x"), { ADMIN_CONFORMANCE_SECRET: "s" })
    expect(parsed.declarationPath).toMatch(/admin-conformance\.json$/)
  })

  it("documents the environment variables in its usage text", () => {
    expect(USAGE).toMatch(/ADMIN_CONFORMANCE_SECRET/)
  })
})
