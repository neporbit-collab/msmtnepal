import type { CollectionConfig } from 'payload'
import { isAdmin, publishedOrStaff } from '@/access/isAdmin'

export const Services: CollectionConfig = {
  slug: 'services', admin: { useAsTitle: 'title', defaultColumns: ['title', 'status', '_status'] }, versions: { drafts: true },
  access: { read: publishedOrStaff, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'textarea', required: true }, { name: 'body', type: 'richText' },
    { name: 'status', type: 'select', required: true, defaultValue: 'confirm', options: [{ label: 'Current service', value: 'current' }, { label: 'Planned', value: 'planned' }, { label: 'Status to confirm', value: 'confirm' }] },
    { name: 'displayOrder', type: 'number', defaultValue: 0 }, { name: 'seoTitle', type: 'text' }, { name: 'seoDescription', type: 'textarea' },
  ],
}
