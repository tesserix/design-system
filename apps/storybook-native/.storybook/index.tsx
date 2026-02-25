import { getStorybookUI, configure } from '@storybook/react-native'
import '@storybook/addon-ondevice-actions/register'
import '@storybook/addon-ondevice-controls/register'

configure(() => {
  require('../../../packages/native/src/components/Button/Button.stories')
  require('../../../packages/native/src/components/Badge/Badge.stories')
  require('../../../packages/native/src/components/Card/Card.stories')
}, module)

const StorybookUIRoot = getStorybookUI({
  shouldPersistSelection: true,
  onDeviceUI: true,
})

export default StorybookUIRoot
