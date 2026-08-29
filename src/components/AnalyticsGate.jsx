'use client'
import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { readJSON } from '../utils/storage'

const CONSENT_KEY = 'treky_cookie_consent'

// N'active Vercel Analytics qu'apres consentement explicite (categorie "mesure
// d'audience" dans la bannière cookies), conformement a la politique /cookies.
export default function AnalyticsGate() {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    function check() {
      setAllowed(!!readJSON(CONSENT_KEY, null)?.analytics)
    }
    check()
    window.addEventListener('treky:cookie-consent-changed', check)
    return () => window.removeEventListener('treky:cookie-consent-changed', check)
  }, [])

  return allowed ? <Analytics /> : null
}
