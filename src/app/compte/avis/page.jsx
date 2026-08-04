'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import { readJSON, writeJSON } from '../../../utils/storage'
import '../../../pages/Page.css'
import '../../../pages/Avis.css'

const BOOKING_ID = 'TRK-2026-0042'
const CIRCUIT_NAME = 'Trek Découverte Isalo'
const CIRCUIT_SLUG = 'decouverte-isalo'
const GUIDE_ID = 1
const GUIDE_NAME = 'Rakoto Jean'

const REVIEWS_KEY = 'treky_reviews'
const circuitReviewsKey = (slug) => `treky_circuit_reviews_${slug}`

export default function AvisPage() {
  const { isLoggedIn, user } = useAuth()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [nps, setNps] = useState(null)
  const [transformation, setTransformation] = useState('')
  const [comment, setComment] = useState('')
  const [videoName, setVideoName] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="resa-gate">
          <div className="resa-gate__icon">🔒</div>
          <h2>Connexion requise</h2>
          <p>Connectez-vous pour laisser un avis.</p>
          <Link href="/connexion" className="btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  function handleVideo(e) {
    const file = e.target.files?.[0]
    if (file) setVideoName(file.name)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!rating || nps === null || !transformation.trim()) return

    const review = {
      _id: `rev_${Date.now()}`,
      booking_id: BOOKING_ID,
      guide_id: GUIDE_ID,
      guide_name: GUIDE_NAME,
      circuit_name: CIRCUIT_NAME,
      circuit_slug: CIRCUIT_SLUG,
      traveler_name: user?.name ?? 'Voyageur Treky',
      rating,
      nps_score: nps,
      transformation_note: transformation.trim(),
      comment: comment.trim(),
      video_url: videoName ? `local://${videoName}` : null,
      created_at: new Date().toISOString(),
    }

    writeJSON(REVIEWS_KEY, [review, ...readJSON(REVIEWS_KEY, [])])

    writeJSON(circuitReviewsKey(CIRCUIT_SLUG), [
      {
        id: review._id,
        name: review.traveler_name,
        avatar: user?.avatar ?? null,
        stars: rating,
        date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        text: comment.trim() || transformation.trim(),
        tag: 'Voyageur Treky',
      },
      ...readJSON(circuitReviewsKey(CIRCUIT_SLUG), []),
    ])

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="avis__success">
          <div className="avis__success-icon">✓</div>
          <h2>Merci pour votre avis !</h2>
          <p>Votre témoignage aide les prochains voyageurs à préparer leur trek — et il compte aussi pour {GUIDE_NAME}.</p>
          <div className="avis__success-actions">
            <Link href={`/circuits/${CIRCUIT_SLUG}`} className="btn-secondary">Voir le circuit</Link>
            <Link href="/compte/reservations" className="btn-primary">Retour à mes réservations</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Mon compte · {user?.name}</p>
          <h1 className="page-hero__title">Votre avis compte</h1>
          <p className="page-hero__subtitle">{CIRCUIT_NAME} avec {GUIDE_NAME}</p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <form className="avis__form" onSubmit={handleSubmit}>

            <div className="avis__block">
              <label className="avis__label">Note globale</label>
              <div className="avis__stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`avis__star ${(hoverRating || rating) >= n ? 'avis__star--active' : ''}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  >★</button>
                ))}
              </div>
            </div>

            <div className="avis__block">
              <label className="avis__label">
                Recommanderiez-vous Treky à un proche ?{' '}
                <span className="avis__nps-hint">(0 = pas du tout, 10 = certainement)</span>
              </label>
              <div className="avis__nps-row">
                {Array.from({ length: 11 }, (_, n) => (
                  <button
                    key={n}
                    type="button"
                    className={`avis__nps-btn ${nps === n ? 'avis__nps-btn--active' : ''}`}
                    onClick={() => setNps(n)}
                  >{n}</button>
                ))}
              </div>
            </div>

            <div className="avis__block avis__block--highlight">
              <label className="avis__label avis__label--big">En quoi ce trek vous a-t-il changé ?</label>
              <p className="avis__label-hint">
                Pas juste « c'était bien » — qu'est-ce qui a vraiment bougé en vous pendant ces jours sur le terrain ?
                Relisez votre <Link href="/compte/carnet">carnet de trek</Link> si besoin d'inspiration.
              </p>
              <textarea
                className="avis__textarea"
                rows={5}
                placeholder="Racontez la transformation, un déclic, une prise de conscience…"
                value={transformation}
                onChange={(e) => setTransformation(e.target.value)}
                required
              />
            </div>

            <div className="avis__block">
              <label className="avis__label">Un commentaire libre <span className="avis__optional">(optionnel)</span></label>
              <textarea
                className="avis__textarea"
                rows={3}
                placeholder="Organisation, guide, hébergement…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="avis__block">
              <label className="avis__label">Témoignage vidéo <span className="avis__optional">(optionnel)</span></label>
              <label className="avis__video-btn">
                🎥 {videoName ? videoName : 'Ajouter une vidéo'}
                <input type="file" accept="video/*" onChange={handleVideo} hidden />
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary avis__submit"
              disabled={!rating || nps === null || !transformation.trim()}
            >
              Publier mon avis
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
