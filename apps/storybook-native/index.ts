import { registerRootComponent } from 'expo'

const isStorybookEnabled = process.env.STORYBOOK_ENABLED === 'true'

const RootComponent = isStorybookEnabled
  ? require('./.storybook').default
  : require('./App').default

registerRootComponent(RootComponent)
