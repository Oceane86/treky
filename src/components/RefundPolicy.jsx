'use client'
import { REFUND_POLICY } from '../utils/pricing'
import './RefundPolicy.css'

export default function RefundPolicy({ compact = false }) {
  return (
    <div className={`rfp ${compact ? 'rfp--compact' : ''}`}>
      <p className="rfp__title">Politique de remboursement</p>
      <ul className="rfp__list">
        {REFUND_POLICY.map((r) => (
          <li key={r.seuil} className="rfp__item">
            <span className="rfp__taux">{r.taux}</span>
            <div className="rfp__item-text">
              <span className="rfp__seuil">{r.seuil}</span>
              <span className="rfp__desc">{r.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
