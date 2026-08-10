'use client'
import { createContext, useContext, useState } from 'react'

export const LOCALES = ['fr', 'en', 'mg']

const LocaleContext = createContext(null)

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('fr') // 'fr' | 'en' | 'mg'

  const toggle = () => setLocale((l) => LOCALES[(LOCALES.indexOf(l) + 1) % LOCALES.length])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggle }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}
