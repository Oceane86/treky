'use client'
import { useState } from 'react'
import './NewsletterSection.css'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="newsletter section-padding">
      <div className="container newsletter__inner">

        {/* ── Partie gauche : texte + formulaire ── */}
        <div className="newsletter__content">
          <p className="newsletter__eyebrow">Rejoignez-nous</p>
          <h2 className="newsletter__title">
            L'esprit de l'aventure,<br />directement dans votre boîte
          </h2>
          <p className="newsletter__subtitle">
            Inspirations de treks, conseils terrain, offres exclusives et récits de voyageurs
            — restez connectés à Madagascar.
          </p>

          {submitted ? (
            <div className="newsletter__success">
              ✓ Bienvenue dans la communauté Treky ! Vous recevrez bientôt nos meilleures aventures.
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="newsletter__input"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter__btn btn-primary">
                S'abonner
              </button>
            </form>
          )}

          <p className="newsletter__note">
            Pas de spam · Désinscription en 1 clic · Confidentialité respectée
          </p>

          <div className="newsletter__dots-left">
            <span className="newsletter__dot newsletter__dot--yellow" />
            <span className="newsletter__dot newsletter__dot--purple" />
          </div>
        </div>

        {/* ── Partie droite : grille de photos ── */}
        <div className="newsletter__visuals">
          <div className="newsletter__photo-grid">
            <div className="newsletter__photo newsletter__photo--top-left">
              <img src="/images/about3.jpg" alt="Trek Madagascar" />
            </div>
            <div className="newsletter__photo newsletter__photo--top-right">
              <img src="/images/hero-bg.jpg" alt="Paysage Madagascar" />
            </div>
            <div className="newsletter__photo newsletter__photo--bottom-left">
              <img src="/images/circuit2.jpg" alt="Nature Madagascar" />
            </div>
            <div className="newsletter__photo newsletter__photo--bottom-right">
              <img src="/images/isalo.jpg" alt="Trek Isalo" />
            </div>
          </div>

          {/* Nuages décoratifs */}
          <div className="newsletter__cloud newsletter__cloud--left" />
          <div className="newsletter__cloud newsletter__cloud--right" />

          {/* Points colorés */}
          <span className="newsletter__dot newsletter__dot--blue newsletter__dot--top-right" />
          <span className="newsletter__dot newsletter__dot--pink newsletter__dot--mid-right" />
          <span className="newsletter__dot newsletter__dot--yellow newsletter__dot--bottom-left" />
        </div>
      </div>
    </section>
  )
}
