'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { circuits } from '../../data/circuits'
import { THEMES, scoreCircuit, getMatchedThemes } from '../../utils/matching'
import { readJSON } from '../../utils/storage'
import CircuitCard from '../../components/CircuitCard'
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

  if (!wishes) return null

  const selectedThemeLabels = THEMES.filter((t) => wishes.themes?.includes(t.id)).map((t) => t.label)

  // Vos recommandations : circuits qui matchent une thématique choisie, triés par pertinence.
  const recommended = circuits
    .map((circuit) => ({ circuit, ...scoreCircuit(circuit, wishes) }))
    .filter(({ circuit }) => getMatchedThemes(circuit, wishes.themes).length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.circuit)

  // Autres thématiques : la meilleure proposition pour chaque thématique non choisie,
  // sans forcer la durée souhaitée (des circuits plus courts ou plus longs peuvent apparaître).
  // Toutes les thématiques restantes sont couvertes pour que le catalogue reste explorable
  // maintenant que la liste complète avec filtres a été retirée.
  const usedIds = new Set(recommended.map((c) => c.id))
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

          {recommended.length > 0 && (
            <div className="circuits-reco">
              <div className="circuits-reco__header">
                <h2 className="circuits-reco__title">🎯 Vos recommandations</h2>
                <p className="circuits-reco__subtitle">
                  {selectedThemeLabels.join(', ')} · {wishes.duree} jours · jusqu'à {wishes.budget.toLocaleString('fr-FR')} €
                </p>
                <Link href="/composer" className="circuits-reco__edit-link">Modifier ma recherche</Link>
              </div>
              <div className="circuits__grid">
                {recommended.map((circuit) => (
                  <CircuitCard key={circuit.id} circuit={circuit} matchBadge />
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
                    <span className="circuits-other__theme">{theme.icon} {theme.label}</span>
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
