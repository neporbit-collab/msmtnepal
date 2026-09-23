import Link from 'next/link'
import { navigation, site } from '@/lib/site'

export function Header() {
  return <>
    <div className="topline"><div className="container top-inner"><span>Health access, care and trust</span><div><a href={`tel:${site.phones[0].replaceAll(' ', '')}`}>{site.phones[0]}</a><span className="top-separator">·</span><a href={`mailto:${site.email}`}>{site.email}</a></div></div></div>
    <header className="site-header"><div className="container nav-wrap"><Link href="/" className="wordmark" aria-label={`${site.shortName} home`}><img src="/images/msmt-logo-whitebg.png" alt="" /><span><strong>MSMT Nepal</strong><small>HEALTH · ACCESS · TRUST</small></span></Link><nav aria-label="Main navigation">{navigation.map(item => <Link key={item.href} href={item.href} className={item.href === '/contact' ? 'nav-contact' : ''}>{item.label}</Link>)}</nav></div></header>
  </>
}

export function Footer() {
  return <footer className="footer"><div className="container footer-grid"><div><Link href="/" className="footer-brand"><img src="/images/msmt-logo-whitebg.png" alt="" /><span>MSMT Nepal</span></Link><p>Working to improve access to essential medicines and healthcare services in Nepal.</p></div><div><h2>Explore</h2><ul>{navigation.slice(1, 5).map(item => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul></div><div><h2>Contact</h2><address>{site.address}<br/><a href={`mailto:${site.email}`}>{site.email}</a><br/><a href={`tel:${site.phones[0].replaceAll(' ', '')}`}>{site.phones[0]}</a></address></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {site.shortName}</span><span>Information on this site is for general organizational purposes.</span></div></footer>
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-intro"><div className="container"><nav className="breadcrumbs" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">{eyebrow}</li></ol></nav><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro-copy">{description}</p></div></section>
}

export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p>{copy}</p>}</div>
}
