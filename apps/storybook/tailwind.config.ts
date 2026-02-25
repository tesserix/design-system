import type { Config } from 'tailwindcss'
import webConfig from '../../packages/web/tailwind.config.js'

const config: Config = {
  ...webConfig,
  content: [
    '../../packages/web/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/native/src/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
}

export default config
