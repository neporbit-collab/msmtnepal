'use client'

import { FormEvent, useState } from 'react'

export function ContactForm(){
  const [state,setState]=useState<{kind:'success'|'error';message:string}|null>(null)
  const [busy,setBusy]=useState(false)
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setState(null);const form=event.currentTarget;const data=Object.fromEntries(new FormData(form).entries());try{const response=await fetch('/api/contact',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!response.ok)throw new Error(result.error||'We could not send your message. Please try again.');setState({kind:'success',message:result.message||'Thank you. Your inquiry has been sent to MSMT Nepal.'});form.reset()}catch(error){setState({kind:'error',message:error instanceof Error?error.message:'We could not send your message. Please try again.'})}finally{setBusy(false)}}
  return <div className="info-card"><h2>Send an inquiry</h2><p className="form-note">Please do not include medical records or sensitive health information. This form is not for urgent medical care.</p><form className="contact-form" onSubmit={submit}>
    <label>Name<input name="name" autoComplete="name" required maxLength={100}/></label>
    <label>Email<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    <label>Phone <span className="form-note">(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={30}/></label>
    <label>Subject<input name="subject" required maxLength={140}/></label>
    <label>Message<textarea name="message" required minLength={10} maxLength={4000}/></label>
    <label className="honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <button className="button button-primary" type="submit" disabled={busy}>{busy?'Sending…':'Send inquiry'}</button>
    {state&&<p className="form-state" role="status" aria-live="polite" data-error={state.kind==='error'}>{state.message}</p>}
  </form></div>
}
