'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCircuitBySlug } from '../../data/circuits'
import '../../pages/Page.css'
import '../../pages/Contact.css'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const circuitSlug = searchParams.get('circuit')
  const days = searchParams.get('days')
  const circuit = circuitSlug ? getCircuitBySlug(circuitSlug) : null

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: circuit
      ? `Je souhaite réserver le trek "${circuit.name}" pour ${days ?? circuit.recommendedDays} jours.`
      : '',
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom requis.'
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail invalide.'
    if (!form.message.trim()) e.message = 'Message requis.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
  }

  if (sent) {
    return (
      <div className="page contact-success">
        <div className="contact-success__box">
          <div className="contact-success__icon">✓</div>
          <h2>Message envoyé !</h2>
          <p>Nous vous répondrons sous 24 à 48 h ouvrées.</p>
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Nous écrire</p>
          <h1 className="page-hero__title">Contact</h1>
          <p className="page-hero__subtitle">
            Une question, une réservation ? Notre équipe vous répond rapidement.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container contact-layout">
          <div className="contact-info">
            <div className="page-card">
              <h2>Coordonnées</h2>
              <ul className="contact-info__list">
                <li>
                  <span>✉</span>
                  <a href="mailto:contact@treky.mg">contact@treky.mg</a>
                </li>
                <li>
                  <span>☎</span>
                  <a href="tel:+261000000000">+261 00 00 000 00</a>
                </li>
                <li>
                  <span>⌖</span>
                  <span>Antananarivo, Madagascar</span>
                </li>
              </ul>
              <div className="contact-info__mvola">
                <p>Paiement mobile accepté</p>
                <img src="/images/mvola.png" alt="MVola" />
              </div>
            </div>

            {circuit && (
              <div className="contact-info__booking page-card">
                <h2>Réservation en cours</h2>
                <p><strong>{circuit.name}</strong></p>
                <p>{days ?? circuit.recommendedDays} jours · {circuit.level}</p>
                <Link href={`/circuits/${circuit.slug}`} className="contact-info__edit">
                  Modifier le circuit
                </Link>
              </div>
            )}
          </div>

          <form className="contact-form page-card" onSubmit={handleSubmit} noValidate>
            <h2>Envoyer un message</h2>

            <div className="contact-form__field">
              <label htmlFor="name">Nom complet</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Votre nom"
              />
              {errors.name && <span className="contact-form__error">{errors.name}</span>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="votre@email.com"
              />
              {errors.email && <span className="contact-form__error">{errors.email}</span>}
            </div>

            <div className="contact-form__field">
              <label htmlFor="phone">Téléphone (optionnel)</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+261 ..."
              />
            </div>

            <div className="contact-form__field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                className={errors.message ? 'error' : ''}
                placeholder="Décrivez votre projet de trek..."
              />
              {errors.message && <span className="contact-form__error">{errors.message}</span>}
            </div>

            <button type="submit" className="btn-primary contact-form__submit">
              Envoyer
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
