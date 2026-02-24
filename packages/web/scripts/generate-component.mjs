import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const componentsDir = join(rootDir, "src", "components")
const indexFile = join(rootDir, "src", "index.ts")

const args = process.argv.slice(2)
const getArg = (name) => {
  const index = args.findIndex((arg) => arg === `--${name}`)
  return index >= 0 ? args[index + 1] : undefined
}

const rawName = getArg("name")
const dryRun = args.includes("--dry-run")

if (!rawName) {
  console.error("Usage: npm run generate:component -- --name MyComponent [--dry-run]")
  process.exit(1)
}

const toKebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase()

const toPascal = (value) =>
  toKebab(value)
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join("")

const componentName = toPascal(rawName)
const folderName = toKebab(rawName)
const componentDir = join(componentsDir, folderName)

if (existsSync(componentDir)) {
  console.error(`Component directory already exists: ${componentDir}`)
  process.exit(1)
}

const tsxFile = join(componentDir, `${folderName}.tsx`)
const storyFile = join(componentDir, `${folderName}.stories.tsx`)
const testFile = join(componentDir, `${folderName}.test.tsx`)
const barrelFile = join(componentDir, "index.ts")

const tsxTemplate = `import * as React from "react"

import { cn } from "../../lib/utils"

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {}

const ${componentName} = React.forwardRef<HTMLDivElement, ${componentName}Props>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card p-4 text-card-foreground", className)} {...props} />
  )
)
${componentName}.displayName = "${componentName}"

export { ${componentName} }
`

const storyTemplate = `import type { Meta, StoryObj } from "@storybook/react"
import { expect } from "storybook/test"

import { ${componentName} } from "./${folderName}"

const meta = {
  title: "Custom/${componentName}",
  component: ${componentName},
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ${componentName}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <${componentName}>${componentName} content</${componentName}>,
}

export const SmokeTest: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toBeTruthy()
  },
}
`

const testTemplate = `import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { ${componentName} } from "./${folderName}"

describe("${componentName}", () => {
  it("renders children", () => {
    render(<${componentName}>Hello</${componentName}>)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })
})
`

const barrelTemplate = `export { ${componentName} } from "./${folderName}"
export type { ${componentName}Props } from "./${folderName}"
`

const exportLine = `export * from './components/${folderName}'`

if (dryRun) {
  console.log(`[dry-run] Would create: ${tsxFile}`)
  console.log(`[dry-run] Would create: ${storyFile}`)
  console.log(`[dry-run] Would create: ${testFile}`)
  console.log(`[dry-run] Would create: ${barrelFile}`)
  console.log(`[dry-run] Would append export to src/index.ts: ${exportLine}`)
  process.exit(0)
}

mkdirSync(componentDir, { recursive: true })
writeFileSync(tsxFile, tsxTemplate)
writeFileSync(storyFile, storyTemplate)
writeFileSync(testFile, testTemplate)
writeFileSync(barrelFile, barrelTemplate)

const indexSource = readFileSync(indexFile, "utf8")
if (!indexSource.includes(exportLine)) {
  writeFileSync(indexFile, `${indexSource.trimEnd()}\n${exportLine}\n`)
}

console.log(`Created component scaffold: ${componentName}`)
console.log(`Path: src/components/${folderName}`)
