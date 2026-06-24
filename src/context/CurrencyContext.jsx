import { createContext, useContext, useState } from 'react'

const RATE_EUR_TO_AR = 5000 // 1 € ≈ 5 000 Ar

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('AR') // 'AR' | 'EUR'

  const toggle = () => setCurrency(c => c === 'AR' ? 'EUR' : 'AR')

  /**
   * Formate un montant en Ariary vers la devise active.
   * @param {number} ariary - prix en Ariary
   */
  const format = (ariary) => {
    if (currency === 'EUR') {
      const eur = ariary / RATE_EUR_TO_AR
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(eur)
    }
    return new Intl.NumberFormat('fr-FR').format(ariary) + ' Ar'
  }

  return (
    <CurrencyContext.Provider value={{ currency, toggle, format }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}
