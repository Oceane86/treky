'use client'
import { createContext, useContext, useState } from 'react'

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('fr') // 'fr' | 'en'

  const toggle = () => setLocale((l) => (l === 'fr' ? 'en' : 'fr'))

  return (
    <LocaleContext.Provider value={{ locale, toggle }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
