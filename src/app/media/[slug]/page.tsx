import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { PageIntro } from '@/components/SiteChrome'
import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'

type Item = { title: string; slug: string; summary: string; category?: string; publishedAt?: string; credit?: string; body?: unknown }
async function getItem(slug: string): Promise<Item | null> {
  try {
    const payload = await getPayload({ config }); const result = await payload.find({ collection: 'media-items', where: { slug: { equals: slug } }, limit: 1, draft: false }); const doc=result.docs[0]
    if(!doc||typeof doc.title!=='string'||typeof doc.slug!=='string'||typeof doc.summary!=='string')return null
    return {title:doc.title,slug:doc.slug,summary:doc.summary,category:typeof doc.category==='string'?doc.category:undefined,publishedAt:typeof doc.publishedAt==='string'?doc.publishedAt:undefined,credit:typeof doc.credit==='string'?doc.credit:undefined,body:doc.body}
  }
  catch { return null }
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const {slug}=await params; const item=await getItem(slug)
  return item ? { title:item.title,description:item.summary,alternates:{canonical:`/media/${item.slug}`},openGraph:{title:item.title,description:item.summary,type:'article'} } : { title:'Media item' }
}
export default async function MediaItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug}=await params; const item=await getItem(slug); if(!item) notFound()
  return <><PageIntro eyebrow={item.category||'MSMT Media'} title={item.title} description={item.summary}/><section className="content-section"><article className="container content-copy"><p>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-NP',{dateStyle:'long'}) : ''}</p>{item.credit&&<p>Media credit: {item.credit}</p>}{typeof item.body==='object'&&item.body!==null?<RichText data={item.body as Parameters<typeof RichText>[0]['data']}/>:null}</article></section></>
}
