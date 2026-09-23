import type { GlobalConfig } from 'payload'
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings', access: { read: () => true, update: ({ req }) => Boolean(req.user) },
  fields: [
    { name: 'organizationName', type: 'text', defaultValue: 'Medical Services Management Trust Nepal (MSMT Nepal)' },
    { name: 'address', type: 'text', defaultValue: 'Chakupat, Lalitpur-11, Nepal' },
    { name: 'phones', type: 'array', fields: [{ name: 'phone', type: 'text', required: true }] },
    { name: 'email', type: 'email', defaultValue: 'msmt.ngo.nepal@gmail.com' }, { name: 'mapLink', type: 'text' },
    { name: 'socialLinks', type: 'array', fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text' }] },
    { name: 'metricsForReview', type: 'array', fields: [{ name: 'value', type: 'text', required: true }, { name: 'label', type: 'text', required: true }, { name: 'verification', type: 'text' }] },
    { name: 'qualityClaimsForReview', type: 'array', fields: [{ name: 'claim', type: 'text', required: true }, { name: 'status', type: 'select', defaultValue: 'needs-review', options: [{ label: 'Needs review', value: 'needs-review' }, { label: 'Approved', value: 'approved' }] }] },
    { name: 'claimsReviewNote', type: 'text', admin: { description: 'Review organization figures and claims before publication.' } },
  ],
}
