import Image from 'next/image'
import Link from 'next/link'
import { circuits } from '../../../data/circuits'
import '../../../pages/Social.css'

export const metadata = {
  title: 'Treky sur Instagram',
  robots: { index: false, follow: false },
}

export default function InstagramPreviewPage() {
  const posts = circuits.slice(0, 9)

  return (
    <div className="ig-page">
      <header className="ig-topbar">
        <div className="ig-topbar__inner">
          <Link href="/" className="ig-topbar__logo">Instagram</Link>
          <div className="ig-topbar__search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <span>Rechercher</span>
          </div>
          <div className="ig-topbar__icons">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span className="ig-topbar__avatar"><img src="/logo.png" alt="Treky" /></span>
          </div>
        </div>
      </header>

      <main className="ig-main">
        <div className="ig-profile">
          <div className="ig-profile__avatar-wrap">
            <img src="/logo.png" alt="Treky" className="ig-profile__avatar" />
          </div>
          <div className="ig-profile__identity">
            <div className="ig-profile__handle-row">
              <h1 className="ig-profile__handle">treky.mg</h1>
              <button type="button" className="ig-btn ig-btn--primary">Suivre</button>
              <button type="button" className="ig-btn ig-btn--secondary">Message</button>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ig-profile__gear"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </div>

            <div className="ig-profile__stats">
              <span><strong>{posts.length}</strong> publications</span>
              <span><strong>4 218</strong> abonnés</span>
              <span><strong>186</strong> abonnements</span>
            </div>

            <div className="ig-profile__bio">
              <p className="ig-profile__name">Treky · Trek Madagascar</p>
              <p className="ig-profile__category">Agence de voyages</p>
              <p>
                🌿 Circuits de trekking avec guides locaux certifiés{'\n'}
                🏔️ Isalo · Tsingy · Andringitra · Makay{'\n'}
                👇 Composez votre trek sur-mesure
              </p>
              <Link href="/composer" className="ig-profile__link">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                treky.mg/composer
              </Link>
            </div>
          </div>
        </div>

        <div className="ig-tabs">
          <span className="ig-tabs__item ig-tabs__item--active">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            PUBLICATIONS
          </span>
          <span className="ig-tabs__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            RÉELS
          </span>
          <span className="ig-tabs__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>
            IDENTIFIÉ(E)
          </span>
        </div>

        <div className="ig-grid">
          {posts.map((c, i) => (
            <Link key={c.id} href={`/circuits/${c.slug}`} className="ig-grid__post">
              <Image src={c.image} alt={c.name} fill sizes="(max-width: 700px) 33vw, 300px" style={{ objectFit: 'cover' }} />
              <div className="ig-grid__overlay">
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 21s-6.7-4.35-9.3-8.1C1 10.1 1.7 6.6 4.6 5 7 3.7 9.8 4.6 12 7c2.2-2.4 5-3.3 7.4-2 2.9 1.6 3.6 5.1 1.9 7.9C18.7 16.65 12 21 12 21z"/></svg>
                  {340 + (i * 57) % 900}
                </span>
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  {12 + (i * 7) % 40}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
