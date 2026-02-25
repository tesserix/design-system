import { addons } from 'storybook/manager-api'

addons.setConfig({
  brandTitle: 'Tesserix Design System',
  brandUrl: 'https://docs.tesserix.app',
  brandImage: '/tesserix-logo-light.png',
  brandTarget: '_blank',
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
    'storybook/settings': { hidden: true },
  },
})
