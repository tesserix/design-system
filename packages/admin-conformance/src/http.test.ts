import { describe, expect, it, vi } from "vitest"

import { createClient } from "./http"

const okJson = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })

describe("createClient", () => {
  const config = {
    base: "https://mark8ly.invalid/api/v1/platform",
    secret: "reference-secret-do-not-use",
    operator: "op_7f3a",
    capability: "audit.read",
  }

  it("signs every request with the five platform headers", async () => {
    const fetchImpl = vi.fn(async () => okJson({ data: [] }))
    const client = createClient({ ...config, fetchImpl })

    await client.get("/admin/audit-logs")

    const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    const headers = init.headers as Record<string, string>
    expect(Object.keys(headers)).toEqual(
      expect.arrayContaining([
        "X-Platform-Operator",
        "X-Platform-Capability",
        "X-Platform-Timestamp",
        "X-Platform-Nonce",
        "X-Platform-Signature",
      ]),
    )
  })

  // The base URL must carry the product's front-door prefix, and joining it
  // by hand is how a trailing slash turns "/api/v1/platform" + "/admin/x"
  // into "/api/v1/platform//admin/x" — a different path, so a different
  // signature, so a 401 that looks like a credentials problem.
  it.each([
    ["https://m.invalid/api/v1/platform", "/api/v1/platform/admin/health"],
    ["https://m.invalid/api/v1/platform/", "/api/v1/platform/admin/health"],
  ])("joins base %s without doubling the slash", async (base, expected) => {
    const fetchImpl = vi.fn(async () => okJson({}))
    const client = createClient({ ...config, base, fetchImpl })

    await client.get("/admin/health")

    const [url] = fetchImpl.mock.calls[0] as unknown as [string]
    expect(new URL(url).pathname).toBe(expected)
  })

  it("returns the status and parsed body rather than throwing on a non-2xx", async () => {
    const fetchImpl = vi.fn(async () => okJson({ error: "not_found" }, 404))
    const client = createClient({ ...config, fetchImpl })

    const result = await client.get("/admin/kpis")

    expect(result.status).toBe(404)
    expect(result.body).toEqual({ error: "not_found" })
  })

  // A conformance suite that threw on malformed JSON would report a crash
  // where the contract wants a finding: "this endpoint did not return JSON"
  // is exactly the kind of deviation it exists to catch.
  it("reports unparseable JSON as a result rather than an exception", async () => {
    const fetchImpl = vi.fn(
      async () => new Response("<html>gateway error</html>", { status: 502 }),
    )
    const client = createClient({ ...config, fetchImpl })

    const result = await client.get("/admin/health")

    expect(result.status).toBe(502)
    expect(result.body).toBeUndefined()
    expect(result.parseError).toMatch(/json/i)
  })

  it("passes query parameters through to the signed URL", async () => {
    const fetchImpl = vi.fn(async () => okJson({ data: [] }))
    const client = createClient({ ...config, fetchImpl })

    await client.get("/admin/audit-logs", { limit: "200", since_hours: "720" })

    const [url] = fetchImpl.mock.calls[0] as unknown as [string]
    const parsed = new URL(url)
    expect(parsed.searchParams.get("limit")).toBe("200")
    expect(parsed.searchParams.get("since_hours")).toBe("720")
  })

  it("refuses to build a client without a secret", () => {
    expect(() => createClient({ ...config, secret: "" })).toThrow(/secret/i)
  })

  // Every rejection on the far end is one opaque status by design, so a
  // request that never completes is indistinguishable from a slow one. A
  // suite without a timeout hangs someone's CI instead of failing it.
  it("applies a timeout", async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.signal).toBeDefined()
      return okJson({})
    })
    const client = createClient({ ...config, fetchImpl })

    await client.get("/admin/health")

    expect(fetchImpl).toHaveBeenCalled()
  })
})
