import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'
import { getPublicMedia } from '@/lib/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/about', '/our-team', '/services', '/media', '/contact']
  const pages = routes.map(route => ({ url: `${site.url}${route}`, changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const, priority: route === '' ? 1 : 0.7 }))
  const media = await getPublicMedia()
  return [...pages, ...media.map(item => ({ url: `${site.url}/media/${item.slug}`, lastModified: item.publishedAt ? new Date(item.publishedAt) : undefined, changeFrequency: 'yearly' as const, priority: 0.6 }))]
}
