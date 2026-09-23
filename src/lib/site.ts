export const site = {
  name: 'Medical Services Management Trust Nepal (MSMT Nepal)',
  shortName: 'MSMT Nepal',
  description: 'MSMT Nepal works to improve access to essential medicines and healthcare services in Nepal.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://msmtnepal.com',
  address: 'Chakupat, Lalitpur-11, Nepal',
  phones: ['+977 9768533691', '+977 9768533692'],
  email: 'msmt.ngo.nepal@gmail.com',
  map: 'https://www.google.com/maps/place/MSMT+Nepal/@27.6820149,85.3259575,18.13z',
  mapEmbed: 'https://maps.google.com/maps?q=27.6820149,85.3259575&z=16&output=embed',
}

export const navigation = [
  { label: 'Home', href: '/' }, { label: 'About', href: '/about' },
  { label: 'Our Team', href: '/our-team' }, { label: 'Services', href: '/services' },
  { label: 'Media', href: '/media' }, { label: 'Contact Us', href: '/contact' },
]

export const services = [
  { title: 'Medicines and medical goods supply', status: 'Current service', text: 'Quality medicines and medical products supplied to hospitals, trusts, NGOs, community hospitals and other organizations providing direct patient care.', icon: '✚' },
  { title: 'Doorstep medicine delivery', status: 'Current service', text: 'Medicine support for people requiring lifelong medication, including health-history registration, specialist follow-up and home delivery at affordable cost.', icon: '⌁' },
  { title: 'Community health clinic', status: 'Current service', text: 'Clinic services at MSMT premises serving poor and vulnerable people at subsidized and affordable costs. Services include doctor consultations, laboratory tests, dressing, pharmacy and diagnostics.', icon: '⌂' },
  { title: 'Health camps', status: 'Current service', text: 'Annual general and specialized health camps delivered with local governments, healthcare providers and partner organizations.', icon: '＋' },
  { title: 'Humanitarian support', status: 'Current service', text: 'Medicine, medical supplies and food support during disasters and health emergencies, delivered with partners to help vulnerable communities.', icon: '♡' },
  { title: 'Professional training and development', status: 'Current service', text: 'Workshops, policy dialogues and professional development for healthcare providers and administrators, including hospital and pharmaceutical management and good dispensing practice.', icon: '↗' },
  { title: 'Retail pharmacy', status: 'Confirm arrangements', text: 'The brochure lists a retail pharmacy for individuals with prescriptions. Contact MSMT Nepal for current availability and access details.', icon: '＋' },
]

export const brochureMetrics = [
  { value: '20+', label: 'years of service' },
  { value: '50+', label: 'partner hospitals and community health clinics' },
  { value: '70+', label: 'districts reached' },
]
