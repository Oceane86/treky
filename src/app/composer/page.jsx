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

function formatDateFr(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function Step({ id, title, optional, openStep, onToggle, summary, children }) {
  const open = openStep === id
  return (
    <div className={`composer__step ${open ? 'composer__step--open' : ''}`}>
      <button
        type="button"
        className="composer__step-header"
        onClick={() => onToggle(id)}
        aria-expanded={open}
      >
        <h2 className="composer__block-title">
          {title} {optional && <span className="composer__optional">(optionnel)</span>}
        </h2>
        <span className="composer__step-right">
          {!open && summary && <span className="composer__step-summary">{summary}</span>}
          <span className="composer__step-chevron">{open ? '−' : '+'}</span>
        </span>
      </button>
      {open && <div className="composer__step-body">{children}</div>}
    </div>
  )
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
  const [openStep, setOpenStep] = useState('themes')

  const today = new Date().toISOString().split('T')[0]

  function toggleStep(id) {
    setOpenStep((prev) => (prev === id ? null : id))
  }

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

  const summaries = {
    themes: themes.length
      ? THEMES.filter((t) => themes.includes(t.id)).map((t) => t.label).join(', ')
      : 'À choisir',
    hebergement: hebergement.length
      ? HEBERGEMENT_OPTIONS.filter((h) => hebergement.includes(h.id)).map((h) => h.label).join(', ')
      : 'Indifférent',
    dates: checkin && checkout ? `${formatDateFr(checkin)} → ${formatDateFr(checkout)}` : 'Non renseignées',
    duree: `${duree} jour${duree > 1 ? 's' : ''}`,
    budget: `${budget.toLocaleString('fr-FR')} €`,
    voyage: groupe ? `En groupe · ${nbPersonnes} pers.` : 'Solo',
    niveau,
    langue: langue ?? 'Indifférente',
  }

  const submitDisabled = !themes.length

  const submitBlock = (
    <>
      <button
        type="button"
        className="btn-primary composer__submit"
        disabled={submitDisabled}
        onClick={handleSubmit}
      >
        Voir mes recommandations →
      </button>
      {submitDisabled && <p className="composer__hint">Choisissez au moins une thématique pour continuer.</p>}
    </>
  )

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
        <div className="container composer__layout">
          <div className="composer__form">

            <Step id="themes" title="Quelles thématiques vous font rêver ?" openStep={openStep} onToggle={toggleStep} summary={summaries.themes}>
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
            </Step>

            <Step id="hebergement" title="Type d'hébergement" optional openStep={openStep} onToggle={toggleStep} summary={summaries.hebergement}>
              <p className="composer__block-hint">Indépendant de la thématique.</p>
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
            </Step>

            <Step id="dates" title="Dates envisagées" optional openStep={openStep} onToggle={toggleStep} summary={summaries.dates}>
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
            </Step>

            <Step id="duree" title="Durée souhaitée" openStep={openStep} onToggle={toggleStep} summary={summaries.duree}>
              <input
                type="range"
                min={2}
                max={28}
                value={duree}
                onChange={(e) => handleDuree(Number(e.target.value))}
                className="composer__slider"
              />
              <div className="composer__slider-val">{duree} jour{duree > 1 ? 's' : ''}</div>
            </Step>

            <Step id="budget" title="Budget maximum" openStep={openStep} onToggle={toggleStep} summary={summaries.budget}>
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
            </Step>

            <Step id="voyage" title="Vous voyagez…" openStep={openStep} onToggle={toggleStep} summary={summaries.voyage}>
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
            </Step>

            <Step id="niveau" title="Niveau physique" openStep={openStep} onToggle={toggleStep} summary={summaries.niveau}>
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
            </Step>

            <Step id="langue" title="Langue parlée par le guide" optional openStep={openStep} onToggle={toggleStep} summary={summaries.langue}>
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
            </Step>

            <div className="composer__mobile-submit">
              {submitBlock}
            </div>
          </div>

          <aside className="composer__recap">
            <h3 className="composer__recap-title">Votre recherche</h3>
            <ul className="composer__recap-list">
              <li><span>Thématiques</span><strong>{summaries.themes}</strong></li>
              <li><span>Hébergement</span><strong>{summaries.hebergement}</strong></li>
              <li><span>Dates</span><strong>{summaries.dates}</strong></li>
              <li><span>Durée</span><strong>{summaries.duree}</strong></li>
              <li><span>Budget</span><strong>{summaries.budget}</strong></li>
              <li><span>Voyageurs</span><strong>{summaries.voyage}</strong></li>
              <li><span>Niveau</span><strong>{summaries.niveau}</strong></li>
              <li><span>Langue guide</span><strong>{summaries.langue}</strong></li>
            </ul>
            {submitBlock}
          </aside>

        </div>
      </section>
    </div>
  )
}
