'use client'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import '../../../pages/Page.css'
import './reservations.css'

const DEMO_RESERVATION = {
  id: 'TRK-2026-0042',
  circuit: 'Trek Découverte Isalo',
  slug: 'decouverte-isalo',
  image: '/images/isalo.jpg',
  dateDepart: '15 juillet 2026',
  duree: '4 jours',
  guides: 'Rakoto Jean',
  statut: 'Confirmée',
  prix: '2 000 000 Ar',
  paiement: 'MVola · Acompte versé',
}

export default function ReservationsPage() {
  const { isLoggedIn, user } = useAuth()

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="resa-gate">
          <div className="resa-gate__icon">🔒</div>
          <h2>Connexion requise</h2>
          <p>Connectez-vous pour voir vos réservations.</p>
          <Link href="/connexion" className="btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Mon compte · {user?.name}</p>
          <h1 className="page-hero__title">Mes réservations</h1>
          <p className="page-hero__subtitle">Retrouvez le détail et le statut de vos treks.</p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">

          <div className="resa-card">
            <img src={DEMO_RESERVATION.image} alt={DEMO_RESERVATION.circuit} className="resa-card__img" />
            <div className="resa-card__body">
              <div className="resa-card__top">
                <div>
                  <h2 className="resa-card__title">{DEMO_RESERVATION.circuit}</h2>
                  <p className="resa-card__id">Réf. {DEMO_RESERVATION.id}</p>
                </div>
                <span className={`resa-card__statut resa-card__statut--confirmed`}>
                  ✓ {DEMO_RESERVATION.statut}
                </span>
              </div>

              <div className="resa-card__details">
                <div className="resa-card__detail">
                  <span className="resa-card__detail-label">Départ</span>
                  <span className="resa-card__detail-val">{DEMO_RESERVATION.dateDepart}</span>
                </div>
                <div className="resa-card__detail">
                  <span className="resa-card__detail-label">Durée</span>
                  <span className="resa-card__detail-val">{DEMO_RESERVATION.duree}</span>
                </div>
                <div className="resa-card__detail">
                  <span className="resa-card__detail-label">Guide</span>
                  <span className="resa-card__detail-val">{DEMO_RESERVATION.guides}</span>
                </div>
                <div className="resa-card__detail">
                  <span className="resa-card__detail-label">Paiement</span>
                  <span className="resa-card__detail-val">{DEMO_RESERVATION.paiement}</span>
                </div>
                <div className="resa-card__detail">
                  <span className="resa-card__detail-label">Total</span>
                  <span className="resa-card__detail-val resa-card__detail-val--price">{DEMO_RESERVATION.prix}</span>
                </div>
              </div>

              <div className="resa-card__actions">
                <Link href={`/circuits/${DEMO_RESERVATION.slug}`} className="btn-secondary">
                  Voir le circuit
                </Link>
                <Link href="/chat/1" className="btn-primary">
                  💬 Contacter mon guide
                </Link>
              </div>
            </div>
          </div>

          <div className="resa-empty-hint">
            <p>Vous n'avez pas d'autre réservation en cours.</p>
            <Link href="/circuits" className="btn-secondary">Réserver un nouveau trek</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
