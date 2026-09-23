import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/SiteChrome'
import { getPublicServices } from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Services', description: 'Explore MSMT Nepal’s medicine supply, doorstep medicine delivery, clinic, health camp, humanitarian and professional training services.', alternates: { canonical: '/services' }, openGraph: { title: 'Services | MSMT Nepal', description: 'Explore services from MSMT Nepal.', url: '/services', type: 'website' } }
export default async function ServicesPage(){const services=await getPublicServices();return <><PageIntro eyebrow="Services" title="Care and medicine access" description="From a dependable supply of medicines and medical goods to community clinic care, health camps, humanitarian response and professional training, MSMT Nepal supports health providers and communities across Nepal."/><section className="content-section"><div className="container"><div className="service-list">{services.map(item=><article className="service-row" key={item.slug||item.title}><div><h2>{item.title}</h2><p>{item.summary}</p></div><span className={`status ${item.status==='planned'?'status-planned':item.status!=='current'?'status-confirm':''}`}>{item.status==='current'?'Current service':item.status==='planned'?'Planned':'Availability to confirm'}</span></article>)}</div><div className="center-action"><Link href="/contact" className="button button-primary">Ask about a service</Link></div><p className="review-note">Clinic services are described in the MSMT Nepal Profile as beginning in 2026. Contact MSMT Nepal for current hours, eligibility and availability.</p></div></section></>}
