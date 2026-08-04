'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { THEMES, HEBERGEMENT_OPTIONS, NIVEAU_OPTIONS, LANGUE_OPTIONS } from '../../utils/matching'
import { writeJSON } from '../../utils/storage'
import { RATE_EUR_TO_AR } from '../../context/CurrencyContext'
import '../../pages/Page.css'
import '../../pages/Composer.css'

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function diffDays(fromStr, toStr) {
  return Math.round((new Date(toStr) - new Date(fromStr)) / 86_400_000)
}

export default function ComposerPage() {
  const router = useRouter()
  const [themes, setThemes] = useState([])
  const [hebergement, setHebergement] = useState([])
  const [duree, setDuree] = useState(5)
  const [budget, setBudget] = useState(1200)
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [niveau, setNiveau] = useState('Modéré')
  const [groupe, setGroupe] = useState(false)
  const [nbPersonnes, setNbPersonnes] = useState(2)
  const [langue, setLangue] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  function toggleTheme(id) {
    setThemes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  function toggleHebergement(id) {
    setHebergement((prev) => (prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]))
  }

  function handleCheckin(value) {
    setCheckin(value)
    if (checkout) {
      const days = diffDays(value, checkout)
      if (days > 0) setDuree(Math.min(Math.max(days, 2), 28))
      else setCheckout(addDays(value, duree))
    } else {
      setCheckout(addDays(value, duree))
    }
  }

  function handleCheckout(value) {
    setCheckout(value)
    if (checkin) {
      const days = diffDays(checkin, value)
      if (days > 0) setDuree(Math.min(Math.max(days, 2), 28))
    }
  }

  function handleDuree(value) {
    setDuree(value)
    if (checkin) setCheckout(addDays(checkin, value))
  }

  function handleSubmit() {
    if (!themes.length) return
    const month = checkin ? new Date(checkin).getMonth() : null
    writeJSON('treky_wishes', {
      themes,
      hebergement,
      duree,
      budget,
      niveau,
      checkin,
      checkout,
      month,
      groupe,
      nbPersonnes: groupe ? nbPersonnes : 1,
      langue,
    })
    router.push('/composer/resultats')
  }

  return (
    <div className="page composer">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Point de départ · pas un forfait figé</p>
          <h1 className="page-hero__title">Composez votre trek sur-mesure</h1>
          <p className="page-hero__subtitle">
            Quelques envies, et nous vous proposons des circuits et des guides déjà compatibles.
          </p>
          <span className="composer__badge">🎯 2 clics jusqu'à vos recommandations</span>
        </div>
      </header>

      <section className="page-content">
        <div className="container composer__body">

          <div className="composer__block">
            <h2 className="composer__block-title">Quelles thématiques vous font rêver ?</h2>
            <p className="composer__block-hint">Sélectionnez-en une ou plusieurs.</p>
            <div className="composer__themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`composer__theme-card ${themes.includes(t.id) ? 'composer__theme-card--active' : ''}`}
                  onClick={() => toggleTheme(t.id)}
                >
                  <span className="composer__theme-icon">{t.icon}</span>
                  <span className="composer__theme-label">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="composer__block">
            <h2 className="composer__block-title">
              Type d'hébergement <span className="composer__optional">(indépendant de la thématique, optionnel)</span>
            </h2>
            <div className="composer__chips">
              {HEBERGEMENT_OPTIONS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  className={`composer__chip ${hebergement.includes(h.id) ? 'composer__chip--active' : ''}`}
                  onClick={() => toggleHebergement(h.id)}
                >
                  <span>{h.icon}</span> {h.label}
                </button>
              ))}
            </div>
          </div>

          <div className="composer__block">
            <h2 className="composer__block-title">Dates envisagées <span className="composer__optional">(optionnel)</span></h2>
            <p className="composer__block-hint">Renseignez une date, l'autre et la durée s'ajustent automatiquement.</p>
            <div className="composer__date-row">
              <div className="composer__date-field">
                <label>Date d'arrivée</label>
                <input
                  type="date"
                  className="composer__date-input"
                  value={checkin}
                  min={today}
                  onChange={(e) => handleCheckin(e.target.value)}
                />
              </div>
              <div className="composer__date-field">
                <label>Date de départ</label>
                <input
                  type="date"
                  className="composer__date-input"
                  value={checkout}
                  min={checkin || today}
                  onChange={(e) => handleCheckout(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="composer__block">
            <h2 className="composer__block-title">Durée souhaitée</h2>
            <input
              type="range"
              min={2}
              max={28}
              value={duree}
              onChange={(e) => handleDuree(Number(e.target.value))}
              className="composer__slider"
            />
            <div className="composer__slider-val">{duree} jour{duree > 1 ? 's' : ''}</div>
          </div>

          <div className="composer__block">
            <h2 className="composer__block-title">Budget maximum</h2>
            <input
              type="range"
              min={300}
              max={4500}
              step={100}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="composer__slider"
            />
            <div className="composer__slider-val">
              {budget.toLocaleString('fr-FR')} €
              <span className="composer__slider-val-secondary">
                ≈ {(budget * RATE_EUR_TO_AR).toLocaleString('fr-FR')} Ar
              </span>
            </div>
          </div>

          <div className="composer__grid">
            <div className="composer__block">
              <h2 className="composer__block-title">Vous voyagez…</h2>
              <div className="composer__chips">
                <button
                  type="button"
                  className={`composer__chip ${!groupe ? 'composer__chip--active' : ''}`}
                  onClick={() => setGroupe(false)}
                >
                  🧍 Solo
                </button>
                <button
                  type="button"
                  className={`composer__chip ${groupe ? 'composer__chip--active' : ''}`}
                  onClick={() => setGroupe(true)}
                >
                  👥 En groupe
                </button>
              </div>
              {groupe && (
                <div className="composer__counter">
                  <button
                    type="button"
                    className="composer__counter-btn"
                    onClick={() => setNbPersonnes((n) => Math.max(2, n - 1))}
                  >−</button>
                  <span className="composer__counter-val">{nbPersonnes} personnes</span>
                  <button
                    type="button"
                    className="composer__counter-btn"
                    onClick={() => setNbPersonnes((n) => Math.min(15, n + 1))}
                  >+</button>
                </div>
              )}
            </div>

            <div className="composer__block">
              <h2 className="composer__block-title">Niveau physique</h2>
              <div className="composer__chips">
                {NIVEAU_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`composer__chip ${niveau === n ? 'composer__chip--active' : ''}`}
                    onClick={() => setNiveau(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="composer__block">
            <h2 className="composer__block-title">
              Langue parlée par le guide <span className="composer__optional">(optionnel)</span>
            </h2>
            <div className="composer__chips">
              {LANGUE_OPTIONS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`composer__chip ${langue === l ? 'composer__chip--active' : ''}`}
                  onClick={() => setLangue(langue === l ? null : l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn-primary composer__submit"
            disabled={!themes.length}
            onClick={handleSubmit}
          >
            Voir mes recommandations →
          </button>
          {!themes.length && <p className="composer__hint">Choisissez au moins une thématique pour continuer.</p>}
        </div>
      </section>
    </div>
  )
}
