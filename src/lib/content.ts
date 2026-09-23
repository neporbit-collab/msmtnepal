import { getPayload } from 'payload'
import config from '@payload-config'
import { services as fallbackServices } from '@/lib/site'

export type PublicService = { id?: string | number; title: string; slug?: string; status: string; summary: string }
export type PublicMedia = { id?: string | number; title: string; slug: string; category: string; summary: string; publishedAt?: string; credit?: string }
export type PublicTeamMember = { id?: string | number; name: string; roleTitle: string; biography?: string; portraitAlt?: string }
export type PublicMetric = { value: string; label: string }

async function getPayloadOrNull() {
  if (!process.env.DATABASE_URL) return null
  try { return await getPayload({ config }) } catch (error) { console.error('CMS content is temporarily unavailable', error); return null }
}

export async function getPublicServices(): Promise<PublicService[]> {
  try {
    const payload = await getPayloadOrNull()
    if (payload) {
    const result = await payload.find({ collection: 'services', where: { _status: { equals: 'published' } }, sort: 'displayOrder', limit: 50, draft: false })
    if (result.docs.length) return result.docs.map(doc => ({ id: doc.id, title: doc.title, slug: doc.slug, status: doc.status, summary: doc.summary }))
    }
  } catch (error) { console.error('Unable to load public services', error) }
  return fallbackServices.map((item, index) => ({ id: index, title: item.title, status: item.status === 'Current service' ? 'current' : item.status === 'Planned' ? 'planned' : 'confirm', summary: item.text }))
}

export async function getPublicMetrics(): Promise<PublicMetric[]> {
  try {
    const payload = await getPayloadOrNull(); if (!payload) return []
    const settings = await payload.findGlobal({ slug: 'site-settings' })
    const metrics = (settings.metricsForReview || []) as { value: string; label: string }[]
    return metrics.map(metric => ({ value: metric.value, label: metric.label }))
  } catch (error) { console.error('Unable to load organization metrics', error); return [] }
}

export async function getPublicMedia(): Promise<PublicMedia[]> {
  try { const payload = await getPayloadOrNull(); if (!payload) return []
    const result = await payload.find({ collection: 'media-items', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 50, draft: false })
    return result.docs.map(doc => ({ id: doc.id, title: doc.title, slug: doc.slug, category: doc.category, summary: doc.summary, publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : undefined, credit: doc.credit || undefined }))
  } catch (error) { console.error('Unable to load public media', error); return [] }
}

export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  try { const payload = await getPayloadOrNull(); if (!payload) return []
    const result = await payload.find({ collection: 'team-members', where: { and: [{ _status: { equals: 'published' } }, { active: { equals: true } }] }, sort: 'displayOrder', limit: 100, draft: false })
    return result.docs.map(doc => ({ id: doc.id, name: doc.name, roleTitle: doc.roleTitle, biography: doc.biography || undefined, portraitAlt: doc.portraitAlt || undefined }))
  } catch (error) { console.error('Unable to load public team profiles', error); return [] }
}
