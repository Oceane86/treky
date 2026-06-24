import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './BookingModal.css'

const PROMO_CODE = 'TREKY10'
const PROMO_REMISE = 65_000
const FRAIS_SERVICE = 25_000

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatAr(n) {
  return new Intl.NumberFormat('fr-MG').format(n) + ' Ar'
}

function StepIndicator({ current }) {
  const steps = ['Dates', 'Voyageurs', 'Paiement']
  return (
    <div className="bm__steps">
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <div key={label} className="bm__step-item">
            <div className={`bm__step-circle ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
              {done ? '✓' : num}
            </div>
            <span className={`bm__step-label ${active ? 'active' : ''}`}>{label}</span>
            {i < steps.length - 1 && <div className={`bm__step-line ${done ? 'done' : ''}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default function BookingModal({ circuit, selectedDays, priceAr, onClose }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const today = new Date().toISOString().split('T')[0]
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [nbPersonnes, setNbPersonnes] = useState(1)
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('mvola')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [paying, setPaying] = useState(false)

  const prixBase = priceAr * nbPersonnes
  const remise = promoApplied ? PROMO_REMISE : 0
  const total = prixBase - remise + FRAIS_SERVICE
  const checkout = date ? addDays(date, selectedDays) : ''

  function handleDateNext() {
    if (!date) { setDateError('Choisissez une date de départ.'); return }
    setDateError('')
    setStep(2)
  }

  function applyPromo() {
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Code promo invalide.')
    }
  }

  const bookingState = {
    circuit: { name: circuit.name, slug: circuit.slug },
    checkin: date,
    checkout,
    nb_personnes: nbPersonnes,
    activite: `${circuit.name} – ${selectedDays} jours`,
    code_promo: promoApplied ? PROMO_CODE : null,
    remise,
    frais_service: FRAIS_SERVICE,
    prix_total: total,
    payment_method: paymentMethod,
    guide_ids: circuit.guideIds ?? [1, 2],
  }

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      navigate('/reservation/recap', { state: bookingState })
    }, 2200)
  }

  return (
    <div className="bm__overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bm__card">

        <button className="bm__close" onClick={onClose} aria-label="Fermer">✕</button>

        <div className="bm__header">
          <h2 className="bm__title">Réserver ce trek</h2>
          <p className="bm__circuit-name">{circuit.name}</p>
        </div>

        <StepIndicator current={step} />

        {/* ── ÉTAPE 1 : DATES ── */}
        {step === 1 && (
          <div className="bm__step-body">
            <h3 className="bm__step-title">Choisissez vos dates</h3>

            <div className="bm__field">
              <label className="bm__label">Date de départ</label>
              <input
                type="date"
                className={`bm__input ${dateError ? 'bm__input--error' : ''}`}
                value={date}
                min={today}
                onChange={(e) => { setDate(e.target.value); setDateError('') }}
              />
              {dateError && <p className="bm__error">{dateError}</p>}
            </div>

            <div className="bm__duration-row">
              <div className="bm__duration-item">
                <span className="bm__duration-label">Durée</span>
                <span className="bm__duration-val">{selectedDays} jours</span>
              </div>
              <div className="bm__duration-item">
                <span className="bm__duration-label">Date de retour</span>
                <span className="bm__duration-val">
                  {checkout ? formatDate(checkout) : '—'}
                </span>
              </div>
            </div>

            <div className="bm__info-box">
              <span>📍</span>
              <span>{circuit.location}</span>
            </div>

            <button className="btn-primary bm__next-btn" onClick={handleDateNext}>
              Continuer →
            </button>
          </div>
        )}

        {/* ── ÉTAPE 2 : VOYAGEURS ── */}
        {step === 2 && (
          <div className="bm__step-body">
            <h3 className="bm__step-title">Informations voyageurs</h3>

            <div className="bm__field">
              <label className="bm__label">Nombre de personnes</label>
              <div className="bm__counter">
                <button
                  className="bm__counter-btn"
                  onClick={() => setNbPersonnes((n) => Math.max(1, n - 1))}
                  disabled={nbPersonnes <= 1}
                >−</button>
                <span className="bm__counter-val">{nbPersonnes}</span>
                <button
                  className="bm__counter-btn"
                  onClick={() => setNbPersonnes((n) => Math.min(8, n + 1))}
                  disabled={nbPersonnes >= 8}
                >+</button>
              </div>
              <p className="bm__field-hint">Groupe : {circuit.groupSize}</p>
            </div>

            <div className="bm__field">
              <label className="bm__label">Code promo <span className="bm__optional">(optionnel)</span></label>
              <div className="bm__promo-row">
                <input
                  type="text"
                  className={`bm__input bm__input--promo ${promoError ? 'bm__input--error' : ''} ${promoApplied ? 'bm__input--success' : ''}`}
                  placeholder="ex. TREKY10"
                  value={promoInput}
                  onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError('') }}
                  disabled={promoApplied}
                />
                <button
                  className={`bm__promo-btn ${promoApplied ? 'bm__promo-btn--applied' : ''}`}
                  onClick={applyPromo}
                  disabled={promoApplied || !promoInput}
                >
                  {promoApplied ? '✓' : 'Appliquer'}
                </button>
              </div>
              {promoError && <p className="bm__error">{promoError}</p>}
              {promoApplied && (
                <p className="bm__promo-success">Code appliqué — {formatAr(PROMO_REMISE)} de remise !</p>
              )}
            </div>

            <div className="bm__price-preview">
              <div className="bm__price-row">
                <span>{formatAr(priceAr)} × {nbPersonnes} personne{nbPersonnes > 1 ? 's' : ''}</span>
                <span>{formatAr(prixBase)}</span>
              </div>
              {promoApplied && (
                <div className="bm__price-row bm__price-row--discount">
                  <span>Code TREKY10</span>
                  <span>−{formatAr(PROMO_REMISE)}</span>
                </div>
              )}
              <div className="bm__price-row">
                <span>Frais de service</span>
                <span>+{formatAr(FRAIS_SERVICE)}</span>
              </div>
              <div className="bm__price-row bm__price-row--total">
                <span>Total</span>
                <span>{formatAr(total)}</span>
              </div>
            </div>

            <div className="bm__btn-row">
              <button className="bm__back-btn" onClick={() => setStep(1)}>← Retour</button>
              <button className="btn-primary bm__next-btn bm__next-btn--flex" onClick={() => setStep(3)}>
                Passer au paiement →
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 : PAIEMENT MVOLA ── */}
        {step === 3 && (
          <div className="bm__step-body">
            {paying ? (
              <div className="bm__paying">
                <div className="bm__paying-spinner" />
                <p className="bm__paying-text">
                  {paymentMethod === 'mvola' ? 'Traitement du paiement MVola…' : 'Vérification de votre carte…'}
                </p>
              </div>
            ) : (
              <>
                <h3 className="bm__step-title">Paiement</h3>

                <div className="bm__recap-box">
                  <div className="bm__recap-row">
                    <span>Circuit</span>
                    <span>{circuit.name}</span>
                  </div>
                  <div className="bm__recap-row">
                    <span>Départ</span>
                    <span>{formatDate(date)}</span>
                  </div>
                  <div className="bm__recap-row">
                    <span>Retour</span>
                    <span>{formatDate(checkout)}</span>
                  </div>
                  <div className="bm__recap-row">
                    <span>Voyageurs</span>
                    <span>{nbPersonnes}</span>
                  </div>
                  <div className="bm__recap-row bm__recap-row--total">
                    <span>Total</span>
                    <span>{formatAr(total)}</span>
                  </div>
                </div>

                {/* Choix méthode de paiement */}
                <div className="bm__payment-methods">
                  <label className={`bm__method ${paymentMethod === 'mvola' ? 'bm__method--active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="mvola"
                      checked={paymentMethod === 'mvola'}
                      onChange={() => setPaymentMethod('mvola')}
                    />
                    <img src="/images/mvola.png" alt="MVola" className="bm__method-logo" />
                    <span className="bm__method-label">MVola</span>
                  </label>
                  <label className={`bm__method ${paymentMethod === 'carte' ? 'bm__method--active' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="carte"
                      checked={paymentMethod === 'carte'}
                      onChange={() => setPaymentMethod('carte')}
                    />
                    <span className="bm__method-icons">💳</span>
                    <span className="bm__method-label">Carte bancaire</span>
                  </label>
                </div>

                {/* Formulaire MVola */}
                {paymentMethod === 'mvola' && (
                  <div className="bm__mvola-block">
                    <div className="bm__field">
                      <label className="bm__label">Numéro MVola</label>
                      <input type="tel" className="bm__input" defaultValue="034 86 123 45" readOnly />
                      <p className="bm__field-hint">Compte associé : {user?.name}</p>
                    </div>
                    <div className="bm__mvola-amount">
                      À débiter : <strong>{formatAr(total)}</strong>
                    </div>
                  </div>
                )}

                {/* Formulaire carte bancaire */}
                {paymentMethod === 'carte' && (
                  <div className="bm__card-block">
                    <div className="bm__field">
                      <label className="bm__label">Numéro de carte</label>
                      <input
                        type="text"
                        className="bm__input"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 16)
                          setCardNumber(v.replace(/(.{4})/g, '$1 ').trim())
                        }}
                      />
                    </div>
                    <div className="bm__card-row">
                      <div className="bm__field">
                        <label className="bm__label">Date d'expiration</label>
                        <input
                          type="text"
                          className="bm__input"
                          placeholder="MM/AA"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                            setCardExpiry(v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v)
                          }}
                        />
                      </div>
                      <div className="bm__field">
                        <label className="bm__label">CVV</label>
                        <input
                          type="text"
                          className="bm__input"
                          placeholder="123"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        />
                      </div>
                    </div>
                    <div className="bm__mvola-amount">
                      À débiter : <strong>{formatAr(total)}</strong>
                    </div>
                  </div>
                )}

                <div className="bm__btn-row">
                  <button className="bm__back-btn" onClick={() => setStep(2)}>← Retour</button>
                  <button className="btn-primary bm__next-btn bm__next-btn--flex bm__pay-btn" onClick={handlePay}>
                    Confirmer et payer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
