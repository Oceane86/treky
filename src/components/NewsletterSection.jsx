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

        <div className="newsletter__content">
          <h2 className="newsletter__title">
            S'inscrire à<br />notre<br />newsletter
          </h2>
          <p className="newsletter__subtitle">
            Inspirations de treks, conseils terrain, offres exclusives et récits de voyageurs
            — restez connectés à Madagascar.
          </p>

          {submitted ? (
            <div className="newsletter__success">
              Bienvenue dans la communauté Treky ! Vous recevrez bientôt nos meilleures aventures.
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <div className="newsletter__input-wrap">
                <input
                  type="email"
                  className="newsletter__input"
                  placeholder="Entrer votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter__btn" aria-label="S'abonner">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M3 9h12M10 4l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="newsletter__photos" aria-hidden="true">
          <div className="newsletter__grid">
            <div className="newsletter__col newsletter__col--a">
              <img className="newsletter__photo" src="/images/about1.jpg" alt="" />
              <img className="newsletter__photo" src="/images/canyon-couleurs.jpg" alt="" />
            </div>
            <div className="newsletter__col newsletter__col--b">
              <img className="newsletter__photo" src="/images/tsaratanana.jpg" alt="" />
              <img className="newsletter__photo" src="/images/isalo.jpg" alt="" />
            </div>
          </div>

          <span className="newsletter__dot dot--pink" />
          <span className="newsletter__dot dot--yellow" />
          <span className="newsletter__dot dot--teal" />
          <div className="newsletter__cloud" />
        </div>

      </div>
    </section>
  )
}
