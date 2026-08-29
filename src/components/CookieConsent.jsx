'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { readJSON, writeJSON } from '../utils/storage'
import './CookieConsent.css'

const CONSENT_KEY = 'treky_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [functional, setFunctional] = useState(true)

  useEffect(() => {
    if (!readJSON(CONSENT_KEY, null)) setVisible(true)

    function reopen() {
      setExpanded(true)
      setVisible(true)
    }
    window.addEventListener('treky:open-cookie-prefs', reopen)
    return () => window.removeEventListener('treky:open-cookie-prefs', reopen)
  }, [])

  function save(consent) {
    writeJSON(CONSENT_KEY, { necessary: true, ...consent, decidedAt: new Date().toISOString() })
    window.dispatchEvent(new Event('treky:cookie-consent-changed'))
    setVisible(false)
    setExpanded(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="dialog" aria-label="Préférences de cookies">
      <div className="cookie-consent__inner">
        {!expanded ? (
          <>
            <p className="cookie-consent__text">
              Nous utilisons des cookies indispensables au fonctionnement du site et, avec votre accord,
              des cookies de mesure d'audience et de confort. Consultez notre{' '}
              <Link href="/cookies">politique de cookies</Link>.
            </p>
            <div className="cookie-consent__actions">
              <button type="button" className="cookie-consent__btn cookie-consent__btn--ghost" onClick={() => setExpanded(true)}>
                Personnaliser
              </button>
              <button type="button" className="cookie-consent__btn cookie-consent__btn--secondary" onClick={() => save({ analytics: false, functional: false })}>
                Refuser
              </button>
              <button type="button" className="cookie-consent__btn cookie-consent__btn--primary" onClick={() => save({ analytics: true, functional: true })}>
                Tout accepter
              </button>
            </div>
          </>
        ) : (
          <div className="cookie-consent__prefs">
            <h3 className="cookie-consent__prefs-title">Préférences de cookies</h3>

            <div className="cookie-consent__pref-row">
              <div>
                <p className="cookie-consent__pref-label">Nécessaires</p>
                <p className="cookie-consent__pref-desc">Connexion, favoris, réservation en cours. Toujours actifs.</p>
              </div>
              <span className="cookie-consent__toggle cookie-consent__toggle--on cookie-consent__toggle--locked" aria-hidden="true" />
            </div>

            <div className="cookie-consent__pref-row">
              <div>
                <p className="cookie-consent__pref-label">Mesure d'audience</p>
                <p className="cookie-consent__pref-desc">Statistiques de visite anonymisées.</p>
              </div>
              <button
                type="button"
                className={`cookie-consent__toggle ${analytics ? 'cookie-consent__toggle--on' : ''}`}
                role="switch"
                aria-checked={analytics}
                aria-label="Cookies de mesure d'audience"
                onClick={() => setAnalytics((v) => !v)}
              />
            </div>

            <div className="cookie-consent__pref-row">
              <div>
                <p className="cookie-consent__pref-label">Fonctionnels</p>
                <p className="cookie-consent__pref-desc">Mémorisation de la langue et des filtres de recherche.</p>
              </div>
              <button
                type="button"
                className={`cookie-consent__toggle ${functional ? 'cookie-consent__toggle--on' : ''}`}
                role="switch"
                aria-checked={functional}
                aria-label="Cookies fonctionnels"
                onClick={() => setFunctional((v) => !v)}
              />
            </div>

            <div className="cookie-consent__actions cookie-consent__actions--prefs">
              <button type="button" className="cookie-consent__btn cookie-consent__btn--ghost" onClick={() => setExpanded(false)}>
                ← Retour
              </button>
              <button type="button" className="cookie-consent__btn cookie-consent__btn--primary" onClick={() => save({ analytics, functional })}>
                Enregistrer mes préférences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
