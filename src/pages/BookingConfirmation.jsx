import { Link, useLocation } from 'react-router-dom'
import './BookingConfirmation.css'

const MOCK_BOOKING = {
  circuit: { name: "Trek Découverte Isalo", slug: 'decouverte-isalo' },
  guide: { id: 1, nom: 'Rakoto Jean', photo: '/images/avatar1.jpg', note: 4.9 },
  checkin: '2026-08-10',
  checkout: '2026-08-15',
  nb_personnes: 2,
  activite: 'Trek complet – 5 jours',
  code_promo: 'TREKY10',
  remise: 65_000,
  frais_service: 25_000,
  prix_total: 1_260_000,
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatAr(amount) {
  return new Intl.NumberFormat('fr-MG').format(amount) + ' Ar'
}

export default function BookingConfirmation() {
  const { state } = useLocation()
  const booking = state ?? MOCK_BOOKING

  return (
    <div className="booking-confirm">
      <div className="booking-confirm__hero">
        <div className="booking-confirm__emoji">🎉</div>
        <h1 className="booking-confirm__title">Merci !</h1>
        <p className="booking-confirm__subtitle">Votre réservation a bien été enregistrée</p>
      </div>

      <div className="container booking-confirm__body">
        <div className="booking-confirm__card">
          <h2 className="booking-confirm__circuit-name">{booking.circuit.name}</h2>

          <div className="booking-confirm__guide">
            <img
              src={booking.guide.photo}
              alt={booking.guide.nom}
              className="booking-confirm__guide-avatar"
            />
            <div className="booking-confirm__guide-info">
              <span className="booking-confirm__guide-name">{booking.guide.nom}</span>
              <span className="booking-confirm__guide-meta">Votre guide</span>
            </div>
            <div className="booking-confirm__guide-rating">
              <span className="booking-confirm__guide-star">★</span>
              <span className="booking-confirm__guide-note">{booking.guide.note}</span>
            </div>
          </div>

          <div className="booking-confirm__recap">
            <h3 className="booking-confirm__section-title">Récapitulatif du séjour</h3>
            <div className="booking-confirm__recap-grid">
              <div className="booking-confirm__recap-item">
                <span className="booking-confirm__recap-label">Check-in</span>
                <span className="booking-confirm__recap-value">{formatDate(booking.checkin)}</span>
              </div>
              <div className="booking-confirm__recap-item">
                <span className="booking-confirm__recap-label">Check-out</span>
                <span className="booking-confirm__recap-value">{formatDate(booking.checkout)}</span>
              </div>
              <div className="booking-confirm__recap-item">
                <span className="booking-confirm__recap-label">Personnes</span>
                <span className="booking-confirm__recap-value">
                  {booking.nb_personnes} voyageur{booking.nb_personnes > 1 ? 's' : ''}
                </span>
              </div>
              <div className="booking-confirm__recap-item">
                <span className="booking-confirm__recap-label">Activité</span>
                <span className="booking-confirm__recap-value">{booking.activite}</span>
              </div>
            </div>
          </div>

          <div className="booking-confirm__pricing">
            <h3 className="booking-confirm__section-title">Détail du prix</h3>
            <div className="booking-confirm__price-rows">
              {booking.code_promo && (
                <div className="booking-confirm__price-row">
                  <span>
                    Code promo
                    <code className="booking-confirm__promo-code">{booking.code_promo}</code>
                  </span>
                  <span className="booking-confirm__price-discount">
                    −{formatAr(booking.remise)}
                  </span>
                </div>
              )}
              <div className="booking-confirm__price-row">
                <span>Frais de service</span>
                <span>+{formatAr(booking.frais_service)}</span>
              </div>
              <div className="booking-confirm__price-row booking-confirm__price-row--total">
                <span>Total</span>
                <span className="booking-confirm__price-total">{formatAr(booking.prix_total)}</span>
              </div>
            </div>
          </div>

          <div className="booking-confirm__actions">
            <Link to={`/circuits/${booking.circuit.slug}`} className="btn-secondary booking-confirm__btn">
              Votre séjour
            </Link>
            <Link
              to={`/chat/${booking.guide?.id ?? 1}`}
              state={booking}
              className="btn-primary booking-confirm__btn"
            >
              Discutez avec votre guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
