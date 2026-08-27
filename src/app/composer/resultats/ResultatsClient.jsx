'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { circuits } from '../../../data/circuits'
import { THEMES, HEBERGEMENT_OPTIONS, matchCircuitsByTheme } from '../../../utils/matching'
import { readJSON, removeJSON } from '../../../utils/storage'
import RecommendationCard from '../../../components/RecommendationCard'
import '../../../pages/Page.css'
import '../../../pages/Composer.css'

export default function ResultatsClient() {
  const router = useRouter()
  const [wishes, setWishes] = useState(undefined)

  useEffect(() => {
    setWishes(readJSON('treky_wishes', null))
  }, [])

  useEffect(() => {
    if (wishes === null) router.replace('/composer')
  }, [wishes, router])

  function clearWishes() {
    removeJSON('treky_wishes')
    setWishes(null)
  }

  if (!wishes) return null

  const selectedThemes = THEMES.filter((t) => wishes.themes?.includes(t.id))
  const hebergementLabels = HEBERGEMENT_OPTIONS.filter((h) => wishes.hebergement?.includes(h.id)).map((h) => h.label)
  // Chaque thématique choisie est garantie d'avoir au moins un représentant.
  const matches = matchCircuitsByTheme(circuits, wishes, 3)

  return (
    <div className="page composer">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Vos recommandations</p>
          <h1 className="page-hero__title">Vos treks sur-mesure</h1>
          <p className="page-hero__subtitle">
            {selectedThemes.map((t) => t.label).join(', ')} · {wishes.duree} jours · budget {wishes.budget.toLocaleString('fr-FR')} € · niveau {wishes.niveau}
            {wishes.groupe && ` · ${wishes.nbPersonnes} personnes`}
            {wishes.langue && ` · guide ${wishes.langue}`}
            {hebergementLabels.length > 0 && ` · ${hebergementLabels.join(', ')}`}
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <div className="composer__redo-row">
            <Link href="/composer" className="composer__redo-link">← Modifier ma recherche</Link>
            <button type="button" className="composer__redo-link composer__redo-link--muted" onClick={clearWishes}>
              Effacer ma recherche
            </button>
          </div>

          <div className="resultats__list">
            {matches.map(({ circuit, score, seasonStatus, idealMonths, bestGuide }) => (
              <RecommendationCard
                key={circuit.id}
                circuit={circuit}
                score={score}
                seasonStatus={seasonStatus}
                idealMonths={idealMonths}
                bestGuide={bestGuide}
                themeIds={wishes.themes}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
