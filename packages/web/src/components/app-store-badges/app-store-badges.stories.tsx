import type { Meta, StoryObj } from '@storybook/react'
import { AppStoreBadges } from './app-store-badges'

/**
 * The artwork below is a deliberately plain stand-in so the layout rules are
 * visible in isolation. It is NOT the official badge artwork and must never be
 * used in a real surface — download Apple's from its Marketing Tools and
 * Google's from the Play badge endpoint, self-host them, and pass the paths in
 * via `artworkSrc`.
 */
function stubArtwork(w: number, h: number, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" rx="6" fill="#d4d4d8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 5)}" fill="#52525b">${label}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Matches the official canvases: Apple bleeds to the edge, Google carries
// 41px of baked-in clear space on all four sides.
const APPLE_STUB = stubArtwork(120, 40, 'App Store (stub)')
const PLAY_STUB = stubArtwork(646, 250, 'Google Play (stub)')

const meta = {
  title: 'Components/AppStoreBadges',
  component: AppStoreBadges,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AppStoreBadges>

export default meta
type Story = StoryObj<typeof meta>

/** Both platforms published. App Store is always placed first, per Apple. */
export const Both: Story = {
  args: {
    appName: 'Example App',
    listings: {
      ios: { url: 'https://apps.apple.com/app/apple-store/id123', artworkSrc: APPLE_STUB },
      android: {
        url: 'https://play.google.com/store/apps/details?id=com.example',
        artworkSrc: PLAY_STUB,
      },
    },
  },
}

/** One platform live: the unpublished one simply does not render. */
export const AndroidOnly: Story = {
  args: {
    appName: 'Example App',
    listings: {
      ios: { url: '', artworkSrc: APPLE_STUB },
      android: {
        url: 'https://play.google.com/store/apps/details?id=com.example',
        artworkSrc: PLAY_STUB,
      },
    },
  },
}

/**
 * Pre-launch placeholder. Opt-in, because the official badge reads "Download
 * on the App Store" — untrue before release. The plate carries no store
 * trademark artwork.
 */
export const ComingSoon: Story = {
  args: {
    appName: 'Example App',
    placeholder: 'coming-soon',
    listings: {
      ios: { url: '', artworkSrc: APPLE_STUB },
      android: { url: '', artworkSrc: PLAY_STUB },
    },
  },
}

/** Larger badges. Ink height is matched across platforms, not element height. */
export const Large: Story = {
  args: { ...Both.args, height: 64 },
}
