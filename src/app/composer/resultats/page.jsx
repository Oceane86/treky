'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { circuits, getGuideById } from '../../../data/circuits'
import { THEMES, HEBERGEMENT_OPTIONS, matchCircuits, getMatchedThemes } from '../../../utils/matching'
import { MONTHS, getClosure } from '../../../utils/climate'
import { readJSON } from '../../../utils/storage'
import '../../../pages/Page.css'
import '../../../pages/Composer.css'

const SEASON_COPY = {
  closed: { icon: '🚫', tone: 'closed', label: 'Fermé à cette période' },
  avoid: { icon: '🌧️', tone: 'avoid', label: 'Période déconseillée' },
  ok: { icon: '⛅', tone: 'ok', label: 'Bonne période' },
  ideal: { icon: '☀️', tone: 'ideal', label: 'Période idéale' },
}

function formatMonthsFr(monthIndexes) {
  const labels = monthIndexes.map((m) => MONTHS[m])
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} et ${labels[labels.length - 1]}`
}

export default function ComposerResultatsPage() {
  const router = useRouter()
  const [wishes, setWishes] = useState(undefined)

  useEffect(() => {
    setWishes(readJSON('treky_wishes', null))
  }, [])

  useEffect(() => {
    if (wishes === null) router.replace('/composer')
  }, [wishes, router])

  if (!wishes) return null

  const selectedThemes = THEMES.filter((t) => wishes.themes?.includes(t.id))
  const hebergementLabels = HEBERGEMENT_OPTIONS.filter((h) => wishes.hebergement?.includes(h.id)).map((h) => h.label)
  const matches = matchCircuits(circuits, wishes, 3)
  const maxScore = 150

  return (
    <div className="page composer">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Vos recommandations</p>
          <h1 className="page-hero__title">
            {selectedThemes.map((t) => t.icon).join(' ')} {selectedThemes.map((t) => t.label).join(' · ')}
          </h1>
          <p className="page-hero__subtitle">
            {wishes.duree} jours · budget {wishes.budget.toLocaleString('fr-FR')} € · niveau {wishes.niveau}
            {wishes.groupe && ` · ${wishes.nbPersonnes} personnes`}
            {wishes.langue && ` · guide ${wishes.langue}`}
            {hebergementLabels.length > 0 && ` · ${hebergementLabels.join(', ')}`}
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <Link href="/composer" className="composer__redo-link">← Modifier ma recherche</Link>

          <div className="resultats__list">
            {matches.map(({ circuit, score, seasonStatus, idealMonths }) => {
              const pct = Math.max(8, Math.round((score / maxScore) * 100))
              const guides = (circuit.guideIds ?? []).map(getGuideById).filter(Boolean).slice(0, 2)
              const season = seasonStatus ? SEASON_COPY[seasonStatus] : null
              const closure = getClosure(circuit)
              const matchedThemes = getMatchedThemes(circuit, wishes.themes)

              return (
                <div key={circuit.id} className="resultats__card">
                  <img src={circuit.image} alt={circuit.name} className="resultats__img" />
                  <div className="resultats__body">
                    <div className="resultats__top">
                      <div>
                        <h3 className="resultats__name">{circuit.name}</h3>
                        <p className="resultats__teaser">{circuit.teaser}</p>
                      </div>
                      <div className="resultats__match">
                        <span className="resultats__match-val">{pct}%</span>
                        <span className="resultats__match-label">compatible</span>
                      </div>
                    </div>

                    <div className="resultats__tags">
                      <span className={`resultats__tag ${matchedThemes.length ? 'resultats__tag--match' : ''}`}>
                        {matchedThemes.length
                          ? `✓ ${THEMES.filter((t) => matchedThemes.includes(t.id)).map((t) => t.label).join(', ')}`
                          : 'Thématique proche'}
                      </span>
                      <span className="resultats__tag">{circuit.level}</span>
                      <span className="resultats__tag">{circuit.minDays}–{circuit.maxDays ?? circuit.recommendedDays} jours</span>
                    </div>

                    {season && (
                      <div className={`resultats__season resultats__season--${season.tone}`}>
                        <span>{season.icon}</span>
                        <span>
                          <strong>{season.label}</strong>
                          {seasonStatus === 'closed' && closure && ` — ${closure.note}`}
                          {seasonStatus !== 'closed' && idealMonths.length > 0 && (
                            <> · Meilleure période : {formatMonthsFr(idealMonths)}</>
                          )}
                        </span>
                      </div>
                    )}
                    {!season && idealMonths.length > 0 && (
                      <div className="resultats__season resultats__season--ideal">
                        <span>☀️</span>
                        <span><strong>Meilleure période :</strong> {formatMonthsFr(idealMonths)}</span>
                      </div>
                    )}

                    {guides.length > 0 && (
                      <div className="resultats__guides">
                        <span className="resultats__guides-label">Guides compatibles</span>
                        <div className="resultats__guides-list">
                          {guides.map((g) => (
                            <div key={g.id} className="resultats__guide">
                              <img src={g.photo} alt={g.nom} />
                              <div>
                                <span className="resultats__guide-name">{g.nom}</span>
                                <span className="resultats__guide-meta">★ {g.note} · {g.langues.join(', ')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Link href={`/circuits/${circuit.slug}`} className="btn-primary resultats__cta">
                      Voir le circuit complet →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
