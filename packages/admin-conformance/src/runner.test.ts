import { describe, expect, it, vi } from "vitest"

import { runConformance } from "./runner"
import type { Declaration } from "./declaration"

const declaration = (
  endpoints: Declaration["endpoints"],
  slug = "mark8ly",
): Declaration => ({ slug, contractVersion: 2, endpoints })

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })

const config = {
  base: "https://mark8ly.invalid/api/v1/platform",
  secret: "s",
  operator: "op",
  capability: "platform",
}

describe("runConformance", () => {
  it("calls only the endpoints a product declared", async () => {
    const fetchImpl = vi.fn(async () => json({ data: [], pagination: { page: 1, limit: 50, total: 0 } }))

    await runConformance({
      ...config,
      declaration: declaration({ "audit-logs": { implemented: true } }),
      fetchImpl,
    })

    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const [url] = fetchImpl.mock.calls[0] as unknown as [string]
    expect(new URL(url).pathname).toContain("/admin/audit-logs")
  })


  // The one endpoint the suite must never call. A conformance run that
  // suspended a live merchant's tenant to confirm the route conforms is a
  // worse outcome than an unchecked route, and there is no sandbox tenant to
  // point it at — so the check is against the declaration instead.
  it("never calls a declared tenant-lifecycle write", async () => {
    const fetchImpl = vi.fn(async () => json({}))

    const findings = await runConformance({
      ...config,
      declaration: declaration({
        "tenant-lifecycle": { implemented: true },
        "lifecycle/reason-codes": { implemented: true },
      }),
      fetchImpl,
    })

    const called = fetchImpl.mock.calls.map(
      ([url]) => new URL(url as unknown as string).pathname,
    )
    expect(called.some((path) => path.includes("/suspend"))).toBe(false)
    expect(
      findings.some((f) => f.endpoint === "tenant-lifecycle" && f.status === "skip"),
    ).toBe(true)
  })

  it("checks the reason-codes body it fetches", async () => {
    const fetchImpl = vi.fn(async () => json({ data: { suspend: [], unsuspend: [] } }))

    const findings = await runConformance({
      ...config,
      declaration: declaration({ "lifecycle/reason-codes": { implemented: true } }),
      fetchImpl,
    })

    const [url] = fetchImpl.mock.calls[0] as unknown as [string]
    expect(new URL(url).pathname).toContain("/admin/lifecycle/reason-codes")
    expect(
      findings.some((f) => f.endpoint === "lifecycle/reason-codes" && f.status === "fail"),
    ).toBe(true)
  })

  // The rule from #345, reached through the runner rather than called
  // directly: a product can be perfectly conforming on every wire response and
  // still have the gap.
  it("fails a run whose product declares the writes without the vocabulary", async () => {
    const fetchImpl = vi.fn(async () => json({}))

    const findings = await runConformance({
      ...config,
      declaration: declaration({ "tenant-lifecycle": { implemented: true } }),
      fetchImpl,
    })

    expect(
      findings.some((f) => f.endpoint === "tenant-lifecycle" && f.status === "fail"),
    ).toBe(true)
  })

  // Partial implementation is legitimate; silent deviation is not. An
  // undeclared endpoint must produce a visible skip rather than nothing at
  // all, or a product that quietly implements none reads as a clean run.
  it("reports an undeclared endpoint as a skip, not as absence", async () => {
    const fetchImpl = vi.fn(async () => json({}))

    const findings = await runConformance({
      ...config,
      declaration: declaration({ health: { implemented: true } }),
      fetchImpl,
    })

    const skipped = findings.filter((f) => f.status === "skip")
    expect(skipped.some((f) => f.endpoint === "audit-logs")).toBe(true)
    expect(skipped.some((f) => f.endpoint === "kpis")).toBe(true)
  })

  it("expands entities into one call per declared type", async () => {
    const fetchImpl = vi.fn(async () =>
      json({ data: [], pagination: { page: 1, limit: 50, total: 0 } }),
    )

    await runConformance({
      ...config,
      declaration: declaration({
        entities: { implemented: true, types: ["tenants", "users"] },
      }),
      fetchImpl,
    })

    const paths = fetchImpl.mock.calls.map(
      (call) => new URL((call as unknown as [string])[0]).pathname,
    )
    expect(paths).toEqual([
      "/api/v1/platform/admin/entities/tenants",
      "/api/v1/platform/admin/entities/users",
    ])
  })

  // A 401 here is the single most likely first-run failure — the far end
  // returns one opaque status for every rejection — so it must not surface as
  // twelve confusing shape violations.
  it("reports an authentication failure as one clear finding", async () => {
    const fetchImpl = vi.fn(async () => json({ error: "unauthenticated" }, 401))

    const findings = await runConformance({
      ...config,
      declaration: declaration({ "audit-logs": { implemented: true } }),
      fetchImpl,
    })

    const failures = findings.filter((f) => f.status === "fail")
    expect(failures).toHaveLength(1)
    expect(failures[0].detail).toMatch(/signature|secret|clock|401/i)
  })

  it("reports a 503 not_configured distinctly from a bad signature", async () => {
    const fetchImpl = vi.fn(async () => json({ error: "not_configured" }, 503))

    const findings = await runConformance({
      ...config,
      declaration: declaration({ health: { implemented: true } }),
      fetchImpl,
    })

    expect(findings.some((f) => f.status === "fail" && /not_configured/.test(f.detail ?? "")))
      .toBe(true)
  })

  it("surveys a conforming product without a single failure", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.includes("/admin/kpis")) return json({ data: { tenants_active: 12 } })
      if (url.includes("/admin/health")) return json({ status: "ok" })
      return json({ data: [], pagination: { page: 1, limit: 50, total: 0 } })
    })

    const findings = await runConformance({
      ...config,
      declaration: declaration({
        kpis: { implemented: true },
        health: { implemented: true },
        "audit-logs": { implemented: true },
      }),
      fetchImpl,
    })

    expect(findings.filter((f) => f.status === "fail")).toEqual([])
    expect(findings.some((f) => f.status === "pass")).toBe(true)
  })
})
