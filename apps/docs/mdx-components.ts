import { useMDXComponents as getThemeMDXComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'nextra/mdx-components'

export const useMDXComponents = (components: MDXComponents = {}) => {
  return getThemeMDXComponents(components)
}
