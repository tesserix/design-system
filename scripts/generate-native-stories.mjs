#!/usr/bin/env node
import { readdir, readFile, writeFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const componentsDir = join(__dirname, '../packages/native/src/components')

const storyTemplate = (componentName) => `import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { ${componentName} } from '@tesserix/native'

const meta: Meta<typeof ${componentName}> = {
  title: 'Native/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ${componentName}>

export const Default: Story = {
  args: {},
}
`

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function generateStories() {
  const components = await readdir(componentsDir)
  const created = []
  const skipped = []

  for (const component of components) {
    const componentPath = join(componentsDir, component)
    const storyPath = join(componentPath, `${component}.stories.tsx`)

    // Skip if story already exists
    if (await fileExists(storyPath)) {
      skipped.push(component)
      continue
    }

    // Check if component has an index.ts or tsx file
    const indexPath = join(componentPath, 'index.ts')
    const indexTsxPath = join(componentPath, 'index.tsx')

    if (!(await fileExists(indexPath)) && !(await fileExists(indexTsxPath))) {
      continue
    }

    // Generate story file
    const storyContent = storyTemplate(component)
    await writeFile(storyPath, storyContent, 'utf-8')
    created.push(component)
  }

  console.log(`\n✅ Created ${created.length} story files`)
  console.log(`⏭️  Skipped ${skipped.length} existing story files`)
  console.log(`\nCreated stories for:`)
  created.forEach(name => console.log(`  - ${name}`))
}

generateStories().catch(console.error)
