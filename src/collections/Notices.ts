import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrPublisher, publishedOrStaff } from '@/access/isAdmin'

export const Notices: CollectionConfig = {
  slug: 'notices',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'publishedAt', 'active', '_status'] },
  versions: { drafts: true },
  access: {
    read: publishedOrStaff,
    create: isAdminOrPublisher,
    update: isAdminOrPublisher,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'titleNative', type: 'text', label: 'Nepali title' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'publishedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { description: 'Turn off to hide this notice without deleting it.' } },
    { name: 'image', type: 'upload', relationTo: 'uploads', required: true },
    { name: 'imageAlt', type: 'text', required: true, admin: { description: 'Describe the image for people who cannot see it.' } },
  ],
}
