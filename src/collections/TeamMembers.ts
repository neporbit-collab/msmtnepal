import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, publishedOrStaff } from '@/access/isAdmin'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members', admin: { useAsTitle: 'name', defaultColumns: ['name', 'roleTitle', 'displayOrder', '_status'] }, versions: { drafts: true },
  access: { read: publishedOrStaff, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true }, { name: 'roleTitle', type: 'text', required: true },
    { name: 'biography', type: 'textarea' }, { name: 'portrait', type: 'upload', relationTo: 'uploads' },
    { name: 'portraitAlt', type: 'text' }, { name: 'displayOrder', type: 'number', defaultValue: 0 }, { name: 'active', type: 'checkbox', defaultValue: true },
  ],
}
