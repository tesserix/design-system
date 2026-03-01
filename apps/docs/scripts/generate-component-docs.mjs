import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '../../..')
const docsContent = path.join(root, 'apps/docs/content')
const nativeComponentsDir = path.join(root, 'packages/native/src/components')
const webComponentsDir = path.join(root, 'packages/web/src/components')
const nativeIndexPath = path.join(root, 'packages/native/src/index.ts')
const hooksDir = path.join(root, 'packages/hooks/src')
const utilsDir = path.join(root, 'packages/utils/src')
const tokensColorsPath = path.join(root, 'packages/tokens/src/colors.ts')

const generatedByHeader = ''

function titleCaseFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => {
      const upper = ['api', 'id', 'ui', 'otp', 'fab', 'qr', 'kbd']
      if (upper.includes(part)) return part.toUpperCase()
      return part.charAt(0).toUpperCase() + part.slice(1)
    })
    .join(' ')
}

function kebabFromPascal(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function camelFromKebab(value) {
  return value
    .split('-')
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('')
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function readDirNames(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
}

function parseNativeIndex(content) {
  const exportByComponent = new Map()
  const typeByComponent = new Map()

  const exportRegex = /^export\s+\{([^}]+)\}\s+from\s+'\.\/components\/([^']+)'/gm
  let match
  while ((match = exportRegex.exec(content)) !== null) {
    const names = match[1].split(',').map((s) => s.trim()).filter(Boolean)
    const component = match[2]
    exportByComponent.set(component, names)
  }

  const typeRegex = /^export\s+type\s+\{([^}]+)\}\s+from\s+'\.\/components\/([^']+)'/gm
  while ((match = typeRegex.exec(content)) !== null) {
    const names = match[1].split(',').map((s) => s.trim()).filter(Boolean)
    const component = match[2]
    typeByComponent.set(component, names)
  }

  return { exportByComponent, typeByComponent }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function parseExportNamesFromSource(source) {
  const result = new Set()

  for (const m of source.matchAll(/export\s+(?:const|function|class)\s+([A-Za-z0-9_]+)/g)) {
    result.add(m[1])
  }

  for (const m of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    const names = m[1]
      .split(',')
      .map((v) => v.trim().split(/\s+as\s+/)[1] || v.trim().split(/\s+as\s+/)[0])
      .map((v) => v.trim())
      .filter(Boolean)
    for (const name of names) result.add(name)
  }

  return [...result]
}

function parseJsDocSummaryForExport(source, exportName = null) {
  const docsByExport = new Map()
  const blockRegex = /\/\*\*([\s\S]*?)\*\//g

  for (const match of source.matchAll(blockRegex)) {
    const block = match[1]
    const blockEnd = match.index + match[0].length
    const nextChunk = source.slice(blockEnd).trimStart()
    const exportMatch = nextChunk.match(/^export\s+(?:function|class|const)\s+([A-Za-z0-9_]+)/)
    if (!exportMatch) continue
    const name = exportMatch[1]

    const lines = block
      .split('\n')
      .map((line) => line.replace(/^\s*\*\s?/, '').trim())
      .filter(Boolean)
      .filter((line) => !line.startsWith('@'))
    if (lines.length > 0) {
      docsByExport.set(name, lines[0])
    }
  }

  if (exportName && docsByExport.has(exportName)) {
    return docsByExport.get(exportName)
  }

  return docsByExport.values().next().value ?? null
}

function hookDescription(hookFn) {
  const descriptions = {
    useToggle: 'Boolean state helper with toggle, setTrue, and setFalse actions.',
    useBoolean: 'Boolean state helper with semantic on/off handlers.',
    useCounter: 'Counter state with increment, decrement, and reset helpers.',
    useArray: 'Array state helpers for append, remove, update, and clear patterns.',
    useMap: 'Map state helpers for setting, deleting, and resetting entries.',
    useSet: 'Set state helpers for add, remove, toggle, and clear operations.',
    useAsync: 'Async workflow state machine with loading, success, and error states.',
    usePrevious: 'Returns the previous value from the prior render.',
    useDebounce: 'Debounces rapid value changes and emits a delayed stable value.',
    useThrottle: 'Throttles value updates to a fixed interval.',
    useDebouncedCallback: 'Debounced callback executor for expensive handlers.',
    useThrottledCallback: 'Throttled callback executor for high-frequency events.',
    useInterval: 'Declarative interval hook with automatic cleanup.',
    useTimeout: 'Declarative timeout hook with cleanup and cancellation.',
    useOnMount: 'Runs side effects once when the component mounts.',
    useOnUnmount: 'Runs cleanup side effects when component unmounts.',
    useEffectOnce: 'Runs an effect exactly once.',
    useUpdateEffect: 'Runs an effect only after the initial render.',
    useIsomorphicLayoutEffect: 'Safe layout effect across browser and SSR environments.',
    useMounted: 'Tracks whether a component is currently mounted.',
    useForm: 'Lightweight form state and validation helper.',
  }
  return descriptions[hookFn] ?? null
}

function hookExample(hookFn) {
  const examples = {
    useToggle: `const { value, toggle } = useToggle(false)`,
    useBoolean: `const { value, setTrue, setFalse } = useBoolean(false)`,
    useCounter: `const { count, inc, dec, reset } = useCounter(0)`,
    useDebounce: `const debounced = useDebounce(search, 300)`,
    useThrottle: `const throttled = useThrottle(scrollY, 200)`,
    useInterval: `useInterval(() => refresh(), 5000)`,
    useTimeout: `useTimeout(() => setReady(true), 1000)`,
    useAsync: `const { execute, isLoading, data } = useAsync(fetchUsers)`,
    usePrevious: `const prevValue = usePrevious(value)`,
    useForm: `const form = useForm({ initialValues: { email: '' } })`,
  }
  return examples[hookFn] ?? `const result = ${hookFn}()`
}

function parseHookSignature(source, hookFn) {
  const functionExport = source.match(
    new RegExp(`export\\s+function\\s+${hookFn}\\s*\\(([^)]*)\\)(?::\\s*([^\\s{]+))?`),
  )
  if (functionExport) {
    const args = functionExport[1].trim()
    const ret = functionExport[2]?.trim()
    return `function ${hookFn}(${args})${ret ? `: ${ret}` : ''}`
  }

  const constExport = source.match(
    new RegExp(`const\\s+${hookFn}\\s*=\\s*\\(([^)]*)\\)\\s*(?::\\s*([^=]+))?=>`),
  )
  if (constExport) {
    const args = constExport[1].trim()
    const ret = constExport[2]?.trim()
    return `const ${hookFn} = (${args})${ret ? `: ${ret}` : ''} =>`
  }

  return null
}

function parseNamedExports(source) {
  const names = new Set()

  for (const m of source.matchAll(/export\s+(?:function|class|const|interface|type)\s+([A-Za-z0-9_]+)/g)) {
    names.add(m[1])
  }

  for (const m of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    const items = m[1]
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
    for (const item of items) {
      const [rawLeft, rawRight] = item.split(/\s+as\s+/)
      names.add((rawRight || rawLeft).trim())
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b))
}

function extractThemeToken(block, tokenName) {
  const m = block.match(new RegExp(`${tokenName}:\\s*'([^']+)'`))
  return m ? m[1] : null
}

function parseThemeData(colorsSource) {
  const blockRegex = /export const (\w+)Colors: ThemeColors = \{([\s\S]*?)\n\}/g
  const themeData = new Map()
  let match

  while ((match = blockRegex.exec(colorsSource)) !== null) {
    const constName = match[1]
    const themeName = constName.replace(/Colors$/, '')
    const body = match[2]

    const lightMatch = body.match(/light:\s*\{([\s\S]*?)\},\s*dark:/)
    const darkMatch = body.match(/dark:\s*\{([\s\S]*?)\},?\s*$/)
    if (!lightMatch || !darkMatch) continue

    const lightBlock = lightMatch[1]
    const darkBlock = darkMatch[1]

    themeData.set(themeName, {
      light: {
        background: extractThemeToken(lightBlock, 'background'),
        primary: extractThemeToken(lightBlock, 'primary'),
        accent: extractThemeToken(lightBlock, 'accent'),
      },
      dark: {
        background: extractThemeToken(darkBlock, 'background'),
        primary: extractThemeToken(darkBlock, 'primary'),
        accent: extractThemeToken(darkBlock, 'accent'),
      },
    })
  }

  const themesBlock = colorsSource.match(/export const themes = \{([\s\S]*?)\} as const/)
  const order = []
  if (themesBlock) {
    for (const m of themesBlock[1].matchAll(/^\s*(\w+):/gm)) {
      order.push(m[1])
    }
  }

  return { themeData, order }
}

async function getWebExportsForComponent(componentSlug, componentDir) {
  const indexTs = path.join(componentDir, 'index.ts')
  if (await fileExists(indexTs)) {
    const content = await fs.readFile(indexTs, 'utf8')
    const localExportPathMatch = content.match(/from\s+'\.\/([^']+)'/)
    if (localExportPathMatch) {
      const sourceFile = path.join(componentDir, `${localExportPathMatch[1]}.tsx`)
      if (await fileExists(sourceFile)) {
        const source = await fs.readFile(sourceFile, 'utf8')
        const names = parseExportNamesFromSource(source)
        if (names.length > 0) return names
      }
    }

    const namesFromIndex = parseExportNamesFromSource(content)
    if (namesFromIndex.length > 0) return namesFromIndex
  }

  const guess = titleCaseFromSlug(componentSlug).replace(/\s+/g, '')
  return [guess]
}

async function generateNativeDocs() {
  const nativeIndexContent = await fs.readFile(nativeIndexPath, 'utf8')
  const parsed = parseNativeIndex(nativeIndexContent)
  const componentNames = (await readDirNames(nativeComponentsDir))
    .filter((name) => !name.startsWith('_'))
    .sort((a, b) => a.localeCompare(b))

  const targetDir = path.join(docsContent, 'native-components')
  await ensureDir(targetDir)

  const meta = { index: 'Overview' }

  for (const componentName of componentNames) {
    const slug = kebabFromPascal(componentName)
    meta[slug] = componentName

    const componentDir = path.join(nativeComponentsDir, componentName)
    const storyPath = path.join(componentDir, `${componentName}.stories.tsx`)
    const testPath = path.join(componentDir, `${componentName}.test.tsx`)
    const componentPath = path.join(componentDir, `${componentName}.tsx`)

    const hasStory = await fileExists(storyPath)
    const hasTest = await fileExists(testPath)
    const hasComponent = await fileExists(componentPath)

    const exports = parsed.exportByComponent.get(componentName) || [componentName]
    const typeExports = parsed.typeByComponent.get(componentName) || []

    const mdx = `${generatedByHeader}# ${componentName}\n\nPackage: \`@tesserix/native\`\n\n## Import\n\n\`\`\`tsx\nimport { ${exports.join(', ')} } from '@tesserix/native'\n\`\`\`\n\n${
      typeExports.length > 0
        ? `## Related types\n\n- ${typeExports.map((t) => `\`${t}\``).join(', ')}\n\n`
        : ''
    }## Source\n\n- Component: \`packages/native/src/components/${componentName}/${componentName}.tsx\`\n- Story: ${hasStory ? `\`packages/native/src/components/${componentName}/${componentName}.stories.tsx\`` : 'Not found'}\n- Test: ${hasTest ? `\`packages/native/src/components/${componentName}/${componentName}.test.tsx\`` : 'Not found'}\n\n## Status\n\n- Exported from package entry: ${parsed.exportByComponent.has(componentName) ? 'Yes' : 'No'}\n- Component implementation file: ${hasComponent ? 'Present' : 'Missing'}\n\n## Example\n\n\`\`\`tsx\nimport { ${exports[0]} } from '@tesserix/native'\n\nexport function Demo${componentName}() {\n  return <${exports[0]} />\n}\n\`\`\`\n`

    await fs.writeFile(path.join(targetDir, `${slug}.mdx`), mdx, 'utf8')
  }

  const indexDoc = `${generatedByHeader}# Native Components\n\nThis section is generated from \`packages/native/src/components\`.\n\n- Total component folders: **${componentNames.length}**\n- Last generated: **${new Date().toISOString()}**\n\nUse the sidebar to open each component page with import, source, story, and test references.\n`

  await fs.writeFile(path.join(targetDir, 'index.mdx'), indexDoc, 'utf8')
  await fs.writeFile(
    path.join(targetDir, '_meta.js'),
    `export default ${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  )

  return componentNames.length
}

async function generateWebDocs() {
  const componentSlugs = (await readDirNames(webComponentsDir))
    .filter((name) => !name.startsWith('_'))
    .sort((a, b) => a.localeCompare(b))

  const targetDir = path.join(docsContent, 'web-components')
  await ensureDir(targetDir)

  const meta = { index: 'Overview' }

  for (const slug of componentSlugs) {
    const title = titleCaseFromSlug(slug)
    meta[slug] = title

    const componentDir = path.join(webComponentsDir, slug)
    const sourcePath = path.join(componentDir, `${slug}.tsx`)
    const storyPath = path.join(componentDir, `${slug}.stories.tsx`)
    const testPath = path.join(componentDir, `${slug}.test.tsx`)

    const hasSource = await fileExists(sourcePath)
    const hasStory = await fileExists(storyPath)
    const hasTest = await fileExists(testPath)

    const exportNames = await getWebExportsForComponent(slug, componentDir)

    const mdx = `${generatedByHeader}# ${title}\n\nPackage: \`@tesserix/web\`\n\n## Import\n\n\`\`\`tsx\nimport { ${exportNames.join(', ')} } from '@tesserix/web'\n\`\`\`\n\n## Source\n\n- Component: ${hasSource ? `\`packages/web/src/components/${slug}/${slug}.tsx\`` : 'Not found'}\n- Story: ${hasStory ? `\`packages/web/src/components/${slug}/${slug}.stories.tsx\`` : 'Not found'}\n- Test: ${hasTest ? `\`packages/web/src/components/${slug}/${slug}.test.tsx\`` : 'Not found'}\n\n## Status\n\n- Component implementation file: ${hasSource ? 'Present' : 'Missing'}\n- Story file: ${hasStory ? 'Present' : 'Missing'}\n- Test file: ${hasTest ? 'Present' : 'Missing'}\n\n## Example\n\n\`\`\`tsx\nimport { ${exportNames[0]} } from '@tesserix/web'\n\nexport function Demo${exportNames[0]}() {\n  return <${exportNames[0]} />\n}\n\`\`\`\n`

    await fs.writeFile(path.join(targetDir, `${slug}.mdx`), mdx, 'utf8')
  }

  const indexDoc = `${generatedByHeader}# Web Components\n\nThis section is generated from \`packages/web/src/components\`.\n\n- Total component folders: **${componentSlugs.length}**\n- Last generated: **${new Date().toISOString()}**\n\nUse the sidebar to open each component page with import, source, story, and test references.\n`

  await fs.writeFile(path.join(targetDir, 'index.mdx'), indexDoc, 'utf8')
  await fs.writeFile(
    path.join(targetDir, '_meta.js'),
    `export default ${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  )

  return componentSlugs.length
}

async function generateHooksDocs() {
  const targetDir = path.join(docsContent, 'hooks')
  await ensureDir(targetDir)

  const hookFiles = (await fs.readdir(hooksDir))
    .filter((name) => name.startsWith('use-') && name.endsWith('.ts'))
    .sort((a, b) => a.localeCompare(b))

  const meta = { index: 'Overview' }

  for (const file of hookFiles) {
    const hookName = file.replace('.ts', '')
    const slug = hookName
    const hookFn = camelFromKebab(hookName)

    meta[slug] = hookFn

    const sourcePath = path.join(hooksDir, file)
    const source = await fs.readFile(sourcePath, 'utf8')
    const summary = parseJsDocSummaryForExport(source, hookFn) ?? hookDescription(hookFn)
    const signature = parseHookSignature(source, hookFn)

    const mdx = `# ${hookFn}\n\nPackage: \`@tesserix/hooks\`\n\n${summary ? `${summary}\n\n` : ''}## Import\n\n\`\`\`tsx\nimport { ${hookFn} } from '@tesserix/hooks'\n\`\`\`\n\n${signature ? `## Signature\n\n\`\`\`ts\n${signature}\n\`\`\`\n\n` : ''}## Source\n\n- Hook: \`packages/hooks/src/${file}\`\n\n## Usage\n\n\`\`\`tsx\nimport { ${hookFn} } from '@tesserix/hooks'\n\nexport function Demo${hookFn}() {\n  ${hookExample(hookFn)}\n  return null\n}\n\`\`\`\n`

    await fs.writeFile(path.join(targetDir, `${slug}.mdx`), mdx, 'utf8')
  }

  const indexDoc = `# Hooks\n\nThis section is generated from \`packages/hooks/src\`.\n\n- Total hooks: **${hookFiles.length}**\n- Last generated: **${new Date().toISOString()}**\n\nAll hooks in this section are exported from \`@tesserix/hooks\`.\n`

  await fs.writeFile(path.join(targetDir, 'index.mdx'), indexDoc, 'utf8')
  await fs.writeFile(
    path.join(targetDir, '_meta.js'),
    `export default ${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  )

  return hookFiles.length
}

async function generateUtilsDocs() {
  const targetDir = path.join(docsContent, 'utils')
  await ensureDir(targetDir)

  const utilFiles = (await fs.readdir(utilsDir))
    .filter((name) => name.endsWith('.ts') || name.endsWith('.tsx'))
    .filter((name) => name !== 'index.ts' && name !== 'globals.d.ts')
    .sort((a, b) => a.localeCompare(b))

  const meta = { index: 'Overview' }

  for (const file of utilFiles) {
    const slug = file.replace(/\.tsx?$/, '')
    const title = titleCaseFromSlug(slug)
    meta[slug] = title

    const sourcePath = path.join(utilsDir, file)
    const source = await fs.readFile(sourcePath, 'utf8')
    const summary = parseJsDocSummaryForExport(source)
    const exportsList = parseNamedExports(source)

    const mdx = `# ${title}\n\nPackage: \`@tesserix/utils\`\n\n${summary ? `${summary}\n\n` : ''}## Import\n\n\`\`\`tsx\nimport { ${exportsList.filter((name) => !name.endsWith('Props')).slice(0, 5).join(', ') || '...'} } from '@tesserix/utils'\n\`\`\`\n\n## Exports\n\n${exportsList.map((name) => `- \`${name}\``).join('\n')}\n\n## Source\n\n- Utility module: \`packages/utils/src/${file}\`\n\n## Usage\n\n\`\`\`tsx\nimport * as Utils from '@tesserix/utils'\n\nexport function Demo${title.replace(/\s+/g, '')}() {\n  return null\n}\n\`\`\`\n`

    await fs.writeFile(path.join(targetDir, `${slug}.mdx`), mdx, 'utf8')
  }

  const indexDoc = `# Utils\n\nThis section is generated from \`packages/utils/src\`.\n\n- Total utility modules: **${utilFiles.length}**\n- Last generated: **${new Date().toISOString()}**\n\nUse these modules from \`@tesserix/utils\`.\n`

  await fs.writeFile(path.join(targetDir, 'index.mdx'), indexDoc, 'utf8')
  await fs.writeFile(
    path.join(targetDir, '_meta.js'),
    `export default ${JSON.stringify(meta, null, 2)}\n`,
    'utf8',
  )

  return utilFiles.length
}

async function generateThemingDoc() {
  const colorsSource = await fs.readFile(tokensColorsPath, 'utf8')
  const { themeData, order } = parseThemeData(colorsSource)

  const themeCards = order
    .filter((theme) => themeData.has(theme))
    .map((theme) => {
      const data = themeData.get(theme)
      return `<div style={{ border: '1px solid var(--nextra-border)', borderRadius: 8, padding: 12 }}>
  <div style={{ fontWeight: 600, marginBottom: 8 }}><code>${theme}</code></div>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
    <div style={{ background: 'hsl(${data.light.background})', color: 'hsl(${data.light.primary})', border: '1px solid #ddd', borderRadius: 6, padding: '10px 6px', fontSize: 11, textAlign: 'center' }}>light bg</div>
    <div style={{ background: 'hsl(${data.light.primary})', color: '#fff', borderRadius: 6, padding: '10px 6px', fontSize: 11, textAlign: 'center' }}>light primary</div>
    <div style={{ background: 'hsl(${data.light.accent})', color: '#111', border: '1px solid #ddd', borderRadius: 6, padding: '10px 6px', fontSize: 11, textAlign: 'center' }}>light accent</div>
    <div style={{ background: 'hsl(${data.dark.background})', color: '#fff', borderRadius: 6, padding: '10px 6px', fontSize: 11, textAlign: 'center' }}>dark bg</div>
    <div style={{ background: 'hsl(${data.dark.primary})', color: '#111', borderRadius: 6, padding: '10px 6px', fontSize: 11, textAlign: 'center' }}>dark primary</div>
    <div style={{ background: 'hsl(${data.dark.accent})', color: '#fff', borderRadius: 6, padding: '10px 6px', fontSize: 11, textAlign: 'center' }}>dark accent</div>
  </div>
</div>`
    })
    .join('\n')

  const themingDoc = `# Theming

Theming is token-driven and shared across web and native packages.

## Available token themes

Total themes: **${order.length}**

${order.map((name) => `- \`${name}\``).join('\n')}

## Theme color previews

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
${themeCards}
</div>

## Platform behavior

The same token theme names are intended to be used across both platforms:

- Web: apply a matching theme strategy in your app styling layer.
- Native: resolve tokens via \`getThemeColors(themeName, mode)\`.

## Tokens usage

\`\`\`ts
import { getThemeColors } from '@tesserix/tokens/colors'

const light = getThemeColors('default', 'light')
const dark = getThemeColors('default', 'dark')
\`\`\`

## Web setup

\`\`\`tsx
import '@tesserix/web/themes/default'
import '@tesserix/web/styles'
\`\`\`

## Native setup

\`\`\`tsx
import { getThemeColors, oklchToRgba } from '@tesserix/tokens/colors'
\`\`\`
`

  await fs.writeFile(path.join(docsContent, 'theming.mdx'), themingDoc, 'utf8')
}

async function updateRootMeta() {
  const metaPath = path.join(docsContent, '_meta.js')
  const content = `export default {\n  index: 'Introduction',\n  foundations: 'Foundations',\n  'getting-started': 'Getting Started',\n  packages: 'Packages',\n  hooks: 'Hooks',\n  utils: 'Utils',\n  'web-components': 'Web Components',\n  'native-components': 'Native Components',\n  theming: 'Theming',\n}\n`

  await fs.writeFile(metaPath, content, 'utf8')
}

async function main() {
  const nativeCount = await generateNativeDocs()
  const webCount = await generateWebDocs()
  const hookCount = await generateHooksDocs()
  const utilsCount = await generateUtilsDocs()
  await generateThemingDoc()
  await updateRootMeta()

  console.log(
    `Generated docs for ${nativeCount} native components, ${webCount} web components, ${hookCount} hooks, and ${utilsCount} utils modules.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
