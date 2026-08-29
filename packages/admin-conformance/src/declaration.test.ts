import { mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { ENDPOINT_IDS } from "./contract"
import {
  DECLARATION_FILENAME,
  implementedEndpoints,
  loadDeclaration,
  parseDeclaration,
} from "./declaration"

/**
 * The declaration is the only thing standing between a partially implemented
 * product and a green build that means nothing. Every test here is really the
 * same test: a mistake in this file must be loud, because the failure mode it
 * guards against — an endpoint quietly counted as "not implemented" — reports
 * as a pass and nobody looks at it again.
 */

const valid = {
  slug: "mark8ly",
  contractVersion: 2,
  endpoints: {
    "audit-logs": true,
    health: true,
    entities: { types: ["tenants", "users"] },
    inbox: { slaDeclared: true },
  },
}

/** A fresh deep copy, so a test that edits one field cannot leak into another. */
const declarationWith = (overrides: Record<string, unknown>): unknown => ({
  ...structuredClone(valid),
  ...overrides,
})

describe("parseDeclaration", () => {
  it("accepts the shape a product commits to its repo root", () => {
    const declaration = parseDeclaration(structuredClone(valid))

    expect(declaration.slug).toBe("mark8ly")
    expect(declaration.contractVersion).toBe(2)
    expect(declaration.endpoints["health"]).toEqual({ implemented: true })
  })

  it("reads a bare true as implemented with no options", () => {
    const declaration = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: { kpis: true },
    })

    expect(declaration.endpoints["kpis"]).toEqual({ implemented: true })
  })

  it("treats an explicit false and an absent key as the same thing", () => {
    const explicit = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: { kpis: false },
    })
    const absent = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: {},
    })

    expect(implementedEndpoints(explicit)).toEqual([])
    expect(implementedEndpoints(absent)).toEqual([])
  })

  it("does not mutate the object it was handed", () => {
    const raw = structuredClone(valid)
    const before = JSON.stringify(raw)

    parseDeclaration(raw)

    expect(JSON.stringify(raw)).toBe(before)
  })

  it("rejects a declaration that is not an object", () => {
    expect(() => parseDeclaration(null)).toThrow(/must be a JSON object/)
    expect(() => parseDeclaration([])).toThrow(/must be a JSON object/)
    expect(() => parseDeclaration("mark8ly")).toThrow(/must be a JSON object/)
  })

  it("names the offending field rather than saying the file is invalid", () => {
    expect(() => parseDeclaration(declarationWith({ slug: 7 }))).toThrow(/slug/)
    expect(() =>
      parseDeclaration(declarationWith({ contractVersion: "2" })),
    ).toThrow(/contractVersion/)
  })
})

describe("the slug", () => {
  it("is required", () => {
    expect(() => parseDeclaration({ contractVersion: 2, endpoints: {} })).toThrow(
      /slug/,
    )
  })

  it("rejects an empty string", () => {
    expect(() => parseDeclaration(declarationWith({ slug: "" }))).toThrow(/slug/)
  })

  it("accepts lowercase kebab-case", () => {
    expect(parseDeclaration(declarationWith({ slug: "mark8ly-admin" })).slug).toBe(
      "mark8ly-admin",
    )
  })

  it("rejects uppercase, underscores, spaces and stray hyphens", () => {
    for (const slug of ["Mark8ly", "mark8ly_admin", "mark 8ly", "-mark8ly", "mark8ly-"]) {
      expect(() => parseDeclaration(declarationWith({ slug }))).toThrow(/slug/)
    }
  })
})

describe("the contract version", () => {
  it("is required", () => {
    expect(() => parseDeclaration({ slug: "mark8ly", endpoints: {} })).toThrow(
      /contractVersion/,
    )
  })

  it("rejects zero, negatives and fractions", () => {
    for (const contractVersion of [0, -1, 2.5, Number.NaN]) {
      expect(() => parseDeclaration(declarationWith({ contractVersion }))).toThrow(
        /contractVersion/,
      )
    }
  })
})

describe("the endpoints block", () => {
  it("is required, because an absent block silently declares nothing", () => {
    expect(() => parseDeclaration({ slug: "mark8ly", contractVersion: 2 })).toThrow(
      /endpoints/,
    )
  })

  it("rejects an unknown endpoint key and lists the valid ids", () => {
    let message = ""
    try {
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { "audit-log": true },
      })
    } catch (error) {
      message = error instanceof Error ? error.message : String(error)
    }

    expect(message).toContain("audit-log")
    for (const id of ENDPOINT_IDS) {
      expect(message).toContain(id)
    }
  })

  it("rejects an endpoint value that is neither a boolean nor an options object", () => {
    expect(() =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { health: "yes" },
      }),
    ).toThrow(/health/)
  })

  it("rejects an unknown option key on an endpoint", () => {
    expect(() =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { health: { slaDeclard: true } },
      }),
    ).toThrow(/slaDeclard/)
  })
})

describe("entities", () => {
  it("requires the types it serves, because its path is incomplete without them", () => {
    expect(() =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { entities: true },
      }),
    ).toThrow(/entities/)
  })

  it("rejects an empty types array", () => {
    expect(() =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { entities: { types: [] } },
      }),
    ).toThrow(/types/)
  })

  it("rejects types that are not non-empty strings", () => {
    for (const types of [["tenants", ""], ["tenants", 3], "tenants"]) {
      expect(() =>
        parseDeclaration({
          slug: "mark8ly",
          contractVersion: 2,
          endpoints: { entities: { types } },
        }),
      ).toThrow(/types/)
    }
  })

  it("carries the declared types through to the parsed declaration", () => {
    const declaration = parseDeclaration(structuredClone(valid))

    expect(declaration.endpoints["entities"]?.types).toEqual(["tenants", "users"])
  })

  it("needs no types when it is declared not implemented", () => {
    const declaration = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: { entities: false },
    })

    expect(declaration.endpoints["entities"]).toEqual({ implemented: false })
  })
})

describe("inbox", () => {
  it("records a declared SLA, since due_at is only required when one exists", () => {
    const declaration = parseDeclaration(structuredClone(valid))

    expect(declaration.endpoints["inbox"]?.slaDeclared).toBe(true)
  })

  it("defaults slaDeclared to false when the product does not mention it", () => {
    const declaration = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: { inbox: {} },
    })

    expect(declaration.endpoints["inbox"]?.slaDeclared).toBe(false)
  })

  it("parses slaKinds, so a product with one time-bound queue can say so", () => {
    const declaration = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: { inbox: { slaKinds: ["sea_manual_review"] } },
    })

    expect(declaration.endpoints["inbox"]?.slaKinds).toEqual(["sea_manual_review"])
    // Not inferred as true: the product-level promise is genuinely absent, and
    // a checker that read one from the other would re-create the conflation
    // slaKinds exists to remove.
    expect(declaration.endpoints["inbox"]?.slaDeclared).toBe(false)
  })

  // Two answers to one question. Which wins would have to be guessed by every
  // reader, and the guesses would differ.
  it("rejects declaring both slaDeclared and slaKinds", () => {
    expect(() =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { inbox: { slaDeclared: true, slaKinds: ["sea_manual_review"] } },
      }),
    ).toThrow(/slaDeclared/)
  })

  it("rejects an empty or non-string slaKinds", () => {
    const bad = (slaKinds: unknown) => () =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { inbox: { slaKinds } },
      })

    // An empty array is "no kinds have an SLA", which is what omitting it
    // already says. Two spellings of one statement is the ambiguity this
    // whole option exists to remove.
    expect(bad([])).toThrow(/slaKinds/)
    expect(bad(["ok", ""])).toThrow(/slaKinds/)
    expect(bad("sea_manual_review")).toThrow(/slaKinds/)
  })

  it("rejects a non-boolean slaDeclared", () => {
    expect(() =>
      parseDeclaration({
        slug: "mark8ly",
        contractVersion: 2,
        endpoints: { inbox: { slaDeclared: "true" } },
      }),
    ).toThrow(/slaDeclared/)
  })
})

describe("implementedEndpoints", () => {
  it("returns only the endpoints declared implemented", () => {
    const declaration = parseDeclaration(structuredClone(valid))

    expect(implementedEndpoints(declaration)).toEqual([
      "inbox",
      "audit-logs",
      "entities",
      "health",
    ])
  })

  it("orders the ids the same way whatever order the file listed them in", () => {
    const forwards = parseDeclaration(structuredClone(valid))
    const backwards = parseDeclaration({
      slug: "mark8ly",
      contractVersion: 2,
      endpoints: {
        inbox: { slaDeclared: true },
        entities: { types: ["tenants", "users"] },
        health: true,
        "audit-logs": true,
      },
    })

    expect(implementedEndpoints(backwards)).toEqual(implementedEndpoints(forwards))
  })
})

describe("loadDeclaration", () => {
  let dir = ""

  beforeAll(() => {
    dir = mkdtempSync(join(tmpdir(), "admin-conformance-"))
  })

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  const write = (name: string, contents: string): string => {
    const path = join(dir, name)
    writeFileSync(path, contents, "utf8")
    return path
  }

  it("parses the committed file from disk", () => {
    const path = write(DECLARATION_FILENAME, JSON.stringify(valid))

    expect(loadDeclaration(path).slug).toBe("mark8ly")
  })

  it("says the file is missing rather than reporting a parse error", () => {
    const path = join(dir, "absent.json")

    expect(() => loadDeclaration(path)).toThrow(/not found/)
    expect(() => loadDeclaration(path)).toThrow(path)
  })

  it("says the file is not valid JSON, and where", () => {
    const path = write("malformed.json", "{ \"slug\": ")

    expect(() => loadDeclaration(path)).toThrow(/not valid JSON/)
    expect(() => loadDeclaration(path)).toThrow(path)
  })

  it("names the file alongside a validation failure", () => {
    const path = write("bad-slug.json", JSON.stringify({ ...valid, slug: "Nope" }))

    expect(() => loadDeclaration(path)).toThrow(path)
    expect(() => loadDeclaration(path)).toThrow(/slug/)
  })
})

describe("contract v3 declarations", () => {
  const base = { slug: "mark8ly", contractVersion: 3 }

  it("accepts every v3 id declared as a bare true", () => {
    const declaration = parseDeclaration({
      ...base,
      endpoints: {
        outbox: true,
        "email-sends": true,
        notifications: true,
        "break-glass": true,
        conversions: true,
        "onboarding/funnel": true,
        "onboarding/sessions": true,
        "tenant-purge": true,
      },
    })
    expect(declaration.endpoints.outbox?.implemented).toBe(true)
    expect(declaration.endpoints["tenant-purge"]?.implemented).toBe(true)
  })

  it("rejects an option on a v3 id, naming that it accepts none", () => {
    expect(() =>
      parseDeclaration({ ...base, endpoints: { outbox: { types: ["a"] } } }),
    ).toThrow(/accepted options: none/)
  })

  it("still rejects an id the contract does not define", () => {
    expect(() =>
      parseDeclaration({ ...base, endpoints: { "onboarding/funnels": true } }),
    ).toThrow(/unknown endpoint/)
  })
})
