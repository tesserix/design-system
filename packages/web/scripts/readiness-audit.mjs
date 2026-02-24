import { readdirSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const indexSource = readFileSync(join(root, "src", "index.ts"), "utf8")
const components = [...indexSource.matchAll(/^export \* from '\.\/components\/([^']+)'/gm)].map((m) => m[1])

const issues = []

const hasInteraction = (source) => /\bplay\s*:\s*async\b/.test(source) || /SmokeTest/.test(source)

for (const component of components) {
  const componentDir = join(root, "src", "components", component)
  const files = readdirSync(componentDir)

  const docFile = join(root, "docs", "content", "components", `${component}.mdx`)
  if (!existsSync(docFile)) {
    issues.push(`Missing docs page: docs/content/components/${component}.mdx`)
  } else {
    const docSource = readFileSync(docFile, "utf8")
    if (!/## Do \/ Don't/.test(docSource)) {
      issues.push(`Missing Do/Don't section: docs/content/components/${component}.mdx`)
    }
  }

  const stories = files.filter((file) => file.endsWith(".stories.tsx"))
  if (stories.length === 0) {
    issues.push(`Missing story file: src/components/${component}`)
  } else {
    const hasAnyInteraction = stories.some((file) => hasInteraction(readFileSync(join(componentDir, file), "utf8")))
    if (!hasAnyInteraction) {
      issues.push(`No interaction/smoke story: src/components/${component}`)
    }
  }

  const barrelFile = join(componentDir, "index.ts")
  if (!existsSync(barrelFile)) {
    issues.push(`Missing barrel export: src/components/${component}/index.ts`)
  } else {
    const barrelSource = readFileSync(barrelFile, "utf8")
    if (!/export\s+type\s*(\{|\*)/.test(barrelSource)) {
      issues.push(`Missing type exports in barrel: src/components/${component}/index.ts`)
    }
  }
}

const allowedHexInternalFiles = new Set([
  join(root, "src", "components", "color-picker", "color-picker.tsx"),
])
const allowedPaletteInternalFiles = new Set()

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath, out)
      continue
    }
    if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) continue
    out.push(fullPath)
  }
  return out
}

const hexPattern = /#[0-9a-fA-F]{3,8}\b/g
const paletteClassPattern =
  /\b(?:bg|text|border|ring|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g
for (const file of walk(join(root, "src", "components"))) {
  if (file.endsWith(".stories.tsx") || file.endsWith(".test.tsx")) continue

  const source = readFileSync(file, "utf8")
  if (!allowedHexInternalFiles.has(file) && hexPattern.test(source)) {
    issues.push(`Raw hex color found in component source: ${file.replace(`${root}/`, "")}`)
  }

  if (!allowedPaletteInternalFiles.has(file) && paletteClassPattern.test(source)) {
    issues.push(`Hardcoded Tailwind palette color found in component source: ${file.replace(`${root}/`, "")}`)
  }
}

const findIconOnlyButtonsWithoutLabels = (source) => {
  const violations = []
  const buttonPattern = /<button\b([^>]*)>([\s\S]*?)<\/button>/gm

  for (const match of source.matchAll(buttonPattern)) {
    const attributes = match[1] ?? ""
    const body = match[2] ?? ""
    const hasSvg = /<svg\b/i.test(body)
    const text = body
      .replace(/<[^>]+>/g, "")
      .replace(/&[a-zA-Z0-9#]+;/g, "")
      .trim()
    const hasText = text.length > 0
    const hasAriaLabel = /\baria-label\s*=/.test(attributes) || /\baria-labelledby\s*=/.test(attributes)
    const hasTitle = /\btitle\s*=/.test(attributes)

    if (hasSvg && !hasText && !hasAriaLabel && !hasTitle) {
      violations.push(match[0].slice(0, 120).replace(/\s+/g, " "))
    }
  }

  return violations
}

for (const file of walk(join(root, "src", "components"))) {
  if (file.endsWith(".stories.tsx") || file.endsWith(".test.tsx")) continue
  const source = readFileSync(file, "utf8")
  const violations = findIconOnlyButtonsWithoutLabels(source)
  if (violations.length > 0) {
    issues.push(`Icon-only button missing accessible label: ${file.replace(`${root}/`, "")}`)
  }
}

const focusStateChecks = [
  "button/button.tsx",
  "input/input.tsx",
  "textarea/textarea.tsx",
  "select/select.tsx",
  "number-input/number-input.tsx",
  "dropdown-menu/dropdown-menu.tsx",
]

for (const relative of focusStateChecks) {
  const file = join(root, "src", "components", relative)
  if (!existsSync(file)) {
    issues.push(`Missing focus-state reference file: src/components/${relative}`)
    continue
  }

  const source = readFileSync(file, "utf8")
  if (!/focus-visible:|focus:/.test(source)) {
    issues.push(`Missing focus styles in key primitive: src/components/${relative}`)
  }
}

if (issues.length > 0) {
  console.error("Readiness audit failed:\n")
  for (const issue of issues) {
    console.error(`- ${issue}`)
  }
  process.exit(1)
}

console.log(`Readiness audit passed for ${components.length} exported components.`)
