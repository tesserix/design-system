import { spawnSync } from "node:child_process"

const result = spawnSync("npm", ["run", "test:run"], {
  encoding: "utf8",
  shell: process.platform === "win32",
})

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`
process.stdout.write(result.stdout ?? "")
process.stderr.write(result.stderr ?? "")

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

const warningPatterns = [
  /not wrapped in act\(\)/i,
  /hydration/i,
  /did not match/i,
  /text content does not match server-rendered html/i,
]

const matches = warningPatterns.flatMap((pattern) => {
  const found = output.match(pattern)
  return found ? [String(found[0])] : []
})

if (matches.length > 0) {
  console.error("\nRuntime warning audit failed:")
  for (const match of matches) {
    console.error(`- ${match}`)
  }
  process.exit(1)
}

console.log("\nRuntime warning audit passed (no hydration/act warnings found).")
