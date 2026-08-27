import { type Finding, fail, pass, skip } from "../finding"
import { describeValue, isRecord } from "./walk"

/**
 * §8.9 — the entity row of §3.4.
 *
 * §3.4 named the endpoint and its envelope but never named the row inside it,
 * and two products filled that silence differently: Kora sends a
 * `sublabel` disambiguator, mark8ly sends none, and platform-api dropped the
 * field entirely in between (tesserix-home#364) without anything noticing.
 * §8.9 settles the row; this is what makes the settlement bite.
 *
 * The rule that is easiest to get wrong is the permissive one. A row WITHOUT
 * `sublabel` is conformant — mark8ly's rows are correct and must stay so. What
 * deviates is a row that signals "no disambiguator" through a value rather
 * than through omitting the key: `sublabel: null` and `sublabel: ""` both
 * survive a consumer's `if ("sublabel" in row)` and land in the DOM as a blank
 * second line, an empty parenthesis, or a bullet with nothing after it. The
 * absent key is the only form a consumer can reliably not render.
 */
export const ENTITY_ROW_SECTION = "8.9"

const CHECK = "entity rows carry §8.9's id and label, an optional non-empty sublabel, and no source"

/**
 * Applies to `entities` alone, and to the per-type labels the runner reports
 * under it — the runner calls `/admin/entities/{type}` once per declared type
 * and labels each result `entities/{type}`, so a bare id match would silently
 * check nothing on a real run.
 */
function isEntitiesEndpoint(endpointId: string): boolean {
  return endpointId === "entities" || endpointId.startsWith("entities/")
}

/**
 * How a finding points at one row out of a page of fifty.
 *
 * The index alone is not enough: it is a position in one response and means
 * nothing to someone reading a CI log later, or holding a differently-ordered
 * page. The id is what they can grep their own data for — so it is included
 * whenever it is legible, which is exactly when it is not the thing at fault.
 */
function locate(index: number, row: unknown): string {
  const id = isRecord(row) ? row.id : undefined
  return typeof id === "string" && id.trim() !== ""
    ? `data[${index}] (id ${JSON.stringify(id)})`
    : `data[${index}]`
}

/** A string with something in it. Whitespace renders as nothing, so it counts as nothing. */
function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== ""
}

/**
 * Deviations in one row, in field order. Every field is examined before
 * returning: a product that got `id` wrong on every row usually got `label`
 * wrong on every row too, and reporting one field at a time turns a single
 * systematic fix into as many CI runs as there are fields.
 */
function checkRow(index: number, row: unknown): string[] {
  const where = locate(index, row)

  if (!isRecord(row)) {
    return [`${where} is ${describeValue(row)}; §8.9 requires each row to be an object`]
  }

  const problems: string[] = []

  for (const field of ["id", "label"] as const) {
    if (!(field in row)) {
      problems.push(`${where} has no ${field}; §8.9 requires it on every row`)
      continue
    }
    if (typeof row[field] !== "string") {
      // A JSON number id is the common form of this, and it is worse than it
      // looks: `String(row.id)` in a consumer makes it work everywhere except
      // where the id is compared to one that came back as a string, so the
      // mismatch surfaces as a row that will not open rather than as a type
      // error anyone can find.
      problems.push(
        `${where} has ${field} = ${describeValue(row[field])}; §8.9 requires a string`,
      )
      continue
    }
    if (!isNonEmptyString(row[field])) {
      problems.push(
        `${where} has an empty ${field}; §8.9 requires a non-empty string — an empty label ` +
          `renders as a blank line the operator cannot click, and an empty id addresses nothing`,
      )
    }
  }

  // Present-but-empty is the whole point of this check; absent is correct.
  if ("sublabel" in row && !isNonEmptyString(row.sublabel)) {
    problems.push(
      `${where} has sublabel = ${describeValue(row.sublabel)}; §8.9 makes sublabel optional, ` +
        `so a row with no disambiguator must OMIT the key — sending it empty makes a consumer ` +
        `render a placeholder where it should render nothing`,
    )
  }

  // The one field a row must not assert about itself. platform-api stamps
  // `source` from the authenticated request; a row that carries its own is
  // claiming an origin nobody verified, and a federated Directory that trusted
  // it would attribute a record to a product that never sent it.
  if ("source" in row) {
    problems.push(
      `${where} carries source = ${describeValue(row.source)}; §8.9 forbids products from ` +
        `sending it — the platform stamps source from the authenticated request, and a ` +
        `product-supplied one is a forgeable claim about provenance`,
    )
  }

  return problems
}

/** Checks the rows of an `/admin/entities/{type}` page against §8.9. */
export function checkEntityRow(
  endpointId: string,
  section: string,
  body: unknown,
): Finding[] {
  if (!isEntitiesEndpoint(endpointId)) {
    return [
      skip(
        endpointId,
        section,
        CHECK,
        `§8.9 names the §3.4 entity row, and ${endpointId} does not serve one`,
      ),
    ]
  }

  const rows = isRecord(body) ? body.data : undefined
  if (!Array.isArray(rows)) {
    // §4.1 and §4.5 already report a malformed envelope. Restating it here
    // would show one deviation as two, and send the reader looking for a row
    // problem that does not exist.
    return [
      skip(
        endpointId,
        section,
        CHECK,
        `the response has no data array to read rows from (${describeValue(rows)}); ` +
          `§4.1 reports the envelope deviation, and §8.9 has nothing to check until it is fixed`,
      ),
    ]
  }

  if (rows.length === 0) {
    // Not a pass. A product with no rows has demonstrated nothing about its row
    // shape, and a green line here would claim coverage the run does not have —
    // which is how §3.4 went unenforced against a suite that was already
    // running.
    return [
      skip(
        endpointId,
        section,
        CHECK,
        "the page came back empty, so no row shape was exercised; point the check at a type " +
          "that has records before reading this as conformance",
      ),
    ]
  }

  const findings = rows.flatMap((row, index) =>
    checkRow(index, row).map((detail) => fail(endpointId, section, CHECK, detail)),
  )

  return findings.length > 0 ? findings : [pass(endpointId, section, CHECK)]
}
