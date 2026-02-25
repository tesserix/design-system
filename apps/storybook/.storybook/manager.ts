import { addons } from 'storybook/manager-api'
import { create } from '@storybook/theming'

const theme = create({
  base: 'light',
  brandTitle: 'Tesserix Design System',
  brandUrl: 'https://docs.tesserix.app',
  brandImage: '/tesserix-logo-light.png',
  brandTarget: '_blank',

  colorPrimary: '#0066FF',
  colorSecondary: '#0066FF',

  // UI
  appBg: '#ffffff',
  appContentBg: '#ffffff',
  appBorderColor: '#e5e7eb',
  appBorderRadius: 8,

  // Text colors
  textColor: '#1f2937',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#6b7280',
  barSelectedColor: '#0066FF',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputTextColor: '#1f2937',
  inputBorderRadius: 6,
})

const darkTheme = create({
  base: 'dark',
  brandTitle: 'Tesserix Design System',
  brandUrl: 'https://docs.tesserix.app',
  brandImage: '/tesserix-logo-dark.png',
  brandTarget: '_blank',

  colorPrimary: '#3b82f6',
  colorSecondary: '#3b82f6',

  // UI
  appBg: '#0f172a',
  appContentBg: '#1e293b',
  appBorderColor: '#334155',
  appBorderRadius: 8,

  // Text colors
  textColor: '#f1f5f9',
  textInverseColor: '#1f2937',

  // Toolbar default and active colors
  barTextColor: '#94a3b8',
  barSelectedColor: '#3b82f6',
  barBg: '#1e293b',

  // Form colors
  inputBg: '#0f172a',
  inputBorder: '#475569',
  inputTextColor: '#f1f5f9',
  inputBorderRadius: 6,
})

addons.setConfig({
  theme: theme,
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
})
