'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import { readJSON } from '../../../utils/storage'
import Icon from '../../../components/Icon'
import '../../../pages/Page.css'
import './reservations.css'

const DEMO_RESERVATION = {
  id: 'TRK-2026-0042',
  circuit: 'Trek Découverte Isalo',
  slug: 'decouverte-isalo',
  image: '/images/isalo.webp',
  dateDepart: '15 juillet 2026',
  duree: '4 jours',
  guideNom: 'Rakoto Jean',
  guideId: 1,
  statut: 'Confirmée',
  prix: '2 000 000 Ar',
  paiement: 'MVola · Acompte versé',
}

export default function ReservationsPage() {
  const { isLoggedIn, user } = useAuth()
  const [reservations, setReservations] = useState([DEMO_RESERVATION])

  useEffect(() => {
    const stored = readJSON('treky_reservations', [])
    setReservations([...stored, DEMO_RESERVATION])
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="resa-gate">
          <div className="resa-gate__icon"><Icon name="lock" size={40} /></div>
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

          {reservations.map((r) => (
            <div key={r.id} className="resa-card">
              <div className="resa-card__img">
                <Image src={r.image} alt={r.circuit} fill sizes="(max-width: 700px) 100vw, 240px" style={{ objectFit: 'cover' }} />
              </div>
              <div className="resa-card__body">
                <div className="resa-card__top">
                  <div>
                    <h2 className="resa-card__title">{r.circuit}</h2>
                    <p className="resa-card__id">Réf. {r.id}</p>
                  </div>
                  <span className="resa-card__statut resa-card__statut--confirmed">
                    ✓ {r.statut}
                  </span>
                </div>

                <div className="resa-card__details">
                  <div className="resa-card__detail">
                    <span className="resa-card__detail-label">Départ</span>
                    <span className="resa-card__detail-val">{r.dateDepart}</span>
                  </div>
                  <div className="resa-card__detail">
                    <span className="resa-card__detail-label">Durée</span>
                    <span className="resa-card__detail-val">{r.duree}</span>
                  </div>
                  <div className="resa-card__detail">
                    <span className="resa-card__detail-label">Guide</span>
                    <span className="resa-card__detail-val">{r.guideNom}</span>
                  </div>
                  <div className="resa-card__detail">
                    <span className="resa-card__detail-label">Paiement</span>
                    <span className="resa-card__detail-val">{r.paiement}</span>
                  </div>
                  <div className="resa-card__detail">
                    <span className="resa-card__detail-label">Total</span>
                    <span className="resa-card__detail-val resa-card__detail-val--price">{r.prix}</span>
                  </div>
                </div>

                <div className="resa-card__actions">
                  <Link href={`/circuits/${r.slug}`} className="btn-secondary">
                    Voir le circuit
                  </Link>
                  <Link href={`/chat/${r.guideId}`} className="btn-primary">
                    <Icon name="chat" size={16} /> Contacter mon guide
                  </Link>
                  <Link href={`/compte/carnet?id=${r.id}`} className="btn-secondary">
                    <Icon name="journal" size={16} /> Mon carnet de trek
                  </Link>
                  <Link href="/compte/avis" className="btn-secondary">
                    <Icon name="star" size={16} /> Laisser un avis
                  </Link>
                </div>
              </div>
            </div>
          ))}

          <div className="resa-empty-hint">
            <p>Envie d'une nouvelle aventure ?</p>
            <Link href="/circuits" className="btn-secondary">Réserver un nouveau trek</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
