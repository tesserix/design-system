'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'nextra-theme-docs'

export function BrandLogo() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const src =
    mounted && resolvedTheme === 'dark' ? '/tesserix-logo-dark.png' : '/tesserix-logo-light.png'

  return <img src={src} alt="Tesserix" style={{ height: '28px', width: 'auto' }} />
}
