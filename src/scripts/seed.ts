import { getPayload } from 'payload'
import config from '@payload-config'
import seed from '../../content/seed.json'

const payload = await getPayload({ config })
for (const service of seed.services) {
  const existing = await payload.find({ collection: 'services', where: { slug: { equals: service.slug } }, limit: 1, overrideAccess: true })
  if (existing.totalDocs === 0) await payload.create({ collection: 'services', data: { ...service, _status: 'draft' }, overrideAccess: true })
}
const pages = [
  ['Home', 'home'], ['About', 'about'], ['Our Team', 'our-team'], ['Services', 'services'], ['Media', 'media'], ['Contact Us', 'contact'],
]
for (const [title, slug] of pages) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, overrideAccess: true })
  if (existing.totalDocs === 0) await payload.create({ collection: 'pages', data: { title, slug, description: 'Review and complete this page before publishing.', _status: 'draft' }, overrideAccess: true })
}
const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
if (!settings.metricsForReview?.length) {
  await payload.updateGlobal({ slug: 'site-settings', overrideAccess: true, data: {
    metricsForReview: seed.metricsForReview,
    qualityClaimsForReview: seed.qualityClaimsForReview.map(claim => ({ claim, status: 'needs-review' })),
    claimsReviewNote: 'Verify each figure, standards reference, scope and measurement date before publishing.',
    mapLink: seed.contact.map,
    address: seed.contact.address,
    email: seed.contact.email,
    phones: seed.contact.phones.map(phone => ({ phone })),
  } })
}
console.log('Seeded editable draft pages and services. Review claims before publishing.')
process.exit(0)
