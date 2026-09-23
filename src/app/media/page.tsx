import type { Metadata } from 'next'
import { PageIntro } from '@/components/SiteChrome'
import Link from 'next/link'
import { getPublicMedia } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Media', description: 'News, stories, reports and resources from Medical Services Management Trust Nepal.', alternates: { canonical: '/media' }, openGraph: { title: 'Media | MSMT Nepal', description: 'News, stories, reports and resources from Medical Services Management Trust Nepal.', url: '/media', type: 'website' } }
export default async function MediaPage(){const items=await getPublicMedia();return <><PageIntro eyebrow="Media" title="Stories, updates and resources" description="Find news, stories, reports, photographs and videos from MSMT Nepal."/><section className="content-section"><div className="container">{items.length?<div className="media-grid">{items.map(item=><article className="media-card" key={item.slug}><div className="media-visual" aria-hidden="true">{item.category==='report'?'▤':'✳'}</div><p className="media-kicker">{item.category}</p><h2><Link href={`/media/${item.slug}`}>{item.title}</Link></h2><p>{item.summary}</p>{item.publishedAt&&<p className="form-note">{new Date(item.publishedAt).toLocaleDateString('en-NP',{dateStyle:'long'})}</p>}</article>)}</div>:<div className="media-empty"><h2>Media library coming soon</h2><p>Approved stories and resources will be published here with individual pages and shareable links.</p></div>}</div></section></>}
