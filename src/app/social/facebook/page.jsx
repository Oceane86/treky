import Link from 'next/link'
import { circuits } from '../../../data/circuits'
import '../../../pages/Social.css'

export const metadata = {
  title: 'Treky sur Facebook',
  robots: { index: false, follow: false },
}

export default function FacebookPreviewPage() {
  const posts = [circuits[0], circuits[2], circuits[4]]

  return (
    <div className="fb-page">
      <header className="fb-topbar">
        <div className="fb-topbar__inner">
          <Link href="/" className="fb-topbar__logo">facebook</Link>
          <div className="fb-topbar__search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <span>Rechercher sur Facebook</span>
          </div>
          <div className="fb-topbar__icons">
            <span className="fb-topbar__icon fb-topbar__icon--active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/></svg>
            </span>
            <span className="fb-topbar__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
            <span className="fb-topbar__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </span>
            <span className="fb-topbar__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </span>
            <span className="fb-topbar__avatar"><img src="/logo.png" alt="Treky" /></span>
          </div>
        </div>
      </header>

      <div className="fb-cover">
        <img src="/images/hero-bg.jpg" alt="Couverture Treky" className="fb-cover__img" />
      </div>

      <div className="fb-header">
        <div className="fb-header__inner">
          <img src="/logo.png" alt="Treky" className="fb-header__avatar" />
          <div className="fb-header__identity">
            <h1 className="fb-header__name">Treky</h1>
            <p className="fb-header__meta">2 940 mentions J'aime · 3 102 abonnés</p>
          </div>
          <div className="fb-header__actions">
            <button type="button" className="fb-btn fb-btn--primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M2 21h4V9H2zm19-11.5A2.5 2.5 0 0 0 18.5 7H15l.5-4a2 2 0 0 0-2-2.24L9 11v10h10l3-9.5z"/></svg>
              J'aime
            </button>
            <button type="button" className="fb-btn fb-btn--secondary">＋ Suivre</button>
            <button type="button" className="fb-btn fb-btn--secondary">💬 Message</button>
            <button type="button" className="fb-btn fb-btn--icon">•••</button>
          </div>
        </div>

        <nav className="fb-tabs">
          <span className="fb-tabs__item fb-tabs__item--active">Publications</span>
          <span className="fb-tabs__item">À propos</span>
          <span className="fb-tabs__item">Avis</span>
          <span className="fb-tabs__item">Photos</span>
          <span className="fb-tabs__item">Plus ▾</span>
        </nav>
      </div>

      <div className="fb-body">
        <aside className="fb-about">
          <h3>À propos</h3>
          <ul>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Antananarivo 101, Madagascar
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" opacity="0"/><path d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
              contact@treky.mg
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +261 00 00 000 00
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              treky.mg
            </li>
          </ul>
        </aside>

        <div className="fb-feed">
          {posts.map((c, i) => (
            <div key={c.id} className="fb-post">
              <div className="fb-post__header">
                <img src="/logo.png" alt="Treky" />
                <div>
                  <strong>Treky</strong>
                  <span>{2 + i} h · 🌍</span>
                </div>
              </div>
              <p className="fb-post__text">{c.teaser}</p>
              <img src={c.image} alt={c.name} className="fb-post__img" />
              <div className="fb-post__stats">
                <span>👍❤️ {120 + i * 43}</span>
                <span>{8 + i * 5} commentaires · {3 + i} partages</span>
              </div>
              <div className="fb-post__actions">
                <span>👍 J'aime</span>
                <span>💬 Commenter</span>
                <span>↗ Partager</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
