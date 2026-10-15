'use client'

import { useEffect, useRef, useState } from 'react'
import type { Notice } from '@/lib/notices'


function formatPublishedDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
    timeZone: 'Asia/Kathmandu',
  }).format(date)
}


export function NoticeList({ notices }: { notices: Notice[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null)


  useEffect(() => {
    if (!activeNotice || !dialogRef.current || dialogRef.current.open) {
      return
    }

    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'

    dialogRef.current.showModal()

    return () => {
      document.documentElement.style.overflow = previousOverflow
    }
  }, [activeNotice])


  return <>
    <div className="notice-list">
      {notices.map(notice => <button
        className="notice-card"
        key={notice.slug}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setActiveNotice(notice)}
      >
        <span className="notice-date"><time dateTime={notice.publishedAt}>{formatPublishedDate(notice.publishedAt)}</time></span>
        <span className="notice-card-content">
          <span className="notice-card-title">{notice.title}</span>
          {notice.titleNative && <span className="notice-card-native" lang="ne">{notice.titleNative}</span>}
          <span className="notice-card-summary">{notice.summary}</span>
          <span className="notice-card-action">View notice <span aria-hidden="true">↗</span></span>
        </span>
      </button>)}
    </div>

    <dialog
      className="notice-dialog"
      ref={dialogRef}
      aria-labelledby="notice-dialog-title"
      onClose={() => setActiveNotice(null)}
      onClick={event => {
        if (event.target === dialogRef.current) dialogRef.current.close()
      }}
    >
      {activeNotice && <div className="notice-dialog-content">
        <div className="notice-dialog-header">
          <div>
            <p className="eyebrow">Published {formatPublishedDate(activeNotice.publishedAt)}</p>
            <h2 id="notice-dialog-title">{activeNotice.title}</h2>
          </div>
          <button className="notice-dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close notice">×</button>
        </div>
        <img className="notice-poster" src={activeNotice.image} alt={activeNotice.imageAlt} />
      </div>}
    </dialog>
  </>
}
