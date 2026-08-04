'use client'
import { splitPrice } from '../utils/pricing'
import './PriceBreakdown.css'

function formatAr(n) {
  return new Intl.NumberFormat('fr-MG').format(n) + ' Ar'
}

export default function PriceBreakdown({ amount, compact = false }) {
  const { guide, logistique, commission } = splitPrice(amount)

  return (
    <div className={`pbd ${compact ? 'pbd--compact' : ''}`}>
      <p className="pbd__title">Où va votre argent ?</p>
      <div className="pbd__row">
        <span className="pbd__dot pbd__dot--guide" />
        <span className="pbd__label">Part du guide</span>
        <span className="pbd__val">{formatAr(guide)}</span>
      </div>
      <div className="pbd__row">
        <span className="pbd__dot pbd__dot--logistique" />
        <span className="pbd__label">Logistique locale</span>
        <span className="pbd__val">{formatAr(logistique)}</span>
      </div>
      <div className="pbd__row">
        <span className="pbd__dot pbd__dot--commission" />
        <span className="pbd__label">Commission Treky</span>
        <span className="pbd__val">{formatAr(commission)}</span>
      </div>
      <p className="pbd__note">80 % de ce montant reste à Madagascar.</p>
    </div>
  )
}
