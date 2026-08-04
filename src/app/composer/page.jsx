'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { THEMES, HEBERGEMENT_OPTIONS, NIVEAU_OPTIONS } from '../../utils/matching'
import { writeJSON } from '../../utils/storage'
import '../../pages/Page.css'
import '../../pages/Composer.css'

export default function ComposerPage() {
  const router = useRouter()
  const [theme, setTheme] = useState(null)
  const [hebergement, setHebergement] = useState([])
  const [duree, setDuree] = useState(5)
  const [budget, setBudget] = useState(1200)
  const [date, setDate] = useState('')
  const [niveau, setNiveau] = useState('Modéré')

  const today = new Date().toISOString().split('T')[0]

  function toggleHebergement(id) {
    setHebergement((prev) => (prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]))
  }

  function handleSubmit() {
    if (!theme) return
    const month = date ? new Date(date).getMonth() : null
    writeJSON('treky_wishes', { theme, hebergement, duree, budget, niveau, date, month })
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
            <h2 className="composer__block-title">Quelle thématique vous fait rêver ?</h2>
            <div className="composer__themes">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`composer__theme-card ${theme === t.id ? 'composer__theme-card--active' : ''}`}
                  onClick={() => setTheme(t.id)}
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

          <div className="composer__grid">
            <div className="composer__block">
              <h2 className="composer__block-title">Durée souhaitée</h2>
              <input
                type="range"
                min={2}
                max={28}
                value={duree}
                onChange={(e) => setDuree(Number(e.target.value))}
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
              <div className="composer__slider-val">{budget.toLocaleString('fr-FR')} €</div>
            </div>
          </div>

          <div className="composer__grid">
            <div className="composer__block">
              <h2 className="composer__block-title">Dates envisagées <span className="composer__optional">(optionnel)</span></h2>
              <input
                type="date"
                className="composer__date-input"
                value={date}
                min={today}
                onChange={(e) => setDate(e.target.value)}
              />
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

          <button
            type="button"
            className="btn-primary composer__submit"
            disabled={!theme}
            onClick={handleSubmit}
          >
            Voir mes recommandations →
          </button>
          {!theme && <p className="composer__hint">Choisissez une thématique pour continuer.</p>}
        </div>
      </section>
    </div>
  )
}
