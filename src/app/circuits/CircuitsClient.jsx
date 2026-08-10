'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Icon from '../../components/Icon'
import { circuits } from '../../data/circuits'
import { THEMES, scoreCircuit, matchCircuitsByTheme } from '../../utils/matching'
import { readJSON, removeJSON } from '../../utils/storage'
import CircuitCard from '../../components/CircuitCard'
import RecommendationCard from '../../components/RecommendationCard'
import '../../components/Circuits.css'
import '../../pages/CircuitsPage.css'
import '../../pages/Page.css'

export default function CircuitsPage() {
  const router = useRouter()

  // undefined = pas encore lu depuis le localStorage, null = aucune envie enregistrée
  const [wishes, setWishes] = useState(undefined)

  useEffect(() => {
    setWishes(readJSON('treky_wishes', null))
  }, [])

  useEffect(() => {
    // Sans formulaire d'envies rempli, pas de recommandations possibles : on renvoie vers le composer.
    if (wishes === null) router.replace('/composer')
  }, [wishes, router])

  function clearWishes() {
    removeJSON('treky_wishes')
    setWishes(null)
  }

  if (!wishes) return null

  const selectedThemeLabels = THEMES.filter((t) => wishes.themes?.includes(t.id)).map((t) => t.label)

  // Vos recommandations : mêmes circuits, dans le même ordre, que la page /composer/resultats.
  // Chaque thématique choisie est garantie d'avoir au moins un représentant.
  const recommended = matchCircuitsByTheme(circuits, wishes, 3)

  // Autres thématiques : la meilleure proposition pour chaque thématique non choisie,
  // sans forcer la durée souhaitée (des circuits plus courts ou plus longs peuvent apparaître).
  // Toutes les thématiques restantes sont couvertes pour que le catalogue reste explorable
  // maintenant que la liste complète avec filtres a été retirée.
  const usedIds = new Set(recommended.map((r) => r.circuit.id))
  const otherSuggestions = []
  for (const theme of THEMES.filter((t) => !wishes.themes?.includes(t.id))) {
    const candidates = circuits.filter((c) => (c.themes ?? []).includes(theme.id) && !usedIds.has(c.id))
    if (!candidates.length) continue
    const best = candidates
      .map((circuit) => ({ circuit, ...scoreCircuit(circuit, wishes) }))
      .sort((a, b) => b.score - a.score)[0]
    usedIds.add(best.circuit.id)
    otherSuggestions.push({ theme, circuit: best.circuit })
  }

  return (
    <div className="page">
      <header className="page-hero page-hero--compact page-hero--circuits">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Nos treks</p>
          <h1 className="page-hero__title">Circuits</h1>
          <p className="page-hero__subtitle">
            {selectedThemeLabels.length > 0
              ? `Vos recommandations pour ${selectedThemeLabels.join(', ')}, et d'autres idées à explorer.`
              : "Choisissez votre aventure et personnalisez la durée selon votre disponibilité."}
          </p>
        </div>
      </header>

      <section className="section-padding" style={{ paddingTop: '56px' }}>
        <div className="container">

          <div className="circuits-search-bar">
            <div>
              <strong><Icon name="target" size={15} /> Votre recherche</strong>
              <span>
                {' '}{selectedThemeLabels.join(', ')} · {wishes.duree} jours · jusqu'à {wishes.budget.toLocaleString('fr-FR')} €
              </span>
            </div>
            <div className="circuits-search-bar__actions">
              <Link href="/composer" className="circuits-search-bar__link">Modifier ma recherche</Link>
              <button type="button" className="circuits-search-bar__link circuits-search-bar__link--muted" onClick={clearWishes}>
                Effacer ma recherche
              </button>
            </div>
          </div>

          {recommended.length > 0 && (
            <div className="circuits-reco">
              <div className="circuits-reco__header">
                <h2 className="circuits-reco__title"><Icon name="target" size={20} /> Vos recommandations</h2>
              </div>
              <div className="resultats__list">
                {recommended.map(({ circuit, score, seasonStatus, idealMonths }) => (
                  <RecommendationCard
                    key={circuit.id}
                    circuit={circuit}
                    score={score}
                    seasonStatus={seasonStatus}
                    idealMonths={idealMonths}
                    themeIds={wishes.themes}
                  />
                ))}
              </div>
            </div>
          )}

          {otherSuggestions.length > 0 && (
            <div className="circuits-other">
              <div className="circuits-other__header">
                <h2 className="circuits-other__title">Envie d'explorer d'autres thématiques ?</h2>
                <p className="circuits-other__subtitle">
                  D'autres expériences, parfois plus courtes ou plus longues que les {wishes.duree} jours demandés.
                </p>
              </div>
              <div className="circuits-other__row">
                {otherSuggestions.map(({ theme, circuit }) => (
                  <div key={theme.id} className="circuits-other__item">
                    <span className="circuits-other__theme"><Icon name={theme.icon} size={14} /> {theme.label}</span>
                    <CircuitCard circuit={circuit} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
