import * as React from "react"
import { cn } from "../../lib/utils"

/**
 * App Store / Google Play download badges.
 *
 * This component ships the *layout rules* the two stores impose — equal visual
 * weight, clear space, minimum size, badge order, alt text — but deliberately
 * ships **no badge artwork**. Apple and Google license their badges to you for
 * promoting your own apps; neither grants the right to redistribute the artwork
 * to third parties, which is what publishing it inside this package would do.
 *
 * Each consuming app downloads the official asset (Apple's Marketing Tools,
 * Google's Play badge endpoint), self-hosts it, and passes the path in via
 * `artworkSrc`. Do not redraw, recolour, crop or reproportion either badge.
 *
 * No hooks are used, so this stays usable inside React Server Components.
 */

export type StorePlatform = "ios" | "android"

export interface BadgeMetrics {
  /** Artwork canvas aspect ratio (width / height). */
  aspectRatio: number
  /**
   * Fraction of the canvas height occupied by visible ink. `1` means the
   * artwork bleeds to the canvas edge; less than 1 means the asset carries
   * its own baked-in clear space.
   */
  inkFraction: number
}

/**
 * Metrics for the official assets, measured off the artwork itself rather than
 * read out of the guidelines:
 *
 * - Apple's SVG is `119.66407 x 40` and bleeds to the edge — no built-in clear
 *   space, so we add Apple's required margin ourselves.
 * - Google's PNG is a `646 x 250` canvas whose ink occupies only `564 x 168`,
 *   i.e. 41px of clear space on all four sides.
 *
 * Sizing both elements to the same height would therefore render Google's
 * artwork ~33% smaller than Apple's and break the equal-visual-weight rule.
 * Override per listing if you supply a differently-cropped asset.
 */
export const OFFICIAL_BADGE_METRICS: Record<StorePlatform, BadgeMetrics> = {
  ios: { aspectRatio: 119.66407 / 40, inkFraction: 1 },
  android: { aspectRatio: 646 / 250, inkFraction: 168 / 250 },
}

/** Both stores require a minimum onscreen badge height of 40px. */
export const MIN_BADGE_INK_HEIGHT = 40

/**
 * Apple requires clear space of one quarter the badge height, relaxed to one
 * tenth only where layout space is very limited (e.g. a mobile banner).
 * Google's required clear space is already baked into its canvas.
 */
const APPLE_CLEAR_SPACE = { standard: 0.25, compact: 0.1 } as const

const STORE_NAME: Record<StorePlatform, string> = {
  ios: "the App Store",
  android: "Google Play",
}

/** Apple asks that its badge be placed first in a lineup of store badges. */
const PLATFORM_ORDER: readonly StorePlatform[] = ["ios", "android"]

export interface BadgeBox {
  /** Rendered element width in px. */
  width: number
  /** Rendered element height in px, including any baked-in clear space. */
  height: number
  /** Height of the *visible artwork*, equalised across platforms. */
  inkHeight: number
  /** Margin to add around the element, in px. */
  margin: number
}

/**
 * Resolves the box for one badge so that visible ink — not element height —
 * matches across platforms.
 */
export function resolveBadgeBox(
  platform: StorePlatform,
  height: number,
  metrics: BadgeMetrics,
  options: { compact?: boolean } = {}
): BadgeBox {
  const inkHeight = Math.max(height, MIN_BADGE_INK_HEIGHT)
  const elementHeight = inkHeight / metrics.inkFraction

  return {
    inkHeight,
    height: elementHeight,
    width: elementHeight * metrics.aspectRatio,
    margin:
      platform === "ios"
        ? inkHeight *
          (options.compact ? APPLE_CLEAR_SPACE.compact : APPLE_CLEAR_SPACE.standard)
        : 0,
  }
}

export interface StoreListing {
  /** Canonical product URL. Empty or whitespace-only means not yet published. */
  url: string
  /** Path to the self-hosted official badge artwork. */
  artworkSrc: string
  /** Override when supplying a differently-cropped asset. */
  metrics?: BadgeMetrics
}

export interface AppStoreBadgesProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, "children"> {
  /** App name as it should read in badge alt text. */
  appName: string
  /** One entry per platform you want to offer. Omit a platform to hide it. */
  listings: Partial<Record<StorePlatform, StoreListing>>
  /** Height of the *visible artwork* in px. Clamped to 40px minimum. */
  height?: number
  /** Use Apple's reduced clear space, for genuinely constrained layouts only. */
  compact?: boolean
  /**
   * What to render for a listing that has no URL yet. `"none"` (default)
   * renders nothing — the official badge reads "Download on the App Store",
   * which would be untrue before launch. `"coming-soon"` renders an inert
   * plate carrying no store trademark artwork.
   */
  placeholder?: "none" | "coming-soon"
  /** Anchor target. Defaults to opening the store in a new tab. */
  target?: React.HTMLAttributeAnchorTarget
}

function AppStoreBadges({
  appName,
  listings,
  height = MIN_BADGE_INK_HEIGHT,
  compact = false,
  placeholder = "none",
  target = "_blank",
  className,
  ...props
}: AppStoreBadgesProps) {
  const items = PLATFORM_ORDER.map((platform) => {
    const listing = listings[platform]
    if (!listing) return null

    const url = listing.url.trim()
    const box = resolveBadgeBox(
      platform,
      height,
      listing.metrics ?? OFFICIAL_BADGE_METRICS[platform],
      { compact }
    )

    if (!url) {
      return placeholder === "coming-soon" ? (
        <li key={platform}>
          <ComingSoonPlate appName={appName} platform={platform} box={box} />
        </li>
      ) : null
    }

    return (
      <li key={platform}>
        <a
          href={url}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          data-slot="app-store-badge-link"
          data-platform={platform}
          className="inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img
            src={listing.artworkSrc}
            alt={altTextFor(appName, platform)}
            width={Math.round(box.width)}
            height={Math.round(box.height)}
            style={box.margin ? { margin: `${box.margin}px` } : undefined}
          />
        </a>
      </li>
    )
  }).filter(Boolean)

  if (items.length === 0) return null

  return (
    <ul
      data-slot="app-store-badges"
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}
      {...props}
    >
      {items}
    </ul>
  )
}

/**
 * Pre-launch stand-in. Carries no store trademark artwork — it is a plain
 * plate — so it is safe to ship in this package and honest about the app not
 * being downloadable yet.
 */
function ComingSoonPlate({
  appName,
  platform,
  box,
}: {
  appName: string
  platform: StorePlatform
  box: BadgeBox
}) {
  return (
    <span
      role="img"
      aria-label={`${appName} — coming soon to ${STORE_NAME[platform]}`}
      data-slot="app-store-badge-placeholder"
      data-platform={platform}
      className="inline-flex items-center justify-center rounded-md border border-dashed border-border bg-muted px-3 text-center text-xs font-medium text-muted-foreground"
      style={{
        width: Math.round(box.width),
        height: Math.round(box.height),
        margin: box.margin ? `${box.margin}px` : undefined,
      }}
    >
      Coming soon to {STORE_NAME[platform]}
    </span>
  )
}

function altTextFor(appName: string, platform: StorePlatform): string {
  return platform === "ios"
    ? `Download ${appName} on the App Store`
    : `Get ${appName} on Google Play`
}

export { AppStoreBadges, altTextFor }
