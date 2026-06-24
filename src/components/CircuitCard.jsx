import { Link } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
import './CircuitCard.css'

const levelClass = {
  Difficile: 'difficile',
  Intermédiaire: 'intermediaire',
  Débutant: 'debutant',
}

export default function CircuitCard({ circuit }) {
  const { format } = useCurrency()

  return (
    <Link to={`/circuits/${circuit.slug}`} className="circuit-card circuit-card--link">
      <div className="circuit-card__image-wrap">
        <span className="circuit-card__badge">{circuit.badge}</span>
        <img src={circuit.image} alt={circuit.name} className="circuit-card__image" />
        <div className="circuit-card__image-overlay">
          <span className="circuit-card__overlay-btn">Voir le circuit →</span>
        </div>
      </div>

      <div className="circuit-card__body">
        <div className="circuit-card__meta">
          <span className="circuit-card__region">📍 {circuit.region}</span>
          <span className={`circuit-card__level circuit-card__level--${levelClass[circuit.level]}`}>
            {circuit.level}
          </span>
        </div>

        <h3 className="circuit-card__name">{circuit.name}</h3>
        <p className="circuit-card__teaser">{circuit.teaser}</p>

        <div className="circuit-card__footer">
          <span className="circuit-card__duration">⏱ {circuit.recommendedDays} jours</span>
          <span className="circuit-card__price">{format(circuit.priceAr)}</span>
        </div>
      </div>
    </Link>
  )
}
