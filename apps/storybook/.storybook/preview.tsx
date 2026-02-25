import type { Preview, Decorator } from '@storybook/react'
import { useEffect } from 'react'
import { AppRegistry } from 'react-native'

// Import web themes directly from source so Storybook does not depend on prebuilt package output.
import '../../../packages/web/src/themes/default.css'
import '../../../packages/web/src/themes/emerald.css'
import '../../../packages/web/src/themes/sapphire.css'
import '../../../packages/web/src/themes/rose.css'
import '../../../packages/web/src/themes/amber.css'
import '../../../packages/web/src/themes/violet.css'
import '../../../packages/web/src/themes/teal.css'
import '../../../packages/web/src/themes/slate.css'
import '../../../packages/web/src/themes/zinc.css'
import '../../../packages/web/src/themes/stone.css'
import '../../../packages/web/src/themes/indigo.css'
import '../../../packages/web/src/themes/cyan.css'
import '../../../packages/web/src/themes/lime.css'
import '../../../packages/web/src/themes/orange.css'
import '../../../packages/web/src/themes/pink.css'
import '../../../packages/web/src/themes/crimson.css'
import '../../../packages/web/src/themes/forest.css'
import '../../../packages/web/src/themes/ocean.css'
import '../../../packages/web/src/themes/sunset.css'
import '../../../packages/web/src/themes/lavender.css'
import '../../../packages/web/src/themes/neon.css'
import '../../../packages/web/src/themes/midnight.css'
import '../../../packages/web/src/themes/mocha.css'

// Initialize react-native-web
if (typeof document !== 'undefined') {
  // Register a dummy app to initialize react-native-web styles
  AppRegistry.registerComponent('App', () => () => null)

  const style = document.createElement('style')
  style.textContent = `
    #storybook-root, #storybook-docs {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* React Native Web base styles */
    body {
      margin: 0;
      padding: 0;
    }

    /* React Native Web default styles */
    [data-focusvisible-polyfill] {
      outline: none;
    }

    /* Ensure react-native-web View components display properly */
    div[class*="css-view"] {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    /* Ensure react-native-web Text components display properly */
    div[class*="css-text"] {
      display: inline;
      box-sizing: border-box;
    }
  `
  document.head.appendChild(style)
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
          { value: 'slate', title: 'Slate', icon: 'circle' },
          { value: 'zinc', title: 'Zinc', icon: 'stop' },
          { value: 'stone', title: 'Stone', icon: 'box' },
          { value: 'indigo', title: 'Indigo', icon: 'bookmark' },
          { value: 'cyan', title: 'Cyan', icon: 'thunder' },
          { value: 'lime', title: 'Lime', icon: 'button' },
          { value: 'orange', title: 'Orange', icon: 'alert' },
          { value: 'pink', title: 'Pink', icon: 'hearthollow' },
          { value: 'crimson', title: 'Crimson', icon: 'closeAlt' },
          { value: 'forest', title: 'Forest', icon: 'admin' },
          { value: 'ocean', title: 'Ocean', icon: 'globe' },
          { value: 'sunset', title: 'Sunset', icon: 'star' },
          { value: 'lavender', title: 'Lavender', icon: 'browser' },
          { value: 'neon', title: 'Neon', icon: 'lightning' },
          { value: 'midnight', title: 'Midnight', icon: 'moon' },
          { value: 'mocha', title: 'Mocha', icon: 'coffee' },
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
