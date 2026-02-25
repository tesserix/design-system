import React from 'react'
import { BrandLogo } from './components/brand-logo'

const config = {
  logo: <BrandLogo />,
  project: {
    link: 'https://github.com/tesserix/design-system',
  },
  docsRepositoryBase: 'https://github.com/tesserix/design-system/tree/main/apps/docs',
  footer: {
    text: (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 12,
          lineHeight: 1.1,
        }}
      >
        <img
          src="/icon.png"
          alt="Tesserix"
          style={{ width: 16, height: 16, borderRadius: 3, display: 'inline-block' }}
        />
        <span>© {new Date().getFullYear()}</span>
        <a href="https://tesserix.app" target="_blank" rel="noreferrer">
          Tesserix
        </a>
        <span style={{ opacity: 0.6 }}>Design System</span>
      </span>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s - Tesserix Design System',
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Tesserix Design System" />
      <meta
        property="og:description"
        content="Cross-platform design system for web and React Native."
      />
    </>
  ),
  primaryHue: 212,
  primarySaturation: 100,
  banner: {
    key: 'design-system-monorepo',
    text: (
      <a href="/packages" target="_self">
        Tesserix Design System docs now include web, native, tokens, hooks, and utils.
      </a>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  editLink: {
    text: 'Edit this page on GitHub ->',
  },
  feedback: {
    content: 'Question? Share feedback ->',
    labels: 'docs-feedback',
  },
  navigation: {
    prev: true,
    next: true,
  },
}

export default config
