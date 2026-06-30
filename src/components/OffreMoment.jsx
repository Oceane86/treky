'use client'
import Link from 'next/link'
import { useCurrency } from '../context/CurrencyContext'
import './OffreMoment.css'

const SLUG = 'sainte-marie-pirates-baleines'
const PRICE_AR = 4_000_000

export default function OffreMoment() {
  const { format } = useCurrency()

  return (
    <section className="offre section-padding" id="offre">
      <div className="container">
        <div className="offre__header" data-reveal>
          <h2 className="section-title">Notre offre du moment</h2>
        </div>

        <div className="offre__card" data-reveal>
          <Link href={`/circuits/${SLUG}`} className="offre__image-wrap offre__image-link">
            <span className="badge badge-offer offre__badge">Offre spéciale</span>
            <img
              src="/images/sainte_marie.jpg"
              alt="Sainte-Marie : Pirates & Baleines"
              className="offre__image"
            />
          </Link>

          <div className="offre__content">
            <h3 className="offre__title">Sainte-Marie : Pirates &amp; Baleines</h3>
            <p className="offre__description">
              Découvrez l'île Sainte-Marie et son cimetière pirate unique au monde, puis partez en
              mer observer les baleines à bosse. Plages sauvages, villages de pêcheurs et forêts
              côtières font de ce circuit une escapade inoubliable.
            </p>
            <ul className="offre__details">
              <li>
                <span className="offre__detail-icon">📍</span>
                <span>Île Sainte-Marie, côte est de Madagascar</span>
              </li>
              <li>
                <span className="offre__detail-icon">⏱</span>
                <span>4 à 5 jours</span>
              </li>
              <li>
                <span className="offre__detail-icon">👥</span>
                <span>Groupe de 2 à 12 personnes</span>
              </li>
              <li>
                <span className="offre__detail-icon">⭐</span>
                <span>Niveau facile</span>
              </li>
            </ul>
            <div className="offre__price-row">
              <div className="offre__price">
                <span className="offre__price-label">À partir de</span>
                <span className="offre__price-amount">{format(PRICE_AR)}</span>
              </div>
              <Link href={`/circuits/${SLUG}`} className="btn-primary">Voir le circuit</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
