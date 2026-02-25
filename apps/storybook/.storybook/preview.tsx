import type { Preview, Decorator } from '@storybook/react'
import React, { Component, ReactNode } from 'react'
import { AppRegistry, Platform } from 'react-native'
import { INITIAL_VIEWPORTS } from 'storybook/viewport'

// Import Tailwind base styles
import './globals.css'

// Error Boundary for Chromatic safety
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Story Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', border: '1px solid red', borderRadius: 4 }}>
          <h3>Story Error</h3>
          <pre style={{ fontSize: 12, overflow: 'auto' }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

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
  // Make React available globally for react-native-web
  // Some react-native-web modules expect React to be global
  // @ts-ignore
  if (typeof window !== 'undefined' && !window.React) {
    // @ts-ignore
    window.React = React
  }

  // Set Platform.OS to web to ensure react-native-web behavior
  // @ts-ignore - Platform.OS is read-only but we need to set it for web
  if (!Platform.OS || Platform.OS === 'ios' || Platform.OS === 'android') {
    // @ts-ignore
    Platform.OS = 'web'
  }

  // Register a dummy app to initialize react-native-web styles
  AppRegistry.registerComponent('App', () => () => null)

  const style = document.createElement('style')
  style.textContent = `
    #storybook-root, #storybook-docs {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
    }

    /* Storybook canvas wrappers can force light surfaces; override them with theme tokens. */
    .sb-show-main,
    .sb-main-centered,
    .sb-main-padded,
    .docs-story,
    .sbdocs,
    .sbdocs-wrapper,
    .sbdocs-preview {
      background-color: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
    }

    /* React Native Web base styles */
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: hsl(var(--background));
      color: hsl(var(--foreground));
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
      position: relative;
      min-height: 0;
      min-width: 0;
    }

    /* Ensure react-native-web Text components display properly */
    div[class*="css-text"] {
      display: inline;
      box-sizing: border-box;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    /* TouchableOpacity and other touchable components */
    div[role="button"] {
      cursor: pointer;
      user-select: none;
    }

    /* Image components */
    img[class*="css"] {
      max-width: 100%;
      height: auto;
    }
  `
  document.head.appendChild(style)
}

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme || 'default'
  const mode = context.globals.mode || 'light'
  const resolvedTheme = theme === 'default' ? 'slate' : theme

  // Set theme BEFORE first render (synchronously)
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.setAttribute('data-theme', resolvedTheme)
    root.classList.toggle('dark', mode === 'dark')
    root.classList.toggle('light', mode !== 'dark')
  }

  // Force re-render when theme changes by using key
  // This ensures React Native components pick up new CSS variable values
  return <div key={`${resolvedTheme}-${mode}`}><Story /></div>
}

const withErrorBoundary: Decorator = (Story) => (
  <ErrorBoundary>
    <Story />
  </ErrorBoundary>
)

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      disable: true,
    },
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
    a11y: {
      config: {
        rules: [
          // Disable page-level rules - stories are isolated components, not full pages
          { id: 'page-has-heading-one', enabled: false },
          { id: 'landmark-one-main', enabled: false },
          { id: 'region', enabled: false },
          { id: 'document-title', enabled: false },
          { id: 'html-has-lang', enabled: false },
          { id: 'landmark-unique', enabled: false },
          // Disable color-contrast - components use CSS custom properties and theme tokens
          // Color contrast should be validated in the context of real applications
          { id: 'color-contrast', enabled: false },
        ],
      },
    },
    chromatic: {
      disableSnapshot: false,
      pauseAnimationAtEnd: true,
      delay: 300,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withErrorBoundary, withTheme],
  globalTypes: {
    theme: {
      description: 'Theme Variant',
      defaultValue: 'slate',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'emerald', title: 'Emerald' },
          { value: 'sapphire', title: 'Sapphire' },
          { value: 'rose', title: 'Rose' },
          { value: 'amber', title: 'Amber' },
          { value: 'violet', title: 'Violet' },
          { value: 'teal', title: 'Teal' },
          { value: 'slate', title: 'Slate' },
          { value: 'zinc', title: 'Zinc' },
          { value: 'stone', title: 'Stone' },
          { value: 'indigo', title: 'Indigo' },
          { value: 'cyan', title: 'Cyan' },
          { value: 'lime', title: 'Lime' },
          { value: 'orange', title: 'Orange' },
          { value: 'pink', title: 'Pink' },
          { value: 'crimson', title: 'Crimson' },
          { value: 'forest', title: 'Forest' },
          { value: 'ocean', title: 'Ocean' },
          { value: 'sunset', title: 'Sunset' },
          { value: 'lavender', title: 'Lavender' },
          { value: 'neon', title: 'Neon' },
          { value: 'midnight', title: 'Midnight' },
          { value: 'mocha', title: 'Mocha' },
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
