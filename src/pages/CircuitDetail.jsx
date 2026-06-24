import { useState, useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getCircuitBySlug } from '../data/circuits'
import { adaptItinerary, adaptPrice } from '../utils/adaptItinerary'
import { useCurrency } from '../context/CurrencyContext'
import './CircuitDetail.css'

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

export default function CircuitDetail() {
  const { slug } = useParams()
  const circuit = getCircuitBySlug(slug)
  const { format } = useCurrency()
  const [selectedDays, setSelectedDays] = useState(5)
  const [descExpanded, setDescExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('jour')
  const [openStep, setOpenStep] = useState(null)

  useEffect(() => {
    if (circuit) setSelectedDays(circuit.recommendedDays)
  }, [circuit])

  if (!circuit) return <Navigate to="/circuits" replace />

  const itinerary = adaptItinerary(circuit.steps, selectedDays)
  const price = adaptPrice(circuit.priceAr, circuit.recommendedDays, selectedDays)
  const isAdapted = selectedDays < circuit.recommendedDays
  const contactUrl = `/checkout/confirmer?circuit=${circuit.slug}&days=${selectedDays}`
  const photos = circuit.photos?.length >= 1 ? circuit.photos : [circuit.image]

  const stars = Math.round(circuit.rating)

  return (
    <div className="cd">

      {/* ── SECTION 1 · EN-TÊTE ── */}
      <div className="cd__header-wrap">
        <div className="container cd__header">
          <Link to="/circuits" className="cd__back">← Tous les circuits</Link>
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
              <button className="cd__action-btn" title="Ajouter aux favoris">
                <span>♡</span>
                <small>Favoris</small>
              </button>
              <button className="cd__action-btn" title="Partager">
                <span>⤴</span>
                <small>Partager</small>
              </button>
              <button className="cd__action-btn" title="Comparer">
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
              <img
                src={photos[i % photos.length]}
                alt={`${circuit.name} photo ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYOUT 2 COLONNES ── */}
      <div className="container cd__layout">

        {/* ── COLONNE GAUCHE ── */}
        <div className="cd__main">

          {/* SECTION 3 · PRÉSENTATION */}
          <section className="cd__section">
            <h2 className="cd__section-title">Présentation</h2>
            <div className={`cd__desc-wrap${descExpanded ? '' : ' cd__desc-wrap--clamped'}`}>
              <p className="cd__desc">{circuit.description}</p>
            </div>
            <button
              className="cd__expand-btn"
              onClick={() => setDescExpanded((v) => !v)}
            >
              {descExpanded ? 'Réduire ▲' : 'En savoir plus ▼'}
            </button>
          </section>

          {/* SECTION 4 · INCLUS / NON INCLUS */}
          <section className="cd__section">
            <h2 className="cd__section-title">Inclus dans le trek</h2>
            <div className="cd__inc-grid">
              <ul className="cd__inc-list">
                <li className="cd__inc-header">Inclus</li>
                {circuit.included.map((item) => (
                  <li key={item}>
                    <span className="cd__check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <ul className="cd__exc-list">
                <li className="cd__exc-header">Non inclus</li>
                {circuit.non_inclus.map((item) => (
                  <li key={item}>
                    <span className="cd__cross">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 5 · PLAN DU TREK */}
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
                      className="cd__accordion-trigger"
                      onClick={() => setOpenStep(openStep === idx ? null : idx)}
                    >
                      <span className="cd__day-badge">J{step.day}</span>
                      <span className="cd__step-title-text">{step.title}</span>
                      <span className="cd__accordion-chevron">
                        {openStep === idx ? '▲' : '▼'}
                      </span>
                    </button>
                    <div className="cd__accordion-body">
                      <p>{step.description}</p>
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
                <Link to={contactUrl} className="btn-primary cd__depart-btn">
                  Demander les dates de départ
                </Link>
              </div>
            )}
          </section>

          {/* SECTION 6 · INFOS PRATIQUES */}
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

        </div>

        {/* ── COLONNE DROITE · WIDGET RÉSERVATION ── */}
        <aside className="cd__sidebar">
          <div className="cd__book-card">

            <div className="cd__book-price-block">
              <span className="cd__book-price-label">
                {isAdapted ? 'Prix adapté' : 'À partir de'}
              </span>
              <span className="cd__book-price-value">{format(price)}</span>
              {circuit.prix_reduit && (
                <span className="cd__book-price-original">
                  au lieu de {format(circuit.prix_original)}
                </span>
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
                  {isAdapted && <span className="cd__adapted-tag">Adapté</span>}
                </div>
              </div>
              <input
                type="range"
                min={circuit.minDays}
                max={circuit.recommendedDays}
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="cd__slider"
              />
              <div className="cd__slider-limits">
                <span>{circuit.minDays} j min.</span>
                <span>{circuit.recommendedDays} j recommandé</span>
              </div>
              {isAdapted && (
                <p className="cd__adapt-notice">
                  Itinéraire condensé sur les étapes essentielles.
                </p>
              )}
            </div>

            <Link to={contactUrl} className="btn-primary cd__book-btn">
              Réserver ce trek
            </Link>
            <p className="cd__book-note">Paiement MVola accepté · Annulation flexible</p>
          </div>
        </aside>

      </div>
    </div>
  )
}
