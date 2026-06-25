'use client'
import Link from 'next/link'
import { useCurrency } from '../context/CurrencyContext'
import { useFavorites } from '../context/FavoritesContext'
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
  const fav = isFavorite(circuit.id)
  const level = LEVEL_MAP[circuit.level] ?? { label: circuit.level, cls: 'easy' }
  const minDays = circuit.minDays ?? circuit.recommendedDays
  const durationLabel = minDays < circuit.recommendedDays
    ? `${minDays}–${circuit.recommendedDays} jours`
    : `${circuit.recommendedDays} jours`

  return (
    <Link href={`/circuits/${circuit.slug}`} className="circuit-card circuit-card--link">
      <div className="circuit-card__image-wrap">
        <span className="circuit-card__badge">{circuit.badge}</span>
        <img src={circuit.image} alt={circuit.name} className="circuit-card__image" />
        <button
          className={`circuit-card__fav${fav ? ' active' : ''}`}
          onClick={(e) => { e.preventDefault(); toggleFavorite(circuit.id) }}
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
        <div className="circuit-card__meta">
          <span className="circuit-card__region">📍 {circuit.region}</span>
          <span className={`circuit-card__level circuit-card__level--${level.cls}`}>
            {level.label}
          </span>
        </div>

        <h3 className="circuit-card__name">{circuit.name}</h3>

        {circuit.thematique && (
          <span className={`circuit-card__theme circuit-card__theme--${circuit.thematique}`}>
            {circuit.thematique === 'aventure' && '⛰ Aventure'}
            {circuit.thematique === 'nature' && '🌿 Nature'}
            {circuit.thematique === 'culture' && '🏛 Culture'}
          </span>
        )}

        <p className="circuit-card__teaser">{circuit.teaser}</p>

        <div className="circuit-card__footer">
          <span className="circuit-card__duration">
            <span className="circuit-card__duration-pill">⏱ {durationLabel}</span>
          </span>
          <span className="circuit-card__price">{format(circuit.priceAr)}</span>
        </div>
      </div>
    </Link>
  )
}
