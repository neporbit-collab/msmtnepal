import type { Metadata } from 'next'
import './globals.css'
import { Footer, Header } from '@/components/SiteChrome'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url), title: { default: site.name, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: { type: 'website', siteName: site.name, title: site.name, description: site.description, url: site.url, locale: 'en_NP' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>
}
