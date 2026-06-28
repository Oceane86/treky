'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCurrency } from '../context/CurrencyContext'
import { useFavorites } from '../context/FavoritesContext'
import { useAuth } from '../context/AuthContext'
import './CircuitCard.css'

const LEVEL_MAP = {
  'Facile':        { label: 'Explorateur curieux', cls: 'easy' },
  'Intermédiaire': { label: 'Aventurier confirmé', cls: 'medium' },
  'Modéré':        { label: 'Aventurier confirmé', cls: 'medium' },
  'Sportif':       { label: 'Marcheur engagé',     cls: 'hard' },
  'Engagé':        { label: 'Marcheur engagé',     cls: 'hard' },
}

export default function CircuitCard({ circuit }) {
  const { format } = useCurrency()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const [showGate, setShowGate] = useState(false)
  const fav = isFavorite(circuit.id)
  const level = LEVEL_MAP[circuit.level] ?? { label: circuit.level, cls: 'easy' }
  const minDays = circuit.minDays ?? circuit.recommendedDays
  const durationLabel = minDays < circuit.recommendedDays
    ? `${minDays}–${circuit.recommendedDays} jours`
    : `${circuit.recommendedDays} jours`

  return (
    <div className="circuit-card__wrap">
      <Link href={`/circuits/${circuit.slug}`} className="circuit-card circuit-card--link">
        <div className="circuit-card__image-wrap">
          <span className={`circuit-card__badge circuit-card__badge--${circuit.badge.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'-')}`}>{circuit.badge}</span>
          <img src={circuit.image} alt={circuit.name} className="circuit-card__image" />
          <button
            className={`circuit-card__fav${fav ? ' active' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              if (!isLoggedIn) { setShowGate(true); return }
              toggleFavorite(circuit.id)
            }}
            title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            {fav ? '♥' : '♡'}
          </button>
          <div className="circuit-card__image-overlay">
            <span className="circuit-card__overlay-btn">Voir le circuit →</span>
          </div>
        </div>

        <div className="circuit-card__body">
          <span className="circuit-card__region">📍 {circuit.region}</span>

          <h3 className="circuit-card__name">{circuit.name}</h3>

          <div className="circuit-card__tags">
            <span className={`circuit-card__level circuit-card__level--${level.cls}`}>
              {level.label}
            </span>
          </div>

          <p className="circuit-card__teaser">{circuit.teaser}</p>

          <div className="circuit-card__footer">
            <span className="circuit-card__duration">
              <span className="circuit-card__duration-pill">⏱ {durationLabel}</span>
            </span>
            <span className="circuit-card__price">{format(circuit.priceAr)}</span>
          </div>
        </div>
      </Link>

      {showGate && (
        <div className="cc-gate-overlay" onClick={(e) => e.target === e.currentTarget && setShowGate(false)}>
          <div className="cc-gate-card">
            <button className="cc-gate-close" onClick={() => setShowGate(false)}>✕</button>
            <div className="cc-gate-icon">🔒</div>
            <h3 className="cc-gate-title">Connexion requise</h3>
            <p className="cc-gate-text">Connectez-vous pour ajouter ce circuit à vos favoris.</p>
            <div className="cc-gate-hint">
              <span className="cc-gate-hint-label">Compte démo</span>
              <code>oceane@treky.mg</code>
              <code>treky2026</code>
            </div>
            <button
              className="btn-primary cc-gate-btn"
              onClick={() => router.push(`/connexion?return=/circuits/${circuit.slug}`)}
            >
              Se connecter
            </button>
            <Link href="/inscription" className="cc-gate-register" onClick={() => setShowGate(false)}>
              Pas encore inscrit ? Créer un compte
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
