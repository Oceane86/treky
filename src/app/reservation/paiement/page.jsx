'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import { useBooking } from '../../../context/BookingContext'
import { INSTALLMENT_THRESHOLD_AR, buildInstallments } from '../../../utils/pricing'
import PriceBreakdown from '../../../components/PriceBreakdown'
import Icon from '../../../components/Icon'
import '../../../components/BookingModal.css'
import './Paiement.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatAr(n) {
  return new Intl.NumberFormat('fr-MG').format(n) + ' Ar'
}

// Dernière étape du parcours : le voyageur a déjà choisi ses dates, son guide, et a pu
// lui parler par messagerie avant d'arriver ici. Le prix affiché ici est celui déjà
// annoncé dans la modale de réservation — aucune surprise à ce stade.
export default function PaiementPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { booking, setBooking } = useBooking()

  const [paymentMethod, setPaymentMethod] = useState('mvola')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [paying, setPaying] = useState(false)
  const [paymentPlan, setPaymentPlan] = useState('unique')

  useEffect(() => {
    if (!booking) router.replace('/circuits')
  }, [booking, router])

  if (!booking) return null

  const trekPrice = booking.prix_total - booking.frais_service
  const eligibleInstallments = booking.prix_total >= INSTALLMENT_THRESHOLD_AR
  const installments = eligibleInstallments && paymentPlan === 'fractionne'
    ? buildInstallments(booking.prix_total, booking.checkin)
    : null

  function handlePay() {
    setPaying(true)
    setTimeout(() => {
      setBooking({
        ...booking,
        payment_method: paymentMethod,
        payment_plan: eligibleInstallments ? paymentPlan : 'unique',
        installments,
        paid: true,
      })
      router.push('/reservation/recap')
    }, 2200)
  }

  return (
    <div className="paiement-page">
      <div className="container paiement-page__inner">
        <div className="bm__card paiement-page__card">
          <div className="bm__header">
            <h2 className="bm__title">Paiement</h2>
            <p className="bm__circuit-name">{booking.circuit.name}</p>
          </div>

          {paying ? (
            <div className="bm__step-body">
              <div className="bm__paying">
                <div className="bm__paying-spinner" />
                <p className="bm__paying-text">
                  {paymentMethod === 'mvola' ? 'Traitement du paiement MVola…' : 'Vérification de votre carte…'}
                </p>
              </div>
            </div>
          ) : (
            <div className="bm__step-body">
              {booking.guide && (
                <div className="bm__info-box">
                  <span><Icon name="user" size={15} /></span>
                  <span>Votre guide : {booking.guide.nom}</span>
                </div>
              )}

              <div className="bm__recap-box">
                <div className="bm__recap-row">
                  <span>Circuit</span>
                  <span>{booking.circuit.name}</span>
                </div>
                <div className="bm__recap-row">
                  <span>Départ</span>
                  <span>{formatDate(booking.checkin)}</span>
                </div>
                <div className="bm__recap-row">
                  <span>Retour</span>
                  <span>{formatDate(booking.checkout)}</span>
                </div>
                <div className="bm__recap-row">
                  <span>Voyageurs</span>
                  <span>{booking.nb_personnes}</span>
                </div>
                <div className="bm__recap-row bm__recap-row--total">
                  <span>Total</span>
                  <span>{formatAr(booking.prix_total)}</span>
                </div>
              </div>

              {eligibleInstallments && (
                <div className="bm__field">
                  <label className="bm__label">Modalités de paiement</label>
                  <div className="bm__plan-options">
                    <label className={`bm__plan-opt ${paymentPlan === 'unique' ? 'bm__plan-opt--active' : ''}`}>
                      <input
                        type="radio"
                        name="plan"
                        value="unique"
                        checked={paymentPlan === 'unique'}
                        onChange={() => setPaymentPlan('unique')}
                      />
                      Paiement en une fois
                    </label>
                    <label className={`bm__plan-opt ${paymentPlan === 'fractionne' ? 'bm__plan-opt--active' : ''}`}>
                      <input
                        type="radio"
                        name="plan"
                        value="fractionne"
                        checked={paymentPlan === 'fractionne'}
                        onChange={() => setPaymentPlan('fractionne')}
                      />
                      Paiement fractionné (acompte 30 % + 2 échéances)
                    </label>
                  </div>
                  {installments && (
                    <div className="bm__installments">
                      {installments.map((inst) => (
                        <div key={inst.label} className="bm__installment-row">
                          <span>{inst.label} · {formatDate(inst.date)}</span>
                          <span>{formatAr(inst.amount)}</span>
                        </div>
                      ))}
                      <p className="bm__installment-note">
                        Prélevé automatiquement via Stripe (PaymentIntent + charges off_session) aux échéances indiquées.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <PriceBreakdown amount={trekPrice} compact />

              <div className="bm__payment-methods">
                <label className={`bm__method ${paymentMethod === 'mvola' ? 'bm__method--active' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="mvola"
                    checked={paymentMethod === 'mvola'}
                    onChange={() => setPaymentMethod('mvola')}
                  />
                  <img src="/images/mvola.webp" alt="MVola" className="bm__method-logo" />
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
                  <span className="bm__method-icons"><Icon name="card" size={20} /></span>
                  <span className="bm__method-label">Carte bancaire</span>
                </label>
              </div>

              {paymentMethod === 'mvola' && (
                <div className="bm__mvola-block">
                  <div className="bm__field">
                    <label className="bm__label">Numéro MVola</label>
                    <input type="tel" className="bm__input" defaultValue="034 86 123 45" readOnly />
                    <p className="bm__field-hint">Compte associé : {user?.name}</p>
                  </div>
                  <div className="bm__mvola-amount">
                    À débiter aujourd'hui : <strong>{formatAr(installments ? installments[0].amount : booking.prix_total)}</strong>
                    {installments && <span className="bm__installment-hint"> (acompte, solde échelonné)</span>}
                  </div>
                </div>
              )}

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
                    À débiter aujourd'hui : <strong>{formatAr(installments ? installments[0].amount : booking.prix_total)}</strong>
                    {installments && <span className="bm__installment-hint"> (acompte, solde échelonné)</span>}
                  </div>
                </div>
              )}

              <div className="bm__btn-row">
                {booking.guide ? (
                  <Link href={`/chat/${booking.guide.id}`} className="bm__back-btn">← Retour</Link>
                ) : (
                  <Link href="/reservation/guides" className="bm__back-btn">← Retour</Link>
                )}
                <button className="btn-primary bm__next-btn bm__next-btn--flex bm__pay-btn" onClick={handlePay}>
                  Confirmer et payer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
