import { Link } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
import './OffreMoment.css'

const SLUG = 'canyons-couleurs'
const PRICE_AR = 850_000

export default function OffreMoment() {
  const { format } = useCurrency()

  return (
    <section className="offre section-padding" id="offre">
      <div className="container">
        <div className="offre__header" data-reveal>
          <h2 className="section-title">Notre offre du moment</h2>
        </div>

        <div className="offre__card" data-reveal>
          <Link to={`/circuits/${SLUG}`} className="offre__image-wrap offre__image-link">
            <span className="badge badge-offer offre__badge">Offre spéciale</span>
            <img
              src="/images/canyon-couleurs.jpg"
              alt="Trek Canyons & Couleurs"
              className="offre__image"
            />
          </Link>

          <div className="offre__content">
            <h3 className="offre__title">Trek "Canyons &amp; Couleurs"</h3>
            <p className="offre__description">
              Partez à la découverte des paysages époustouflants de l'Isalo et de ses formations
              rocheuses exceptionnelles. Une expérience immersive au cœur de la nature malgache,
              entre canyons de grès, piscines naturelles et savanes dorées.
            </p>
            <ul className="offre__details">
              <li>
                <span className="offre__detail-icon">📍</span>
                <span>Parc National de l'Isalo, Madagascar</span>
              </li>
              <li>
                <span className="offre__detail-icon">⏱</span>
                <span>7 jours / 6 nuits</span>
              </li>
              <li>
                <span className="offre__detail-icon">👥</span>
                <span>Groupe de 4 à 10 personnes</span>
              </li>
              <li>
                <span className="offre__detail-icon">⭐</span>
                <span>Niveau intermédiaire</span>
              </li>
            </ul>
            <div className="offre__price-row">
              <div className="offre__price">
                <span className="offre__price-label">À partir de</span>
                <span className="offre__price-amount">{format(PRICE_AR)}</span>
              </div>
              <Link to={`/circuits/${SLUG}`} className="btn-primary">Voir le circuit</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
