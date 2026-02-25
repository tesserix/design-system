import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import themeConfig from '../theme.config'

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.tesserix.app'),
  title: {
    default: 'Tesserix Design System - Documentation',
    template: '%s | Tesserix Design System',
  },
  description:
    'Complete documentation for Tesserix Design System. Cross-platform UI components for web and React Native with 123+ components, 23 themes, TypeScript support, and accessibility built-in.',
  keywords: [
    'design system',
    'react',
    'react native',
    'ui components',
    'component library',
    'typescript',
    'tailwind css',
    'accessibility',
    'web components',
    'mobile components',
    'tesserix',
    'ui kit',
    'design tokens',
    'cross-platform',
    'react hooks',
  ],
  authors: [{ name: 'Tesserix', url: 'https://tesserix.app' }],
  creator: 'Tesserix',
  publisher: 'Tesserix',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.tesserix.app',
    title: 'Tesserix Design System - Documentation',
    description:
      'Complete documentation for Tesserix Design System. 123+ cross-platform UI components for web and React Native.',
    siteName: 'Tesserix Design System',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tesserix Design System',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tesserix Design System - Documentation',
    description:
      '123+ cross-platform UI components for web and React Native with TypeScript and accessibility.',
    images: ['/og-image.png'],
    creator: '@tesserix',
    site: '@tesserix',
  },
  alternates: {
    canonical: 'https://docs.tesserix.app',
  },
  category: 'technology',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pageMap = await getPageMap()

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0066FF" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Structured Data for AI/Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: 'Tesserix Design System',
              description:
                'Cross-platform UI component library for web and React Native with 123+ components, 23 themes, and full TypeScript support.',
              url: 'https://docs.tesserix.app',
              codeRepository: 'https://github.com/tesserix/design-system',
              programmingLanguage: ['TypeScript', 'JavaScript', 'React', 'React Native'],
              runtimePlatform: ['Web', 'iOS', 'Android'],
              author: {
                '@type': 'Organization',
                name: 'Tesserix',
                url: 'https://tesserix.app',
              },
              keywords:
                'design system, react, react native, ui components, typescript, tailwind css, accessibility, cross-platform',
            }),
          }}
        />
      </Head>
      <body>
        <Layout
          pageMap={pageMap}
          docsRepositoryBase={themeConfig.docsRepositoryBase}
          navigation={themeConfig.navigation}
          sidebar={themeConfig.sidebar}
          toc={themeConfig.toc}
          editLink={themeConfig.editLink?.text}
          feedback={themeConfig.feedback}
          navbar={<Navbar logo={themeConfig.logo} projectLink={themeConfig.project?.link} />}
          footer={<Footer>{themeConfig.footer?.text}</Footer>}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
