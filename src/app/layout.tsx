import type { Metadata } from 'next'
import './globals.css'
import { Footer, Header } from '@/components/SiteChrome'
import { AnnouncementPopup } from '@/components/AnnouncementPopup'
import { getActiveAnnouncementPopup } from '@/lib/content'
import { site } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(site.url), title: { default: site.name, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: { type: 'website', siteName: site.name, title: site.name, description: site.description, url: site.url, locale: 'en_NP' },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const announcement = await getActiveAnnouncementPopup()
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/><AnnouncementPopup announcement={announcement}/></body></html>
}
