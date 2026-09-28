import type { Metadata } from 'next'
import { PageIntro } from '@/components/SiteChrome'
import { NoticeList } from '@/components/NoticeList'
import { getPublicNotices } from '@/lib/content'

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

export const dynamic = 'force-dynamic'

export default async function NoticesPage() {
  const latestFirst = await getPublicNotices()

  return <>
    <PageIntro
      eyebrow="Notices"
      title="Notices and announcements"
      description="Service updates and announcements from Medical Services Management Trust Nepal, listed by publication date."
    />
    <section className="content-section">
      <div className="container">
        {latestFirst.length ? <NoticeList notices={latestFirst} /> : <div className="media-empty"><h2>No current notices</h2><p>Please check back for updates from MSMT Nepal.</p></div>}
      </div>
    </section>
  </>
}
