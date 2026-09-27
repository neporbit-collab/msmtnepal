export type Notice = {
  slug: string
  title: string
  titleNative?: string
  summary: string
  publishedAt: string
  image: string
  imageAlt: string
}

export const notices: Notice[] = [
  {
    slug: 'doorstep-medicine-delivery-service',
    title: 'Doorstep medicine delivery service',
    titleNative: 'घरदैलो औषधि वितरण सेवा',
    summary: 'Learn about MSMT Nepal’s medicine delivery service and its seven-step process, from registration and prescription review to delivery and payment.',
    publishedAt: '2026-09-27',
    image: '/images/notices/pop.jpeg',
    imageAlt: 'Nepali-language infographic describing MSMT Nepal’s doorstep medicine delivery service and its seven steps.',
  },
]
