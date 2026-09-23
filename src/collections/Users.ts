import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users', auth: { maxLoginAttempts: 5, lockTime: 600000, cookies: { secure: process.env.NODE_ENV === 'production' } },
  admin: { useAsTitle: 'email' },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: async ({ req }) => {
      if (req.user) return (req.user as { role?: string }).role === 'admin'
      const users = await req.payload.count({ collection: 'users', overrideAccess: true })
      return users.totalDocs === 0
    },
    delete: isAdmin, read: isAdmin, update: isAdmin,
  },
  hooks: { beforeValidate: [async ({ data, operation, req }) => {
    if (operation === 'create' && !req.user) {
      const users = await req.payload.count({ collection: 'users', overrideAccess: true })
      if (users.totalDocs === 0 && data) return { ...data, role: 'admin' }
    }
    return data
  }] },
  fields: [{ name: 'role', type: 'select', required: true, defaultValue: 'editor', options: [{ label: 'Administrator', value: 'admin' }, { label: 'Editor', value: 'editor' }] }],
}
