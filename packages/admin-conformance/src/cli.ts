import { DECLARATION_FILENAME, loadDeclaration } from "./declaration"
import { exitCode, formatReport } from "./report"
import { runConformance } from "./runner"

/**
 * The CLI documented in contract §5:
 *
 *   npx @tesserix/admin-conformance --base $ADMIN_API_BASE --slug mark8ly
 *
 * The secret is read from the environment and cannot be passed as a flag —
 * see `parseArgs`.
 */

export const USAGE = `admin-conformance — checks a product's /admin/* surface against the
Product Admin Integration Contract.

Usage:
  npx @tesserix/admin-conformance --base <url> --slug <product>

Options:
  --base <url>          The product's platform admin front door. Must include the
                        product's platform prefix (e.g. .../api/v1/platform), not
                        just /api/v1 — see the note below.
  --slug <product>      The product's estate slug. Defaults to the slug in the
                        declaration file.
  --declaration <path>  Path to ${DECLARATION_FILENAME} (default: ./${DECLARATION_FILENAME}).
  --operator <id>       Operator identity to sign with (default: admin-conformance).
  --capability <name>   Capability to sign with (default: platform).
  --timeout <ms>        Per-request timeout (default: 15000).
  --color / --no-color  Force ANSI colour on or off.
  --help                Print this text.

Environment:
  ADMIN_CONFORMANCE_SECRET   Required. The HMAC signing secret shared with the
                             product. Read from the environment rather than a
                             flag: anything on argv is visible in \`ps\`, in CI
                             step logs that echo the command, and in shell
                             history.

A note on --base, because the failure is invisible: a product may serve this
surface behind a distinct prefix (mark8ly uses /api/v1/platform) because its
service mesh denies un-JWT'd requests to /api/v1/admin/*. This surface
authenticates by HMAC, not JWT, so pointing --base at the wrong prefix returns
403 at the mesh before the application sees the request — nothing appears in
the product's own logs.`

export interface ParsedArgs {
  readonly base: string
  readonly slug?: string
  readonly secret: string
  readonly declarationPath: string
  readonly operator: string
  readonly capability: string
  readonly timeoutMs: number
  readonly color?: boolean
  readonly warnings: readonly string[]
}

const FLAGS = [
  "base",
  "slug",
  "declaration",
  "operator",
  "capability",
  "timeout",
  "color",
  "no-color",
  "help",
] as const

/**
 * Parses argv.
 *
 * Hand-rolled rather than pulled from a dependency: this package is invoked
 * with `npx` in other teams' CI, so every dependency is one more thing that
 * can fail to install inside somebody else's pipeline, and the whole surface
 * is nine flags.
 */
export function parseArgs(
  argv: readonly string[],
  env: Readonly<Record<string, string | undefined>>,
): ParsedArgs {
  const values = new Map<string, string>()

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg.startsWith("--")) {
      throw new Error(`admin-conformance: unexpected argument ${arg}\n\n${USAGE}`)
    }

    const [rawKey, inlineValue] = splitFlag(arg)

    // A secret on argv is a leak, not a preference, so this is refused
    // explicitly rather than falling through to "unknown flag" — the error
    // has to say where the secret belongs instead.
    if (rawKey === "secret") {
      throw new Error(
        "admin-conformance: --secret is not accepted. Pass the signing secret as the " +
          "ADMIN_CONFORMANCE_SECRET environment variable: anything on argv is visible " +
          "in `ps`, in CI logs that echo the command, and in shell history.",
      )
    }
    if (!(FLAGS as readonly string[]).includes(rawKey)) {
      throw new Error(`admin-conformance: unknown flag --${rawKey}\n\n${USAGE}`)
    }

    if (rawKey === "help" || rawKey === "color" || rawKey === "no-color") {
      values.set(rawKey, inlineValue ?? "true")
      continue
    }

    const value = inlineValue ?? argv[i + 1]
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`admin-conformance: --${rawKey} requires a value`)
    }
    if (inlineValue === undefined) i += 1
    values.set(rawKey, value)
  }

  const base = values.get("base")
  if (!base) {
    throw new Error(`admin-conformance: --base is required\n\n${USAGE}`)
  }

  const secret = env.ADMIN_CONFORMANCE_SECRET
  if (!secret) {
    throw new Error(
      "admin-conformance: ADMIN_CONFORMANCE_SECRET is not set. Every request would be " +
        "refused, so the run is stopped here rather than reporting a wall of 401s that " +
        "look like contract deviations.",
    )
  }

  const warnings: string[] = []
  if (!looksPrefixed(base)) {
    warnings.push(
      `--base is "${base}", which has no platform prefix. If this product serves its ` +
        "admin surface behind one (mark8ly uses /api/v1/platform), every request will be " +
        "refused at the service mesh with 403 before reaching the application, and nothing " +
        "will appear in the product's logs.",
    )
  }

  return {
    base,
    slug: values.get("slug"),
    secret,
    declarationPath: values.get("declaration") ?? `./${DECLARATION_FILENAME}`,
    operator: values.get("operator") ?? "admin-conformance",
    capability: values.get("capability") ?? "platform",
    timeoutMs: Number(values.get("timeout") ?? 15_000),
    color: resolveColor(values),
    warnings,
  }
}

function splitFlag(arg: string): [string, string | undefined] {
  const body = arg.slice(2)
  const equals = body.indexOf("=")
  if (equals === -1) return [body, undefined]
  return [body.slice(0, equals), body.slice(equals + 1)]
}

function resolveColor(values: Map<string, string>): boolean | undefined {
  if (values.has("no-color")) return false
  if (values.has("color")) return true
  return undefined
}

/**
 * A base URL is "prefixed" if its path goes beyond a bare API version. This is
 * a heuristic producing a warning, never an error: a product is free to serve
 * this surface at its root, and refusing to run would be worse than a note.
 */
function looksPrefixed(base: string): boolean {
  try {
    const path = new URL(base).pathname.replace(/\/+$/, "")
    if (path === "" || path === "/") return true
    return !/^\/api\/v\d+$/.test(path)
  } catch {
    return true
  }
}

export async function main(
  argv: readonly string[],
  env: Readonly<Record<string, string | undefined>>,
  out: (line: string) => void = console.log,
  err: (line: string) => void = console.error,
): Promise<number> {
  if (argv.includes("--help") || argv.includes("-h")) {
    out(USAGE)
    return 0
  }

  let parsed: ParsedArgs
  try {
    parsed = parseArgs(argv, env)
  } catch (error) {
    err(error instanceof Error ? error.message : String(error))
    return 2
  }

  for (const warning of parsed.warnings) {
    err(`admin-conformance: warning: ${warning}`)
  }

  try {
    const declaration = loadDeclaration(parsed.declarationPath)
    const findings = await runConformance({
      base: parsed.base,
      secret: parsed.secret,
      operator: parsed.operator,
      capability: parsed.capability,
      timeoutMs: parsed.timeoutMs,
      declaration,
    })
    out(formatReport(findings, { color: parsed.color }))
    return exitCode(findings)
  } catch (error) {
    // Exit 2 for "the suite could not run", distinct from exit 1 for "the
    // product deviates". A CI job that cannot tell them apart will eventually
    // treat a broken harness as a failing product.
    err(
      `admin-conformance: ${error instanceof Error ? error.message : String(error)}`,
    )
    return 2
  }
}

/* c8 ignore start -- the process entry point, exercised by running the binary */
if (require.main === module) {
  void main(process.argv.slice(2), process.env).then((code) => {
    process.exitCode = code
  })
}
/* c8 ignore stop */
