import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  AppStoreBadges,
  OFFICIAL_BADGE_METRICS,
  resolveBadgeBox,
} from './app-store-badges'

const artwork = {
  ios: '/badges/app-store.svg',
  android: '/badges/google-play.png',
}

const LIVE = {
  ios: { url: 'https://apps.apple.com/app/apple-store/id123', artworkSrc: artwork.ios },
  android: {
    url: 'https://play.google.com/store/apps/details?id=com.example',
    artworkSrc: artwork.android,
  },
}

describe('AppStoreBadges — platform gating', () => {
  it('renders a badge for each configured platform', () => {
    render(<AppStoreBadges appName="Example" listings={LIVE} />)
    expect(screen.getByRole('link', { name: /on the App Store/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /on Google Play/i })).toBeInTheDocument()
  })

  it('renders only the platform whose url is set', () => {
    render(<AppStoreBadges appName="Example" listings={{ android: LIVE.android }} />)
    expect(screen.queryByRole('link', { name: /App Store/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Google Play/i })).toBeInTheDocument()
  })

  it('treats an empty url as unconfigured', () => {
    render(
      <AppStoreBadges
        appName="Example"
        listings={{ ios: { url: '', artworkSrc: artwork.ios }, android: LIVE.android }}
      />
    )
    expect(screen.queryByRole('link', { name: /App Store/i })).not.toBeInTheDocument()
  })

  it('treats a whitespace-only url as unconfigured', () => {
    render(
      <AppStoreBadges
        appName="Example"
        listings={{ ios: { url: '   ', artworkSrc: artwork.ios } }}
      />
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders nothing when no platform is configured', () => {
    const { container } = render(<AppStoreBadges appName="Example" listings={{}} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('AppStoreBadges — Apple badge ordering rule', () => {
  it('places the App Store badge first in the lineup', () => {
    render(<AppStoreBadges appName="Example" listings={LIVE} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAccessibleName(/App Store/i)
  })

  it('keeps App Store first regardless of listing key order', () => {
    render(
      <AppStoreBadges
        appName="Example"
        listings={{ android: LIVE.android, ios: LIVE.ios }}
      />
    )
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAccessibleName(/App Store/i)
  })
})

describe('AppStoreBadges — accessibility', () => {
  it('composes app-specific alt text rather than a generic label', () => {
    render(<AppStoreBadges appName="Mark8ly Admin" listings={LIVE} />)
    expect(screen.getByAltText('Download Mark8ly Admin on the App Store')).toBeInTheDocument()
    expect(screen.getByAltText('Get Mark8ly Admin on Google Play')).toBeInTheDocument()
  })

  it('renders the coming-soon placeholder as inert, not as a link', () => {
    render(
      <AppStoreBadges
        appName="Example"
        listings={{ ios: { url: '', artworkSrc: artwork.ios } }}
        placeholder="coming-soon"
      />
    )
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: /coming soon to the App Store/i })).toBeInTheDocument()
  })

  it('does not render a placeholder by default', () => {
    const { container } = render(
      <AppStoreBadges
        appName="Example"
        listings={{ ios: { url: '', artworkSrc: artwork.ios } }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
})

describe('resolveBadgeBox — equal visual weight', () => {
  it('equalises ink height across platforms, not element height', () => {
    const apple = resolveBadgeBox('ios', 40, OFFICIAL_BADGE_METRICS.ios)
    const play = resolveBadgeBox('android', 40, OFFICIAL_BADGE_METRICS.android)
    expect(apple.inkHeight).toBeCloseTo(play.inkHeight, 5)
  })

  it("scales Google's element up to offset its baked-in clear space", () => {
    const play = resolveBadgeBox('android', 40, OFFICIAL_BADGE_METRICS.android)
    // Google's canvas is 646x250 with 168px of ink => element must exceed 40px.
    expect(play.height).toBeCloseTo(40 / (168 / 250), 5)
    expect(play.height).toBeGreaterThan(40)
  })

  it('derives width from the official aspect ratio', () => {
    const apple = resolveBadgeBox('ios', 40, OFFICIAL_BADGE_METRICS.ios)
    expect(apple.width).toBeCloseTo(40 * (119.66407 / 40), 5)
  })

  it('honours a caller-supplied ink fraction for a differently-cropped asset', () => {
    const box = resolveBadgeBox('android', 40, { aspectRatio: 2, inkFraction: 1 })
    expect(box.height).toBe(40)
    expect(box.width).toBe(80)
  })
})

describe('resolveBadgeBox — Apple clear space', () => {
  it('defaults to one quarter of badge height for standard layouts', () => {
    const apple = resolveBadgeBox('ios', 40, OFFICIAL_BADGE_METRICS.ios)
    expect(apple.margin).toBeCloseTo(10, 5)
  })

  it('drops to one tenth only in compact layouts', () => {
    const apple = resolveBadgeBox('ios', 40, OFFICIAL_BADGE_METRICS.ios, { compact: true })
    expect(apple.margin).toBeCloseTo(4, 5)
  })

  it("adds no extra margin to Google's badge, whose clear space is baked in", () => {
    const play = resolveBadgeBox('android', 40, OFFICIAL_BADGE_METRICS.android)
    expect(play.margin).toBe(0)
  })
})

describe('AppStoreBadges — minimum size guard', () => {
  it('clamps ink height to the 40px onscreen minimum both stores require', () => {
    const apple = resolveBadgeBox('ios', 12, OFFICIAL_BADGE_METRICS.ios)
    expect(apple.inkHeight).toBe(40)
  })

  it('leaves heights at or above the minimum untouched', () => {
    const apple = resolveBadgeBox('ios', 52, OFFICIAL_BADGE_METRICS.ios)
    expect(apple.inkHeight).toBe(52)
  })
})
