import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

export const runtime = 'nodejs'
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.email().max(254),phone:z.string().trim().max(30).optional().default(''),subject:z.string().trim().min(3).max(140),message:z.string().trim().min(10).max(4000),website:z.string().optional().default('')})
const attempts=new Map<string,{count:number;reset:number}>()

export async function POST(request:Request){
  const contentLength=Number(request.headers.get('content-length')||0)
  if(contentLength>12000)return NextResponse.json({error:'This message is too large. Please shorten it and try again.'},{status:413})
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'
  const now=Date.now();const record=attempts.get(ip)
  if(record&&record.reset>now&&record.count>=5)return NextResponse.json({error:'Please wait a little before sending another inquiry.'},{status:429})
  try{
    let body: unknown
    try { body=await request.json() } catch { return NextResponse.json({error:'Please check the form and try again.'},{status:400}) }
    const parsed=schema.safeParse(body)
    if(!parsed.success)return NextResponse.json({error:'Please check the required fields and try again.'},{status:400})
    if(parsed.data.website)return NextResponse.json({ok:true})
    attempts.set(ip,record&&record.reset>now?{count:record.count+1,reset:record.reset}:{count:1,reset:now+15*60*1000})
    const payload=await getPayload({config})
    const { website: _website, ...inquiryData } = parsed.data
    const inquiry=await payload.create({collection:'contact-inquiries',data:{...inquiryData,status:'new'},overrideAccess:true})
    const {SMTP_HOST,SMTP_PORT,SMTP_SECURE,SMTP_USER,SMTP_PASSWORD,SMTP_FROM,CONTACT_TO}=process.env
    if(SMTP_HOST&&SMTP_FROM&&CONTACT_TO){
      try {
        const transport=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:SMTP_SECURE==='true',auth:SMTP_USER?{user:SMTP_USER,pass:SMTP_PASSWORD}:undefined})
        await transport.sendMail({from:SMTP_FROM,to:CONTACT_TO,replyTo:parsed.data.email,subject:`Website inquiry: ${parsed.data.subject}`,text:`Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nPhone: ${parsed.data.phone||'Not provided'}\n\n${parsed.data.message}`})
        return NextResponse.json({ok:true,id:inquiry.id})
      } catch(error) { console.error('Inquiry was saved but its email notification failed',error);return NextResponse.json({ok:true,warning:true,message:'Your inquiry was saved, but the email notification could not be delivered. Please also email MSMT Nepal directly.'},{status:202}) }
    }
    return NextResponse.json({ok:true,warning:true,message:'Your inquiry was saved. Email notifications are not configured yet; please also email MSMT Nepal directly.'},{status:202})
  }catch(error){console.error('Contact inquiry could not be saved or emailed',error);return NextResponse.json({error:'We could not send your inquiry just now. Please try again later.'},{status:500})}
}
