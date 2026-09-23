import type { CollectionConfig } from 'payload'
import { isAdmin, publishedOrStaff } from '@/access/isAdmin'

export const MediaItems: CollectionConfig = {
  slug: 'media-items', admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'publishedAt', '_status'] }, versions: { drafts: true },
  access: { read: publishedOrStaff, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'category', type: 'select', required: true, options: ['news', 'story', 'report', 'photo', 'video'].map(value => ({ label: value[0].toUpperCase()+value.slice(1), value })) },
    { name: 'summary', type: 'textarea', required: true }, { name: 'body', type: 'richText' }, { name: 'publishedAt', type: 'date' },
    { name: 'coverImage', type: 'upload', relationTo: 'uploads' }, { name: 'imageAlt', type: 'text' }, { name: 'file', type: 'upload', relationTo: 'uploads' },
    { name: 'credit', type: 'text' }, { name: 'seoTitle', type: 'text' }, { name: 'seoDescription', type: 'textarea' },
  ],
}
