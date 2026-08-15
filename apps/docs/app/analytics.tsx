'use client'

import { useEffect, useState } from 'react'
import { OpenPanelComponent } from '@openpanel/nextjs'

interface AnalyticsConfig {
  clientId: string | null
  apiUrl: string | null
  scriptUrl: string | null
}

// Self-hosted OpenPanel at analytics.tesserix.app. No client id means no-op,
// so local dev and a first deploy before the project-init job runs stay quiet.
export function Analytics() {
  const [config, setConfig] = useState<AnalyticsConfig | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/analytics-config')
      .then((response) => (response.ok ? response.json() : null))
      .then((loaded) => {
        if (!cancelled) setConfig(loaded)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!config?.clientId) {
    return null
  }

  return (
    <OpenPanelComponent
      clientId={config.clientId}
      apiUrl={config.apiUrl ?? undefined}
      scriptUrl={config.scriptUrl ?? undefined}
      trackScreenViews
      trackOutgoingLinks
      trackAttributes
    />
  )
}
