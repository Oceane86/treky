'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getCircuitBySlug } from '../../../data/circuits'
import { adaptItinerary, adaptPrice } from '../../../utils/adaptItinerary'
import { useCurrency } from '../../../context/CurrencyContext'
import { useAuth } from '../../../context/AuthContext'
import { useFavorites } from '../../../context/FavoritesContext'
import BookingModal from '../../../components/BookingModal'
import '../../../pages/CircuitDetail.css'

const CircuitMap = dynamic(() => import('../../../components/CircuitMap'), { ssr: false })

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

const CLIMAT_MAP = {
  seche:        ['avoid','avoid','avoid','ok','ideal','ideal','ideal','ideal','ideal','ideal','ok','avoid'],
  'toute-saison':['ok','ok','ideal','ideal','ideal','ideal','ideal','ideal','ideal','ideal','ideal','ok'],
  baleines:     ['ok','ok','ideal','ideal','ideal','ideal','ideal','ideal','ideal','ideal','ideal','ok'],
}

const CLIMAT_ICON = { ideal: '☀️', ok: '⛅', avoid: '🌧️' }
const CLIMAT_LABEL = { ideal: 'Idéal', ok: 'Correct', avoid: 'Déconseillé' }

const SAMPLE_REVIEWS = [
  { id: 1, name: 'Jean Dupont',   avatar: '/images/avatar1.jpg', stars: 5, date: 'Mars 2026',    text: 'Une expérience absolument inoubliable. Le guide était exceptionnel, les paysages à couper le souffle.', tag: 'Randonneur passionné' },
  { id: 2, name: 'Marie Martin',  avatar: '/images/avatar2.jpg', stars: 5, date: 'Février 2026', text: 'Voyage en solo et je me suis sentie en sécurité à chaque instant. Organisation irréprochable.', tag: 'Voyageuse solo' },
  { id: 3, name: 'Thomas Bernard',avatar: '/images/avatar3.jpg', stars: 4, date: 'Janvier 2026', text: 'Superbes photos ramenées, la nature est époustouflante. Petite déception sur les lodges mais rien de grave.', tag: 'Photographe nature' },
]

const RATING_BARS = [
  { stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },  { stars: 1, pct: 1 },
]

function infoIcon(text) {
  const t = text.toLowerCase()
  if (t.includes('chaussure') || t.includes('équipement') || t.includes('materiel')) return '🥾'
  if (t.includes('saison') || t.includes('période') || t.includes('recommandée')) return '📅'
  if (t.includes('physique') || t.includes('condition') || t.includes('expérience')) return '💪'
  if (t.includes('solaire') || t.includes('chapeau') || t.includes('soleil')) return '☀️'
  if (t.includes('groupe') || t.includes('personnes') || t.includes('limité')) return '👥'
  if (t.includes('accessible') || t.includes('famille')) return '✅'
  if (t.includes('eau') || t.includes('hydratation')) return '💧'
  return 'ℹ️'
}

function getClimatKey(circuit) {
  if (circuit.slug === 'sainte-marie-pirates-baleines') return 'baleines'
  return circuit.saison || 'seche'
}

export default function CircuitDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const circuit = getCircuitBySlug(slug)
  const { format } = useCurrency()
  const { isLoggedIn } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [selectedDays, setSelectedDays] = useState(5)
  const [descExpanded, setDescExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('jour')
  const [openStep, setOpenStep] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [showLoginGate, setShowLoginGate] = useState(false)
  const [toast, setToast] = useState(null)
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS)
  const [reviewStars, setReviewStars] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)

  useEffect(() => {
    if (circuit) setSelectedDays(circuit.recommendedDays)
  }, [circuit])

  if (!circuit) notFound()

  const itinerary = adaptItinerary(circuit.steps, selectedDays)
  const price = adaptPrice(circuit.priceAr, circuit.recommendedDays, selectedDays)
  const priceAr = Math.round(circuit.priceAr * selectedDays / circuit.recommendedDays)
  const isCondensed = selectedDays < circuit.recommendedDays
  const isExtended  = selectedDays > circuit.recommendedDays
  const isAdapted   = isCondensed || isExtended
  const photos = circuit.photos?.length >= 1 ? circuit.photos : [circuit.image]

  const fav = isFavorite(circuit.id)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleReserve() {
    if (isLoggedIn) {
      setShowBooking(true)
    } else {
      setShowLoginGate(true)
    }
  }

  function handleFav() {
    if (!isLoggedIn) { setShowLoginGate(true); return }
    toggleFavorite(circuit.id)
    showToast(fav ? 'Retiré des favoris' : 'Ajouté aux favoris ♥')
  }

  function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: circuit.name, text: circuit.teaser, url })
    } else {
      navigator.clipboard.writeText(url).then(() => showToast('Lien copié dans le presse-papier'))
    }
  }

  function handleCompare() {
    showToast('Comparateur bientôt disponible')
  }

  function handleReviewSubmit(e) {
    e.preventDefault()
    if (!reviewStars || !reviewName.trim() || !reviewText.trim()) return
    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      avatar: null,
      stars: reviewStars,
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      text: reviewText.trim(),
      tag: 'Voyageur Treky',
    }
    setReviews((prev) => [newReview, ...prev])
    setReviewStars(0)
    setReviewName('')
    setReviewText('')
    setReviewSuccess(true)
    setTimeout(() => setReviewSuccess(false), 4000)
  }

  const stars = Math.round(circuit.rating)

  return (
    <div className="cd">

      {/* ── SECTION 1 · EN-TÊTE ── */}
      <div className="cd__header-wrap">
        <div className="container cd__header">
          <Link href="/circuits" className="cd__back">← Tous les circuits</Link>
          <div className="cd__header-row">
            <div className="cd__header-info">
              <h1 className="cd__title">{circuit.name}</h1>
              <div className="cd__meta-row">
                <span className="cd__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                <span className="cd__rating-val">{circuit.rating}</span>
                <span className="cd__reviews">({circuit.reviews} avis)</span>
                <span className="cd__safe-badge">✓ Solo Sécurisé</span>
              </div>
            </div>
            <div className="cd__actions">
              <button className={`cd__action-btn${fav ? ' cd__action-btn--active' : ''}`} onClick={handleFav} title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                <span>{fav ? '♥' : '♡'}</span>
                <small>Favoris</small>
              </button>
              <button className="cd__action-btn" onClick={handleShare} title="Partager">
                <span>⤴</span>
                <small>Partager</small>
              </button>
              <button className="cd__action-btn" onClick={handleCompare} title="Comparer">
                <span>⊞</span>
                <small>Comparer</small>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 · GALERIE ── */}
      <div className="container cd__gallery">
        <div className="cd__gallery-main">
          <img src={photos[0]} alt={circuit.name} className="cd__gallery-big" />
          <button className="cd__gallery-all-btn">📷 Voir tout</button>
        </div>
        <div className="cd__gallery-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="cd__gallery-thumb">
              <img src={photos[i % photos.length]} alt={`${circuit.name} photo ${i + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYOUT 2 COLONNES ── */}
      <div className="container cd__layout">

        {/* ── COLONNE GAUCHE ── */}
        <div className="cd__main">

          <section className="cd__section">
            <h2 className="cd__section-title">Présentation</h2>
            <div className={`cd__desc-wrap${descExpanded ? '' : ' cd__desc-wrap--clamped'}`}>
              <p className="cd__desc">{circuit.description}</p>
            </div>
            <button className="cd__expand-btn" onClick={() => setDescExpanded((v) => !v)}>
              {descExpanded ? 'Réduire ▲' : 'En savoir plus ▼'}
            </button>
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">Inclus dans le trek</h2>
            <div className="cd__inc-grid">
              <ul className="cd__inc-list">
                <li className="cd__inc-header">Inclus</li>
                {circuit.included.map((item) => (
                  <li key={item}><span className="cd__check">✓</span>{item}</li>
                ))}
              </ul>
              <ul className="cd__exc-list">
                <li className="cd__exc-header">Non inclus</li>
                {circuit.non_inclus.map((item) => (
                  <li key={item}><span className="cd__cross">✗</span>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">Plan du trek</h2>
            <div className="cd__tabs">
              <button
                className={`cd__tab${activeTab === 'jour' ? ' cd__tab--active' : ''}`}
                onClick={() => setActiveTab('jour')}
              >
                Jour par jour
              </button>
              <button
                className={`cd__tab${activeTab === 'depart' ? ' cd__tab--active' : ''}`}
                onClick={() => setActiveTab('depart')}
              >
                Dates de départ
              </button>
            </div>

            {activeTab === 'jour' ? (
              <div className="cd__accordion">
                {itinerary.map((step, idx) => (
                  <div
                    key={idx}
                    className={`cd__accordion-item${openStep === idx ? ' cd__accordion-item--open' : ''}`}
                  >
                    <button
                      className={`cd__accordion-trigger${step.extra ? ' cd__accordion-trigger--libre' : ''}`}
                      onClick={() => setOpenStep(openStep === idx ? null : idx)}
                    >
                      <span className={`cd__day-badge${step.extra ? ' cd__day-badge--libre' : ''}`}>J{step.day}</span>
                      <div className="cd__step-meta">
                        <span className="cd__step-title-text">{step.title}</span>
                        {step.extra && <span className="cd__step-libre-tag">Journée libre</span>}
                      </div>
                      <span className="cd__accordion-chevron">{openStep === idx ? '▲' : '▼'}</span>
                    </button>
                    <div className="cd__accordion-body">
                      <p>{step.description}</p>

                      {step.lodge && (
                        <div className="cd__step-lodge">
                          <span className="cd__step-lodge-icon">
                            {step.typeHebergement === 'Bivouac' ? '⛺' : step.typeHebergement === 'Bungalow' ? '🏝' : step.typeHebergement === "Chez l'habitant" ? '🏡' : '🏨'}
                          </span>
                          <div>
                            <span className="cd__step-lodge-name">{step.lodge}</span>
                            <span className="cd__step-lodge-type">{step.typeHebergement}</span>
                          </div>
                        </div>
                      )}

                      {step.activities?.length > 0 && (
                        <ul className="cd__step-activities">
                          {step.activities.map((act, ai) => (
                            <li key={ai} className="cd__step-activity">
                              <span className="cd__step-activity-dot" />
                              {act}
                            </li>
                          ))}
                        </ul>
                      )}

                      {circuit.waypoints?.[idx] && !step.extra && (
                        <div className="cd__step-coords">
                          <span>🗺️</span>
                          <span>Point {idx + 1} sur le tracé</span>
                          {idx === 0 && <span className="cd__step-badge cd__step-badge--start">Départ</span>}
                          {idx === itinerary.length - 1 && <span className="cd__step-badge cd__step-badge--end">Arrivée</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cd__depart-block">
                <p>
                  Les dates de départ sont disponibles sur demande. Contactez-nous pour
                  connaître les prochains départs groupés ou organiser un départ privé.
                </p>
                <Link href="/contact" className="btn-primary cd__depart-btn">
                  Demander les dates de départ
                </Link>
              </div>
            )}

            {circuit.waypoints?.length > 0 && (
              <div className="cd__plan-map">
                <div className="cd__plan-map-header">
                  <span className="cd__plan-map-title">Tracé du circuit</span>
                  <div className="cd__plan-map-legend">
                    <span className="cd__legend-item cd__legend-item--start">① Départ</span>
                    <span className="cd__legend-item cd__legend-item--end">② Arrivée</span>
                    <span className="cd__legend-item cd__legend-item--route">— Tracé</span>
                  </div>
                </div>
                <CircuitMap waypoints={circuit.waypoints} circuitName={circuit.name} />
                <p className="cd__plan-map-hint">
                  Cliquez sur un point pour voir le détail de l'étape · Molette pour zoomer
                </p>
              </div>
            )}
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">Infos pratiques</h2>
            <div className="cd__infos-grid">
              {circuit.infos_pratiques.map((info, i) => (
                <div key={i} className="cd__info-item">
                  <span className="cd__info-icon">{infoIcon(info)}</span>
                  <span className="cd__info-text">{info}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CLIMAT & MÉTÉO ── */}
          <section className="cd__section">
            <h2 className="cd__section-title">Climat & Météo</h2>
            <div className="cd__climat-grid">
              {MONTHS.map((m, i) => {
                const key = getClimatKey(circuit)
                const cond = (CLIMAT_MAP[key] || CLIMAT_MAP.seche)[i]
                return (
                  <div key={m} className="cd__climat-month">
                    <span className="cd__climat-month-label">{m}</span>
                    <div className={`cd__climat-bar cd__climat-bar--${cond}`} title={CLIMAT_LABEL[cond]}>
                      {CLIMAT_ICON[cond]}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="cd__climat-legend">
              {['ideal', 'ok', 'avoid'].map((c) => (
                <div key={c} className="cd__climat-legend-item">
                  <span className={`cd__climat-legend-dot cd__climat-legend-dot--${c}`} />
                  {CLIMAT_LABEL[c]}
                </div>
              ))}
            </div>
            {circuit.saison === 'seche' && (
              <p className="cd__climat-note">
                📅 Meilleure période : <strong>avril à novembre</strong> (saison sèche). Décembre à mars correspond à la saison des pluies — les sentiers peuvent être glissants et certains accès fermés.
              </p>
            )}
            {circuit.saison === 'toute-saison' && (
              <p className="cd__climat-note">
                📅 Ce circuit est praticable toute l'année. Évitez de préférence <strong>janvier et février</strong> (fortes pluies sur les hautes terres).
              </p>
            )}
            {circuit.slug === 'sainte-marie-pirates-baleines' && (
              <p className="cd__climat-note">
                🐋 L'observation des baleines à bosse est possible de <strong>juillet à septembre</strong>. En dehors de cette période, toutes les autres activités restent accessibles dans d'excellentes conditions.
              </p>
            )}
          </section>

          {/* ── AVIS VOYAGEURS ── */}
          <section className="cd__section">
            <h2 className="cd__section-title">Avis voyageurs</h2>

            <div className="cd__reviews-summary">
              <div className="cd__reviews-score">
                <span className="cd__reviews-score-val">{circuit.rating}</span>
                <span className="cd__reviews-score-stars">
                  {'★'.repeat(Math.round(circuit.rating))}{'☆'.repeat(5 - Math.round(circuit.rating))}
                </span>
                <span className="cd__reviews-score-count">{circuit.reviews + reviews.length - SAMPLE_REVIEWS.length} avis</span>
              </div>
              <div className="cd__reviews-bars">
                {RATING_BARS.map(({ stars, pct }) => (
                  <div key={stars} className="cd__reviews-bar-row">
                    <span className="cd__reviews-bar-label">{stars}★</span>
                    <div className="cd__reviews-bar-track">
                      <div className="cd__reviews-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="cd__reviews-bar-count">{Math.round(circuit.reviews * pct / 100)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cd__reviews-list">
              {reviews.map((r) => (
                <div key={r.id} className="cd__review-card">
                  <div className="cd__review-header">
                    <div className="cd__review-author">
                      {r.avatar
                        ? <img src={r.avatar} alt={r.name} className="cd__review-avatar" />
                        : <div className="cd__review-avatar-placeholder">{r.name[0]}</div>
                      }
                      <div>
                        <div className="cd__review-name">{r.name}</div>
                        <div className="cd__review-date">{r.date}</div>
                      </div>
                    </div>
                    <span className="cd__review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  </div>
                  <p className="cd__review-text">{r.text}</p>
                  {r.tag && <span className="cd__review-tag">{r.tag}</span>}
                </div>
              ))}
            </div>

            <form className="cd__review-form" onSubmit={handleReviewSubmit}>
              <h3 className="cd__review-form-title">Laisser un avis</h3>

              <div className="cd__review-form-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`cd__star-btn${(reviewHover || reviewStars) >= n ? ' cd__star-btn--active' : ''}`}
                    onClick={() => setReviewStars(n)}
                    onMouseEnter={() => setReviewHover(n)}
                    onMouseLeave={() => setReviewHover(0)}
                    aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="cd__review-form-grid">
                <div className="cd__review-form-field">
                  <label>Votre nom</label>
                  <input
                    type="text"
                    placeholder="Ex. Marie M."
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                  />
                </div>
                <div className="cd__review-form-field">
                  <label>Circuit effectué</label>
                  <input type="text" value={circuit.name} readOnly style={{ opacity: 0.6 }} />
                </div>
                <div className="cd__review-form-field cd__review-form-field--full">
                  <label>Votre avis</label>
                  <textarea
                    rows={4}
                    placeholder="Partagez votre expérience avec les futurs voyageurs…"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary cd__review-form-submit"
                disabled={!reviewStars || !reviewName.trim() || !reviewText.trim()}
              >
                Publier mon avis
              </button>

              {reviewSuccess && (
                <div className="cd__review-success">
                  ✓ Merci ! Votre avis a été publié.
                </div>
              )}
            </form>
          </section>
        </div>

        {/* ── COLONNE DROITE · WIDGET RÉSERVATION ── */}
        <aside className="cd__sidebar">
          <div className="cd__book-card">
            <div className="cd__book-price-block">
              <span className="cd__book-price-label">
                {isCondensed ? 'Prix condensé' : isExtended ? 'Prix étendu' : 'À partir de'}
              </span>
              <span className="cd__book-price-value">{format(price)}</span>
              {circuit.prix_reduit && (
                <span className="cd__book-price-original">au lieu de {format(circuit.prix_original)}</span>
              )}
            </div>

            <div className="cd__book-metas">
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Niveau</span>
                <span className="cd__book-meta-val">{circuit.level}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Groupe</span>
                <span className="cd__book-meta-val">{circuit.groupSize}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Note</span>
                <span className="cd__book-meta-val">★ {circuit.rating} · {circuit.reviews} avis</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Région</span>
                <span className="cd__book-meta-val">{circuit.region}</span>
              </div>
            </div>

            <div className="cd__slider-block">
              <div className="cd__slider-header">
                <span className="cd__slider-label">Durée souhaitée</span>
                <div className="cd__slider-val">
                  <strong>{selectedDays} jour{selectedDays > 1 ? 's' : ''}</strong>
                  {isCondensed && <span className="cd__adapted-tag--condensed">Condensé</span>}
                  {isExtended  && <span className="cd__adapted-tag--extended">Étendu</span>}
                  {!isAdapted  && <span className="cd__adapted-tag--reco">Recommandé</span>}
                </div>
              </div>
              <input
                type="range"
                min={circuit.minDays}
                max={circuit.maxDays ?? circuit.recommendedDays}
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="cd__slider"
              />
              <div className="cd__slider-limits">
                <span>{circuit.minDays} j min.</span>
                <span>{circuit.recommendedDays} j reco.</span>
                <span>{circuit.maxDays ?? circuit.recommendedDays} j max.</span>
              </div>
              {isCondensed && <p className="cd__adapt-notice">Itinéraire condensé sur les étapes essentielles.</p>}
              {isExtended  && <p className="cd__adapt-notice cd__adapt-notice--extended">Journées libres ajoutées pour explorer à votre rythme.</p>}
            </div>

            <button className="btn-primary cd__book-btn" onClick={handleReserve}>
              Réserver ce trek
            </button>
            <p className="cd__book-note">Paiement MVola accepté · Annulation flexible</p>
          </div>
        </aside>
      </div>

      {showBooking && (
        <BookingModal
          circuit={circuit}
          selectedDays={selectedDays}
          priceAr={priceAr}
          onClose={() => setShowBooking(false)}
        />
      )}

      {showLoginGate && (
        <div className="cd__gate-overlay" onClick={(e) => e.target === e.currentTarget && setShowLoginGate(false)}>
          <div className="cd__gate-card">
            <button className="cd__gate-close" onClick={() => setShowLoginGate(false)}>✕</button>
            <div className="cd__gate-icon">🔒</div>
            <h3 className="cd__gate-title">Connexion requise</h3>
            <p className="cd__gate-text">
              Pour réserver ce trek, vous devez être connecté à votre compte Treky.
            </p>
            <div className="cd__gate-hint">
              <span className="cd__gate-hint-label">Compte démo</span>
              <code>oceane@treky.mg</code>
              <code>treky2026</code>
            </div>
            <button
              className="btn-primary cd__gate-btn"
              onClick={() => router.push(`/connexion?return=/circuits/${circuit.slug}`)}
            >
              Se connecter
            </button>
            <Link href="/inscription" className="cd__gate-register">
              Pas encore inscrit ? Créer un compte
            </Link>
          </div>
        </div>
      )}

      {toast && (
        <div className="cd__toast">{toast}</div>
      )}
    </div>
  )
}
