'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '../../components/Icon'
import { THEMES, HEBERGEMENT_OPTIONS, NIVEAU_OPTIONS, LANGUE_OPTIONS, themeLabel, hebergementLabel, niveauLabel, langueLabel } from '../../utils/matching'
import { writeJSON } from '../../utils/storage'
import { RATE_EUR_TO_AR } from '../../context/CurrencyContext'
import { useLocale } from '../../context/LocaleContext'
import { getUI } from '../../utils/i18n'
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

const DATE_LOCALE = { fr: 'fr-FR', en: 'en-GB', mg: 'fr-FR' }

function formatDate(dateStr, locale) {
  return new Date(dateStr).toLocaleDateString(DATE_LOCALE[locale] ?? 'fr-FR', { day: 'numeric', month: 'short' })
}

function Step({ id, title, optional, optionalLabel, openStep, onToggle, summary, children }) {
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
          {title} {optional && <span className="composer__optional">{optionalLabel}</span>}
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

export default function ComposerClient() {
  const router = useRouter()
  const { locale } = useLocale()
  const t = getUI(locale).composer
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
    setThemes((prev) => (prev.includes(id) ? prev.filter((th) => th !== id) : [...prev, id]))
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

  const daysWord = duree > 1 ? t.daysPlural : t.days
  const summaries = {
    themes: themes.length
      ? THEMES.filter((th) => themes.includes(th.id)).map((th) => themeLabel(th, locale)).join(', ')
      : t.toChoose,
    hebergement: hebergement.length
      ? HEBERGEMENT_OPTIONS.filter((h) => hebergement.includes(h.id)).map((h) => hebergementLabel(h, locale)).join(', ')
      : t.indifferent,
    dates: checkin && checkout ? `${formatDate(checkin, locale)} → ${formatDate(checkout, locale)}` : t.notSpecified,
    duree: `${duree} ${daysWord}`,
    budget: `${budget.toLocaleString('fr-FR')} €`,
    voyage: groupe ? `${t.group} · ${nbPersonnes} ${t.people}` : t.solo,
    niveau: niveauLabel(niveau, locale),
    langue: langue ? langueLabel(langue, locale) : t.indifferentF,
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
        {t.submit} →
      </button>
      {submitDisabled && <p className="composer__hint">{t.submitHint}</p>}
    </>
  )

  return (
    <div className="page composer">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t.eyebrow}</p>
          <h1 className="page-hero__title">{t.title}</h1>
          <p className="page-hero__subtitle">{t.subtitle}</p>
          <span className="composer__badge"><Icon name="target" size={14} /> {t.badge}</span>
        </div>
      </header>

      <section className="page-content">
        <div className="container composer__layout">
          <div className="composer__form">

            <Step id="themes" title={t.step1Title} openStep={openStep} onToggle={toggleStep} summary={summaries.themes}>
              <p className="composer__block-hint">{t.step1Hint}</p>
              <div className="composer__themes">
                {THEMES.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    className={`composer__theme-card ${themes.includes(th.id) ? 'composer__theme-card--active' : ''}`}
                    onClick={() => toggleTheme(th.id)}
                  >
                    <span className="composer__theme-icon"><Icon name={th.icon} size={24} /></span>
                    <span className="composer__theme-label">{themeLabel(th, locale)}</span>
                  </button>
                ))}
              </div>
            </Step>

            <Step id="hebergement" title={t.step2Title} optional optionalLabel={t.optional} openStep={openStep} onToggle={toggleStep} summary={summaries.hebergement}>
              <p className="composer__block-hint">{t.step2Hint}</p>
              <div className="composer__chips">
                {HEBERGEMENT_OPTIONS.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    className={`composer__chip ${hebergement.includes(h.id) ? 'composer__chip--active' : ''}`}
                    onClick={() => toggleHebergement(h.id)}
                  >
                    <Icon name={h.icon} size={16} /> {hebergementLabel(h, locale)}
                  </button>
                ))}
              </div>
            </Step>

            <Step id="dates" title={t.step3Title} optional optionalLabel={t.optional} openStep={openStep} onToggle={toggleStep} summary={summaries.dates}>
              <p className="composer__block-hint">{t.step3Hint}</p>
              <div className="composer__date-row">
                <div className="composer__date-field">
                  <label>{t.arrivalDate}</label>
                  <input
                    type="date"
                    className="composer__date-input"
                    value={checkin}
                    min={today}
                    onChange={(e) => handleCheckin(e.target.value)}
                  />
                </div>
                <div className="composer__date-field">
                  <label>{t.departureDate}</label>
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

            <Step id="duree" title={t.step4Title} openStep={openStep} onToggle={toggleStep} summary={summaries.duree}>
              <input
                type="range"
                min={2}
                max={28}
                value={duree}
                onChange={(e) => handleDuree(Number(e.target.value))}
                className="composer__slider"
              />
              <div className="composer__slider-val">{duree} {daysWord}</div>
            </Step>

            <Step id="budget" title={t.step5Title} openStep={openStep} onToggle={toggleStep} summary={summaries.budget}>
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

            <Step id="voyage" title={t.step6Title} openStep={openStep} onToggle={toggleStep} summary={summaries.voyage}>
              <div className="composer__chips">
                <button
                  type="button"
                  className={`composer__chip ${!groupe ? 'composer__chip--active' : ''}`}
                  onClick={() => setGroupe(false)}
                >
                  <Icon name="user" size={16} /> {t.solo}
                </button>
                <button
                  type="button"
                  className={`composer__chip ${groupe ? 'composer__chip--active' : ''}`}
                  onClick={() => setGroupe(true)}
                >
                  <Icon name="users" size={16} /> {t.group}
                </button>
              </div>
              {groupe && (
                <div className="composer__counter">
                  <button
                    type="button"
                    className="composer__counter-btn"
                    onClick={() => setNbPersonnes((n) => Math.max(2, n - 1))}
                  >−</button>
                  <span className="composer__counter-val">{nbPersonnes} {t.people}</span>
                  <button
                    type="button"
                    className="composer__counter-btn"
                    onClick={() => setNbPersonnes((n) => Math.min(15, n + 1))}
                  >+</button>
                </div>
              )}
            </Step>

            <Step id="niveau" title={t.step7Title} openStep={openStep} onToggle={toggleStep} summary={summaries.niveau}>
              <div className="composer__chips">
                {NIVEAU_OPTIONS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`composer__chip ${niveau === n ? 'composer__chip--active' : ''}`}
                    onClick={() => setNiveau(n)}
                  >
                    {niveauLabel(n, locale)}
                  </button>
                ))}
              </div>
            </Step>

            <Step id="langue" title={t.step8Title} optional optionalLabel={t.optional} openStep={openStep} onToggle={toggleStep} summary={summaries.langue}>
              <div className="composer__chips">
                {LANGUE_OPTIONS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`composer__chip ${langue === l ? 'composer__chip--active' : ''}`}
                    onClick={() => setLangue(langue === l ? null : l)}
                  >
                    {langueLabel(l, locale)}
                  </button>
                ))}
              </div>
            </Step>

            <div className="composer__mobile-submit">
              {submitBlock}
            </div>
          </div>

          <aside className="composer__recap">
            <h3 className="composer__recap-title">{t.recapTitle}</h3>
            <ul className="composer__recap-list">
              <li><span>{t.themes}</span><strong>{summaries.themes}</strong></li>
              <li><span>{t.accommodation}</span><strong>{summaries.hebergement}</strong></li>
              <li><span>{t.dates}</span><strong>{summaries.dates}</strong></li>
              <li><span>{t.duration}</span><strong>{summaries.duree}</strong></li>
              <li><span>{t.budget}</span><strong>{summaries.budget}</strong></li>
              <li><span>{t.travelers}</span><strong>{summaries.voyage}</strong></li>
              <li><span>{t.level}</span><strong>{summaries.niveau}</strong></li>
              <li><span>{t.guideLanguage}</span><strong>{summaries.langue}</strong></li>
            </ul>
            {submitBlock}
          </aside>

        </div>
      </section>
    </div>
  )
}
