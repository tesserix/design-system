import type { Preview, Decorator } from '@storybook/react'
import { useEffect } from 'react'

const isVitest = Boolean((globalThis as { vitest?: unknown }).vitest)

if (!isVitest) {
  void import('../src/themes/default.css')
  void import('../src/themes/emerald.css')
  void import('../src/themes/sapphire.css')
  void import('../src/themes/rose.css')
  void import('../src/themes/amber.css')
  void import('../src/themes/violet.css')
  void import('../src/themes/teal.css')
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'default'
  const mode = context.globals.mode || 'light'

  // Set theme and mode whenever they change
  useEffect(() => {
    const root = document.documentElement

    // Set theme variant
    root.setAttribute('data-theme', theme)

    // Set light/dark mode
    if (mode === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [theme, mode])

  return <Story />
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      test: 'error',
    },
    chromatic: {
      pauseAnimationAtEnd: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Theme Variant',
      defaultValue: 'default',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default', icon: 'circlehollow' },
          { value: 'emerald', title: 'Emerald', icon: 'grow' },
          { value: 'sapphire', title: 'Sapphire', icon: 'component' },
          { value: 'rose', title: 'Rose', icon: 'heart' },
          { value: 'amber', title: 'Amber', icon: 'starhollow' },
          { value: 'violet', title: 'Violet', icon: 'beaker' },
          { value: 'teal', title: 'Teal', icon: 'water' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Light/Dark Mode',
      defaultValue: 'light',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
}

export default preview
