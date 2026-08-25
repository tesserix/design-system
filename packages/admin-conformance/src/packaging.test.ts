import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

/**
 * Guards on how this package is PUBLISHED, not on what it computes.
 *
 * Both assertions here encode a bug that shipped. `npx @tesserix/admin-conformance`
 * is the invocation the contract documents and mark8ly's CI is meant to run, and
 * it was broken in two independent ways that every other test passed straight
 * through — because they all imported the modules or ran `node dist/cli.js`
 * directly, and neither route goes near the published bin.
 *
 * The failure was silent on both sides: npm removed the bin entry with a
 * warning buried in publish output, and a missing shebang only shows up when
 * something tries to exec the file rather than hand it to node.
 */

const packageRoot = join(__dirname, "..")

describe("the published binary", () => {
  const pkg = JSON.parse(
    readFileSync(join(packageRoot, "package.json"), "utf8"),
  ) as { bin?: Record<string, string> }

  it("declares a bin entry, since the CLI is the product", () => {
    expect(pkg.bin?.["admin-conformance"]).toBeDefined()
  })

  // npm rejects a "./" prefix on a bin path and REMOVES the entry, warning
  // only in the publish log. The package then installs cleanly and provides
  // no command at all.
  it("declares the bin path without a leading ./, which npm strips the entry over", () => {
    const binPath = pkg.bin?.["admin-conformance"] ?? ""
    expect(binPath).not.toMatch(/^\.\//)
    expect(binPath).toBe("dist/cli.js")
  })

  // Without this, the file cannot be exec'd through the symlink npm installs
  // into node_modules/.bin, however correct the bin entry is.
  it("starts the CLI entry with a shebang so it can be exec'd", () => {
    const cli = readFileSync(join(packageRoot, "src", "cli.ts"), "utf8")
    expect(cli.startsWith("#!/usr/bin/env node")).toBe(true)
  })
})
