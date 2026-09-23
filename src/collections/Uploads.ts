import path from 'node:path'
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')
export const Uploads: CollectionConfig = {
  slug: 'uploads', upload: { staticDir: uploadDir, imageSizes: [{ name: 'card', width: 800, height: 520, fit: 'cover' }, { name: 'thumb', width: 360, height: 240, fit: 'cover' }], mimeTypes: ['image/*', 'application/pdf', 'video/*'] },
  admin: { useAsTitle: 'filename', defaultColumns: ['filename', 'alt', 'mimeType'] },
  access: { read: () => true, create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: isAdmin },
  fields: [{ name: 'alt', type: 'text', admin: { description: 'Describe the image for people who cannot see it.' } }, { name: 'caption', type: 'text' }, { name: 'credit', type: 'text' }],
}
