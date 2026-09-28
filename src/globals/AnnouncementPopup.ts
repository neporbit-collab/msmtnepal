import type { GlobalConfig } from 'payload'
import { isAdminOrPublisher } from '@/access/isAdmin'

export const AnnouncementPopup: GlobalConfig = {
  slug: 'announcement-popup',
  label: 'Announcement pop-up',
  access: { read: () => true, update: isAdminOrPublisher },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false, label: 'Show announcement pop-up' },
    { name: 'title', type: 'text', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'message', type: 'textarea', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'image', type: 'upload', relationTo: 'uploads', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'imageAlt', type: 'text', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'buttonLabel', type: 'text', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'buttonUrl', type: 'text', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'startsAt', type: 'date', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
    { name: 'endsAt', type: 'date', admin: { condition: (_, siblingData) => Boolean(siblingData?.enabled) } },
  ],
}
