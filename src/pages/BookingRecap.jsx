import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import './BookingRecap.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatAr(n) {
  return new Intl.NumberFormat('fr-MG').format(n) + ' Ar'
}

const METHOD_LABEL = { mvola: 'MVola', carte: 'Carte bancaire' }

export default function BookingRecap() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state) return <Navigate to="/circuits" replace />

  const b = state

  return (
    <div className="recap">

      {/* ── Hero succès ── */}
      <div className="recap__hero">
        <div className="recap__check-circle">✓</div>
        <h1 className="recap__hero-title">Paiement confirmé !</h1>
        <p className="recap__hero-sub">
          Votre réservation pour <strong>{b.circuit.name}</strong> est validée.
        </p>
      </div>

      <div className="container recap__body">
        <div className="recap__card">

          {/* Label "Complete" */}
          <div className="recap__complete-badge">
            <span className="recap__complete-dot" />
            Réservation complète
          </div>

          {/* Infos séjour */}
          <h2 className="recap__section-title">Votre séjour</h2>
          <div className="recap__grid">
            <div className="recap__item">
              <span className="recap__item-label">Circuit</span>
              <span className="recap__item-val">{b.circuit.name}</span>
            </div>
            <div className="recap__item">
              <span className="recap__item-label">Activité</span>
              <span className="recap__item-val">{b.activite}</span>
            </div>
            <div className="recap__item">
              <span className="recap__item-label">Départ</span>
              <span className="recap__item-val">{formatDate(b.checkin)}</span>
            </div>
            <div className="recap__item">
              <span className="recap__item-label">Retour</span>
              <span className="recap__item-val">{formatDate(b.checkout)}</span>
            </div>
            <div className="recap__item">
              <span className="recap__item-label">Voyageurs</span>
              <span className="recap__item-val">
                {b.nb_personnes} personne{b.nb_personnes > 1 ? 's' : ''}
              </span>
            </div>
            <div className="recap__item">
              <span className="recap__item-label">Paiement</span>
              <span className="recap__item-val">{METHOD_LABEL[b.payment_method] ?? 'MVola'}</span>
            </div>
          </div>

          {/* Détail prix */}
          <h2 className="recap__section-title">Détail du paiement</h2>
          <div className="recap__pricing">
            {b.code_promo && (
              <div className="recap__price-row">
                <span>Code promo <code className="recap__promo-code">{b.code_promo}</code></span>
                <span className="recap__discount">−{formatAr(b.remise)}</span>
              </div>
            )}
            <div className="recap__price-row">
              <span>Frais de service</span>
              <span>+{formatAr(b.frais_service)}</span>
            </div>
            <div className="recap__price-row recap__price-row--total">
              <span>Total payé</span>
              <span className="recap__total">{formatAr(b.prix_total)}</span>
            </div>
          </div>

          {/* Étape suivante */}
          <div className="recap__next-step">
            <div className="recap__next-icon">🧭</div>
            <div className="recap__next-text">
              <strong>Prochaine étape</strong>
              <p>Choisissez votre guide parmi nos experts disponibles aux dates sélectionnées.</p>
            </div>
          </div>

          <button
            className="btn-primary recap__cta"
            onClick={() => navigate('/reservation/guides', { state: b })}
          >
            Choisir mon guide →
          </button>

          <Link to={`/circuits/${b.circuit.slug}`} className="recap__back-link">
            ← Retour au circuit
          </Link>
        </div>
      </div>
    </div>
  )
}
