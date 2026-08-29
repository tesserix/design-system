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

/**
 * A product that answers ONLY the paths it serves and 404s everything else —
 * which is what a real product does, and what the suite relies on to tell an
 * undeclared-but-served endpoint from one that genuinely is not there.
 *
 * The stubs here used to answer 200 to every path, which made every undeclared
 * endpoint look implemented. That was invisible while undeclared endpoints
 * were never called; it stopped being invisible the moment they were.
 */
const serving = (paths: readonly string[], body: (url: string) => Response) =>
  vi.fn(async (url: string) =>
    paths.some((path) => new URL(url).pathname.includes(path))
      ? body(url)
      : json({ error: "not_found" }, 404),
  )

const config = {
  base: "https://mark8ly.invalid/api/v1/platform",
  secret: "s",
  operator: "op",
  capability: "platform",
}

describe("runConformance", () => {
  // This test used to assert exactly ONE call, on the reading that the suite
  // touches only what was declared. That was true and it was also the bug:
  // never asking meant an endpoint served in production but missing from the
  // declaration reported as a clean skip. The suite now asks — see
  // `checkUndeclared` — so what it CHECKS is still declaration-driven while
  // what it KNOWS is not.
  it("checks the declared endpoint, and probes the undeclared ones", async () => {
    const fetchImpl = serving(["/admin/audit-logs"], () =>
      json({ data: [], pagination: { page: 1, limit: 50, total: 0 } }),
    )

    await runConformance({
      ...config,
      declaration: declaration({ "audit-logs": { implemented: true } }),
      fetchImpl,
    })

    const paths = fetchImpl.mock.calls.map(([url]) => new URL(url as string).pathname)
    expect(paths).toContain("/api/v1/platform/admin/audit-logs")
    // Undeclared, and asked about anyway.
    expect(paths.some((path) => path.includes("/admin/kpis"))).toBe(true)

    // The two that must never be probed blind, declared or not: a write, and a
    // path that has no URL without a {type}.
    expect(paths.some((path) => path.includes("/suspend"))).toBe(false)
    expect(paths.some((path) => path.includes("/admin/entities"))).toBe(false)
  })

  // The finding this whole change exists for. An endpoint that ANSWERS but is
  // not declared is checked by nothing and reports as a skip that reads as a
  // pass — which is how the estate's two declaration copies (a product's repo
  // root, and the Helm chart the CronJob mounts) can drift without a symptom.
  it("fails an endpoint the product serves but did not declare", async () => {
    const fetchImpl = serving(["/admin/audit-logs", "/admin/kpis"], (url) =>
      url.includes("/admin/kpis")
        ? json({ data: { tenants_active: 12 } })
        : json({ data: [], pagination: { page: 1, limit: 50, total: 0 } }),
    )

    const findings = await runConformance({
      ...config,
      // kpis is served by the stub above and deliberately NOT declared.
      declaration: declaration({ "audit-logs": { implemented: true } }),
      fetchImpl,
    })

    const undeclared = findings.find((f) => f.endpoint === "kpis" && f.status === "fail")
    expect(undeclared, "an undeclared but served endpoint must fail").toBeDefined()
    expect(undeclared?.detail).toMatch(/not declared/)
  })

  // A probe that could not be made proves nothing, and inventing a conclusion
  // from a failed request is how a suite starts lying in the reassuring
  // direction.
  it("reports a plain skip when the undeclared probe cannot be made", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("connect ECONNREFUSED")
    })

    const findings = await runConformance({
      ...config,
      declaration: declaration({}),
      fetchImpl,
    })

    expect(findings.filter((f) => f.status === "fail")).toEqual([])
    expect(findings.every((f) => f.status === "skip")).toBe(true)
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
    const fetchImpl = serving(["/admin/lifecycle/reason-codes"], () =>
      json({ data: { suspend: [], unsuspend: [] } }),
    )

    const findings = await runConformance({
      ...config,
      declaration: declaration({ "lifecycle/reason-codes": { implemented: true } }),
      fetchImpl,
    })

    // Asserted over every call rather than the first: undeclared endpoints are
    // probed too now, in registry order, so "the first request" is no longer
    // the declared one.
    const paths = fetchImpl.mock.calls.map(([called]) => new URL(called as string).pathname)
    expect(paths.some((path) => path.includes("/admin/lifecycle/reason-codes"))).toBe(true)
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
  it("reports an undeclared endpoint the product does not serve as a skip", async () => {
    // The product serves only what it declared; everything else 404s, so the
    // suite's probe confirms absence rather than assuming it.
    const fetchImpl = serving(["/admin/health"], () => json({}))

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
    const fetchImpl = serving(["/admin/entities"], () =>
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
    // The ENTITIES calls, specifically — the run also probes the endpoints
    // this declaration omits, so an exact-equality assertion over every call
    // would now be about undeclared probing rather than about type expansion.
    const entityPaths = paths.filter((path) => path.includes("/admin/entities"))
    expect(entityPaths).toEqual([
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
    const fetchImpl = serving(
      ["/admin/kpis", "/admin/health", "/admin/audit-logs"],
      (url) => {
        if (url.includes("/admin/kpis")) return json({ data: { tenants_active: 12 } })
        if (url.includes("/admin/health")) return json({ status: "ok" })
        return json({ data: [], pagination: { page: 1, limit: 50, total: 0 } })
      },
    )

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

describe("v3 endpoints that must never be called", () => {
  it("skips conversions and tenant-purge without issuing a request", async () => {
    const requested: string[] = []
    const fetchImpl = vi.fn(async (url: string) => {
      requested.push(url)
      return json({})
    })

    const findings = await runConformance({
      ...config,
      declaration: declaration({
        conversions: { implemented: true },
        "tenant-purge": { implemented: true },
      }),
      fetchImpl,
    })

    // The point of probe:false is that no request happens. Asserting only on
    // the finding's status would pass even if the suite had purged a tenant
    // and then reported a skip.
    expect(requested.filter((url) => url.includes("/admin/conversions"))).toEqual([])
    expect(requested.filter((url) => url.includes("/purge"))).toEqual([])

    for (const id of ["conversions", "tenant-purge"]) {
      const finding = findings.find((f) => f.endpoint === id)
      expect(finding?.status).toBe("skip")
    }
  })

  // The other half of `probe: false`'s guarantee, and previously untested:
  // `checkUndeclared`'s `!isProbed` guard at the top of that function. The two
  // tests above only ever declare `conversions`/`tenant-purge`, so they only
  // ever exercise the declared branch (`runConformance`'s own `!isProbed`
  // check). If the undeclared-path guard were deleted, an UNDECLARED
  // `tenant-purge` would fall through to `checkUndeclared`'s normal probe and
  // the suite would issue the very request `probe: false` exists to prevent —
  // and no test would have caught it.
  it("never probes an undeclared, unprobed endpoint", async () => {
    const requested: string[] = []
    const fetchImpl = vi.fn(async (url: string) => {
      requested.push(url)
      return json({})
    })

    // tenant-purge is declared nowhere in this declaration.
    const findings = await runConformance({
      ...config,
      declaration: declaration({}),
      fetchImpl,
    })

    expect(requested.filter((url) => url.includes("/purge"))).toEqual([])

    const finding = findings.find((f) => f.endpoint === "tenant-purge")
    expect(finding?.status).toBe("skip")
  })
})
