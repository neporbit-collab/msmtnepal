import type { Metadata } from 'next'
import { PageIntro } from '@/components/SiteChrome'
import { NoticeList } from '@/components/NoticeList'
import { notices } from '@/lib/notices'

export const metadata: Metadata = {
  title: 'Notices',
  description: 'Read the latest notices and service announcements from MSMT Nepal.',
  alternates: { canonical: '/notices' },
  openGraph: {
    title: 'Notices | MSMT Nepal',
    description: 'Read the latest notices and service announcements from MSMT Nepal.',
    url: '/notices',
    type: 'website',
  },
}

export default function NoticesPage() {
  const latestFirst = [...notices].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return <>
    <PageIntro
      eyebrow="Notices"
      title="Notices and announcements"
      description="Service updates and announcements from Medical Services Management Trust Nepal, listed by publication date."
    />
    <section className="content-section">
      <div className="container">
        <NoticeList notices={latestFirst} />
      </div>
    </section>
  </>
}
