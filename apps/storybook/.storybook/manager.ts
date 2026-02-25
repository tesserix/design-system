import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

addons.setConfig({
  theme: {
    ...themes.dark,
    brandUrl: 'https://docs.tesserix.app',
    brandImage: '/tesserix-logo-dark.png',
    brandTarget: '_blank',
  },
  sidebar: {
    showRoots: true,
    collapsedRoots: [],
  },
  // Disable settings panel
  enableShortcuts: false,
  showPanel: true,
  panelPosition: 'bottom',
  // Hide settings addon
  toolbar: {
    settings: { hidden: true },
    'storybook/settings': { hidden: true },
  },
})
