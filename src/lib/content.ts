import { getPayload } from 'payload'
import config from '@payload-config'
import { services as fallbackServices } from '@/lib/site'
import { notices as fallbackNotices, type Notice } from '@/lib/notices'

export type PublicService = { id?: string | number; title: string; slug?: string; status: string; summary: string }
export type PublicMedia = { id?: string | number; title: string; slug: string; category: string; summary: string; publishedAt?: string; credit?: string }
export type PublicTeamMember = { id?: string | number; name: string; roleTitle: string; biography?: string; portraitAlt?: string; portraitUrl?: string }
export type PublicAnnouncementPopup = { title?: string; message?: string; imageUrl?: string; imageAlt?: string; buttonLabel?: string; buttonUrl?: string }

function getUploadUrl(value: unknown): string | undefined {
  if (value && typeof value === 'object' && 'url' in value && typeof value.url === 'string') return value.url
  return undefined
}

function getSafePopupUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const url = value.trim()
  if (url.startsWith('/') && !url.startsWith('//')) return url
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? url : undefined
  } catch { return undefined }
}

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

export async function getPublicMedia(): Promise<PublicMedia[]> {
  try { const payload = await getPayloadOrNull(); if (!payload) return []
    const result = await payload.find({ collection: 'media-items', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 50, draft: false })
    return result.docs.map(doc => ({ id: doc.id, title: doc.title, slug: doc.slug, category: doc.category, summary: doc.summary, publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : undefined, credit: doc.credit || undefined }))
  } catch (error) { console.error('Unable to load public media', error); return [] }
}

export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  try { const payload = await getPayloadOrNull(); if (!payload) return []
    const result = await payload.find({ collection: 'team-members', where: { and: [{ _status: { equals: 'published' } }, { active: { equals: true } }] }, sort: 'displayOrder', limit: 100, draft: false })
    return result.docs.map(doc => ({ id: doc.id, name: doc.name, roleTitle: doc.roleTitle, biography: doc.biography || undefined, portraitAlt: doc.portraitAlt || undefined, portraitUrl: doc.portrait && typeof doc.portrait === 'object' && 'url' in doc.portrait && typeof doc.portrait.url === 'string' ? doc.portrait.url : undefined }))
  } catch (error) { console.error('Unable to load public team profiles', error); return [] }
}

export async function getPublicNotices(): Promise<Notice[]> {
  try {
    const payload = await getPayloadOrNull()
    if (!payload) return fallbackNotices
    const result = await payload.find({
      collection: 'notices',
      where: { and: [{ _status: { equals: 'published' } }, { active: { equals: true } }] },
      sort: '-publishedAt', limit: 100, depth: 1, draft: false,
    })
    return result.docs.flatMap(doc => {
      const image = getUploadUrl(doc.image)
      if (!image) return []
      return [{ slug: doc.slug, title: doc.title, titleNative: doc.titleNative || undefined, summary: doc.summary,
        publishedAt: typeof doc.publishedAt === 'string' ? doc.publishedAt : new Date(doc.publishedAt).toISOString().slice(0, 10),
        image, imageAlt: doc.imageAlt }]
    })
  } catch (error) {
    console.error('Unable to load public notices', error)
    return fallbackNotices
  }
}

export async function getActiveAnnouncementPopup(): Promise<PublicAnnouncementPopup | null> {
  try {
    const payload = await getPayloadOrNull()
    if (!payload) return null
    const popup = await payload.findGlobal({ slug: 'announcement-popup', depth: 1 })
    if (!popup.enabled) return null
    const now = Date.now()
    if (popup.startsAt && new Date(popup.startsAt).getTime() > now) return null
    if (popup.endsAt && new Date(popup.endsAt).getTime() < now) return null
    const imageUrl = getUploadUrl(popup.image)
    if (!popup.title && !popup.message && !imageUrl) return null
    return { title: popup.title || undefined, message: popup.message || undefined, imageUrl,
      imageAlt: popup.imageAlt || '', buttonLabel: popup.buttonLabel || undefined, buttonUrl: getSafePopupUrl(popup.buttonUrl) }
  } catch (error) {
    console.error('Unable to load announcement pop-up', error)
    return null
  }
}
