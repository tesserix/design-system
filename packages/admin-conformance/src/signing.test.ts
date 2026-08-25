import { describe, expect, it } from "vitest"

import vectors from "./testdata/vectors.json"
import {
  canonicalQuery,
  canonicalString,
  sign,
  signedHeaders,
  PLATFORM_HEADERS,
} from "./signing"

/**
 * `src/testdata/vectors.json` is a byte-for-byte copy of mark8ly's
 * `internal/handlers/platformadmin/testdata/vectors.json`, whose package doc
 * names it as the specification of this scheme — it is written down nowhere
 * else. Copied rather than generated: a fixture produced by this file's own
 * canonicaliser would agree with itself and prove nothing.
 *
 * These vectors are why a TypeScript port is checkable at all. The scheme
 * escapes query values with `application/x-www-form-urlencoded` semantics,
 * which `encodeURIComponent` does NOT implement — it emits `%20` for a space
 * where the scheme requires `+`, and leaves `+` as data where the scheme
 * requires `%2B`. Every such request silently 401s. `query-value-with-space`
 * is the vector that catches it.
 */
type Vector = (typeof vectors)[number]

const byName = (name: string): Vector => {
  const found = vectors.find((v) => v.name === name)
  if (!found) throw new Error(`vector ${name} is missing from testdata/vectors.json`)
  return found
}

const inputFor = (v: Vector) => ({
  method: v.method,
  path: v.path,
  rawQuery: v.raw_query,
  body: v.body,
  timestamp: v.timestamp,
  nonce: v.nonce,
  operator: v.operator,
  capability: v.capability,
})

describe("the golden vectors", () => {
  it("publishes the four vectors the contract was ported against", () => {
    expect(vectors.map((v) => v.name)).toEqual([
      "get-with-query",
      "post-with-body",
      "repeated-query-and-encoded-path",
      "query-value-with-space",
    ])
  })

  // Canonical string and signature are asserted separately because only one of
  // them localises a failure: a signature mismatch says "something upstream is
  // wrong", the canonical string says which of the eight fields it was.
  it.each(vectors.map((v) => [v.name, v] as const))(
    "builds %s's canonical string",
    (_name, v) => {
      expect(canonicalString(inputFor(v))).toBe(v.canonical)
    },
  )

  it.each(vectors.map((v) => [v.name, v] as const))("signs %s", (_name, v) => {
    expect(sign(v.secret, inputFor(v))).toBe(v.signature)
  })

  it("emits lowercase hex", () => {
    const v = byName("get-with-query")
    const signature = sign(v.secret, inputFor(v))
    expect(signature).toBe(signature.toLowerCase())
  })
})

describe("canonicalQuery", () => {
  it("is independent of the order the caller built the query in", () => {
    expect(canonicalQuery("b=2&a=z&a=a")).toBe(canonicalQuery("a=a&b=2&a=z"))
    expect(canonicalQuery("b=2&a=z&a=a")).toBe("a=a&a=z&b=2")
  })

  // The trap. Both spellings of a space decode to a space on input, so what
  // the caller built the string with is irrelevant — only the re-escaping on
  // the way out matters, and it must be `+`.
  it.each(["actor=Jane%20Smith", "actor=Jane+Smith"])(
    "re-escapes a space in %s as +, not %%20",
    (raw) => {
      expect(canonicalQuery(raw)).toBe("actor=Jane+Smith")
    },
  )

  it("escapes a literal + as %2B rather than treating it as a space", () => {
    expect(canonicalQuery("q=a%2Bb")).toBe("q=a%2Bb")
  })

  it("renders an empty query as an empty string", () => {
    expect(canonicalQuery("")).toBe("")
  })
})

describe("fail-closed guards", () => {
  const base = {
    method: "GET",
    path: "/x",
    rawQuery: "",
    body: "",
    timestamp: "1755859200",
    nonce: "n",
    operator: "op",
    capability: "cap",
  }

  it("refuses an empty secret rather than producing a valid-looking HMAC", () => {
    expect(() => sign("", base)).toThrow(/secret/i)
  })

  // The canonical string joins with "\n" and carries no length prefixes, so
  // operator="a", capability="b\nc" would otherwise produce the same bytes as
  // operator="a\nb", capability="c". Mark8ly enforces this; enforcing it here
  // turns a collision into a local error instead of a remote 401.
  it.each([
    ["method", { method: "GE\nT" }],
    ["path", { path: "/x\ny" }],
    ["timestamp", { timestamp: "175\r5859200" }],
    ["nonce", { nonce: "n\nn" }],
    ["operator", { operator: "a\nb" }],
    ["capability", { capability: "b\nc" }],
  ])("refuses a line break in %s", (field, override) => {
    expect(() => canonicalString({ ...base, ...override })).toThrow(
      new RegExp(field, "i"),
    )
  })

  it("collides on nothing: the two ambiguous operator/capability splits differ", () => {
    const a = canonicalString({ ...base, operator: "a", capability: "bc" })
    const b = canonicalString({ ...base, operator: "ab", capability: "c" })
    expect(a).not.toBe(b)
  })
})

describe("an absent body", () => {
  const EMPTY_SHA = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

  it.each([undefined, ""])("hashes as the empty string (%s)", (body) => {
    const canonical = canonicalString({
      method: "GET",
      path: "/x",
      rawQuery: "",
      body,
      timestamp: "1",
      nonce: "n",
      operator: "",
      capability: "",
    })
    expect(canonical).toContain(EMPTY_SHA)
  })
})

describe("PLATFORM_HEADERS", () => {
  it("names the five headers the far end reads", () => {
    expect(PLATFORM_HEADERS).toEqual({
      operator: "X-Platform-Operator",
      capability: "X-Platform-Capability",
      timestamp: "X-Platform-Timestamp",
      nonce: "X-Platform-Nonce",
      signature: "X-Platform-Signature",
    })
  })
})

/**
 * Go's `url.QueryEscape` and JavaScript's `encodeURIComponent` disagree on six
 * characters, not the one mark8ly's package doc names.
 *
 * Verified against Go 1.26 rather than taken from memory. The space is the
 * documented divergence; `! * ' ( )` are not documented anywhere, and a port
 * that applies only the space fix 401s on any query value containing an
 * apostrophe — `?actor=O'Brien` reaches this through the audit-log filter.
 */
describe("Go's QueryEscape divergences from encodeURIComponent", () => {
  it.each([
    [" ", "+"],
    ["!", "%21"],
    ["*", "%2A"],
    ["'", "%27"],
    ["(", "%28"],
    [")", "%29"],
  ])("escapes %j as %j", (char, expected) => {
    expect(canonicalQuery(`q=${encodeURIComponent(char)}`)).toBe(`q=${expected}`)
  })

  it.each(["~", "-", "_", "."])("leaves %j alone, as Go does", (char) => {
    expect(canonicalQuery(`q=${encodeURIComponent(char)}`)).toBe(`q=${char}`)
  })

  it("handles a realistic name that trips every naive port", () => {
    expect(canonicalQuery("actor=O'Brien (ops)")).toBe("actor=O%27Brien+%28ops%29")
  })
})

describe("signedHeaders", () => {
  const vector = byName("get-with-query")

  it("reproduces a golden vector end to end from a URL", () => {
    const headers = signedHeaders({
      url: new URL(`https://mark8ly.invalid${vector.request_target}`),
      method: vector.method,
      secret: vector.secret,
      operator: vector.operator,
      capability: vector.capability,
      now: () => new Date(Number(vector.timestamp) * 1000),
      nonce: () => vector.nonce,
    })
    expect(headers["X-Platform-Signature"]).toBe(vector.signature)
    expect(headers["X-Platform-Timestamp"]).toBe(vector.timestamp)
    expect(headers["X-Platform-Operator"]).toBe(vector.operator)
  })

  // Trap #1, isolated: the caller passes an encoded path, the far end signs
  // what net/http decoded.
  it("signs the decoded path, not the wire form", () => {
    const encoded = byName("repeated-query-and-encoded-path")
    const headers = signedHeaders({
      url: new URL(`https://mark8ly.invalid${encoded.request_target}`),
      method: encoded.method,
      secret: encoded.secret,
      operator: encoded.operator,
      capability: encoded.capability,
      now: () => new Date(Number(encoded.timestamp) * 1000),
      nonce: () => encoded.nonce,
    })
    expect(headers["X-Platform-Signature"]).toBe(encoded.signature)
  })

  it("emits an unsigned decimal timestamp, never a leading + or -", () => {
    const headers = signedHeaders({
      url: new URL("https://mark8ly.invalid/admin/health"),
      secret: "s",
      operator: "op",
      capability: "cap",
    })
    expect(headers["X-Platform-Timestamp"]).toMatch(/^\d+$/)
  })

  it("mints a fresh nonce per call, because the far end claims each single-use", () => {
    const call = () =>
      signedHeaders({
        url: new URL("https://mark8ly.invalid/admin/health"),
        secret: "s",
        operator: "op",
        capability: "cap",
      })["X-Platform-Nonce"]
    expect(new Set([call(), call(), call()]).size).toBe(3)
  })
})
