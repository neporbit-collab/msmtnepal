import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const ContactInquiries: CollectionConfig = {
  slug: 'contact-inquiries', admin: { useAsTitle: 'subject', defaultColumns: ['subject', 'name', 'email', 'status', 'createdAt'] },
  access: { create: isAdmin, read: isAdmin, update: isAdmin, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 100 }, { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', maxLength: 30 }, { name: 'subject', type: 'text', required: true, maxLength: 140 },
    { name: 'message', type: 'textarea', required: true, maxLength: 4000 },
    { name: 'status', type: 'select', defaultValue: 'new', options: [{ label: 'New', value: 'new' }, { label: 'In progress', value: 'in-progress' }, { label: 'Handled', value: 'handled' }] },
  ],
}
