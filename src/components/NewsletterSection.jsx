'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import './NewsletterSection.css'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { locale } = useLocale()
  const t = getUI(locale).home

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
            {t.newsletterTitle1}<br />{t.newsletterTitle2}<br />{t.newsletterTitle3}
          </h2>
          <p className="newsletter__subtitle">{t.newsletterSubtitle}</p>

          {submitted ? (
            <div className="newsletter__success">{t.newsletterSuccess}</div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <div className="newsletter__input-wrap">
                <input
                  type="email"
                  className="newsletter__input"
                  placeholder={t.newsletterPlaceholder}
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
              <div className="newsletter__photo">
                <Image src="/images/about1.jpg" alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="newsletter__photo">
                <Image src="/images/canyon-couleurs.jpg" alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
              </div>
            </div>
            <div className="newsletter__col newsletter__col--b">
              <div className="newsletter__photo">
                <Image src="/images/tsaratanana.jpg" alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="newsletter__photo">
                <Image src="/images/isalo.jpg" alt="" fill sizes="25vw" style={{ objectFit: 'cover' }} />
              </div>
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
