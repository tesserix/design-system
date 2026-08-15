import { NextResponse } from 'next/server'

// Nextra prerenders every docs page, so the OpenPanel client id the Helm chart
// supplies at runtime can never be baked into their HTML. The browser reads it
// from here instead.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json(
    {
      clientId: process.env.OPENPANEL_CLIENT_ID ?? null,
      apiUrl: process.env.OPENPANEL_API_URL ?? null,
      scriptUrl: process.env.OPENPANEL_SCRIPT_URL ?? null,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
