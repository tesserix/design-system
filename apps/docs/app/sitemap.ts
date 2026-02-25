import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docs.tesserix.app'
  const currentDate = new Date()

  // Core pages
  const routes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/getting-started`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/foundations`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/theming`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Package pages
  const packages = ['hooks', 'icons', 'native', 'tokens', 'utils', 'web']
  const packageRoutes = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Component category pages
  const componentCategories = ['web-components', 'native-components']
  const categoryRoutes = componentCategories.map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Hooks pages
  const hooksRoutes = [
    {
      url: `${baseUrl}/hooks`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Utilities pages
  const utilitiesRoutes = [
    {
      url: `${baseUrl}/utilities`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [...routes, ...packageRoutes, ...categoryRoutes, ...hooksRoutes, ...utilitiesRoutes]
}
