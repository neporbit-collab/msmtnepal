import type { CollectionConfig } from 'payload'
import { isAdmin, publishedOrStaff } from '@/access/isAdmin'

export const Pages: CollectionConfig = {
  slug: 'pages', admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status', 'updatedAt'] }, versions: { drafts: true },
  access: { read: publishedOrStaff, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: isAdmin },
  fields: [
    { name: 'title', type: 'text', required: true }, { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'description', type: 'textarea' },
    { name: 'sections', type: 'blocks', blocks: [
      { slug: 'text', labels: { singular: 'Text section', plural: 'Text sections' }, fields: [{ name: 'heading', type: 'text' }, { name: 'body', type: 'richText' }] },
      { slug: 'highlights', fields: [{ name: 'heading', type: 'text' }, { name: 'items', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'value', type: 'text' }] }] },
      { slug: 'image', fields: [{ name: 'image', type: 'upload', relationTo: 'uploads', required: true }, { name: 'alt', type: 'text', required: true }] },
    ] },
    { name: 'seo', type: 'group', fields: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'shareImage', type: 'upload', relationTo: 'uploads' }] },
  ],
}
