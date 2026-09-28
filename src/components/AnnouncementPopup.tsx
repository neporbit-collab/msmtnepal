'use client'

import { useEffect, useRef } from 'react'
import type { PublicAnnouncementPopup } from '@/lib/content'

export function AnnouncementPopup({ announcement }: { announcement: PublicAnnouncementPopup | null }) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!announcement || !dialogRef.current) return
    try {
      if (window.sessionStorage.getItem('msmt-announcement-dismissed')) return
      window.sessionStorage.setItem('msmt-announcement-dismissed', 'true')
    } catch {
      // Continue to show the announcement if browser storage is unavailable.
    }
    dialogRef.current.showModal()
  }, [announcement])

  if (!announcement) return null
  return <dialog className="announcement-dialog" ref={dialogRef}
    aria-labelledby={announcement.title ? 'announcement-popup-title' : undefined}
    aria-label={announcement.title ? undefined : 'MSMT Nepal announcement'}
    onClick={event => {
      if (event.target === dialogRef.current) dialogRef.current?.close()
    }}>
    <div className="announcement-popup-content">
      <button className="announcement-popup-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close announcement">×</button>
      {announcement.imageUrl && <img src={announcement.imageUrl} alt={announcement.imageAlt || ''} />}
      <div className="announcement-popup-copy">
        {announcement.title && <h2 id="announcement-popup-title">{announcement.title}</h2>}
        {announcement.message && <p>{announcement.message}</p>}
        {announcement.buttonLabel && announcement.buttonUrl && <a className="button button-primary" href={announcement.buttonUrl}>{announcement.buttonLabel}</a>}
      </div>
    </div>
  </dialog>
}
