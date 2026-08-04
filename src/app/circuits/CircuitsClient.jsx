'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { circuits } from '../../data/circuits'
import { THEMES, scoreCircuit, getMatchedThemes } from '../../utils/matching'
import { readJSON } from '../../utils/storage'
import CircuitCard from '../../components/CircuitCard'
import '../../components/Circuits.css'
import '../../pages/CircuitsPage.css'
import '../../pages/Page.css'

const DUREE_OPTIONS = [
  { label: '1 – 3 jours', value: '1-3' },
  { label: '4 – 7 jours', value: '4-7' },
  { label: '8 jours et +', value: '8+' },
]

const BUDGET_OPTIONS = [
  { label: 'Moins de 600 000 Ar', value: '0-600' },
  { label: '600K – 1,2M Ar', value: '600-1200' },
  { label: 'Plus de 1,2M Ar', value: '1200+' },
]

const THEME_OPTIONS = [
  { label: 'Aventure', value: 'aventure' },
  { label: 'Nature', value: 'nature' },
  { label: 'Culture', value: 'culture' },
]

const NIVEAU_OPTIONS = [
  { label: 'Facile', value: 'Facile' },
  { label: 'Modéré', value: 'Modéré' },
  { label: 'Sportif', value: 'Sportif' },
  { label: 'Engagé', value: 'Engagé' },
]

const SAISON_OPTIONS = [
  { label: 'Saison sèche', value: 'seche' },
  { label: 'Saison des pluies', value: 'pluies' },
]

const NIVEAU_FROM_PARAM = {
  debutant: 'Facile',
  modere: 'Modéré',
  difficile: 'Sportif',
}

function inDureeRange(days, range) {
  if (range === '1-3') return days <= 3
  if (range === '4-7') return days >= 4 && days <= 7
  if (range === '8+') return days >= 8
  return false
}

function inBudgetRange(priceAr, range) {
  const priceK = priceAr / 1000
  if (range === '0-600') return priceK < 600
  if (range === '600-1200') return priceK >= 600 && priceK <= 1200
  if (range === '1200+') return priceK > 1200
  return false
}

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="circuits-sidebar__group">
      <h4 className="circuits-sidebar__group-title">{title}</h4>
      <ul className="circuits-sidebar__options">
        {options.map((opt) => (
          <li key={opt.value}>
            <label className="circuits-sidebar__option">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => onToggle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CircuitsPage() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState(() => ({
    duree: searchParams.get('duree') ? [searchParams.get('duree')] : [],
    budget: searchParams.get('budget') ? [searchParams.get('budget')] : [],
    theme: searchParams.get('theme') ? searchParams.get('theme').split(',').map((t) => t.trim()) : [],
    niveau: searchParams.get('niveau') ? [NIVEAU_FROM_PARAM[searchParams.get('niveau')] ?? searchParams.get('niveau')] : [],
    saison: searchParams.get('saison') ? [searchParams.get('saison')] : [],
  }))

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [wishes, setWishes] = useState(null)
  const [wishesActive, setWishesActive] = useState(true)

  useEffect(() => {
    setWishes(readJSON('treky_wishes', null))
  }, [])

  function toggle(category, value) {
    setFilters((prev) => {
      const current = prev[category]
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      }
    })
  }

  function clearAll() {
    setFilters({ duree: [], budget: [], theme: [], niveau: [], saison: [] })
  }

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0)
  const useWishes = wishesActive && !!wishes

  let visible = circuits.filter((c) => {
    if (filters.duree.length && !filters.duree.some((r) => inDureeRange(c.recommendedDays, r))) return false
    if (filters.budget.length && !filters.budget.some((r) => inBudgetRange(c.priceAr, r))) return false
    if (filters.theme.length && !filters.theme.includes(c.thematique)) return false
    if (filters.niveau.length && !filters.niveau.includes(c.level)) return false
    if (filters.saison.length && c.saison !== 'toute-saison' && !filters.saison.includes(c.saison)) return false
    return true
  })

  if (useWishes) {
    visible = [...visible].sort((a, b) => scoreCircuit(b, wishes).score - scoreCircuit(a, wishes).score)
  }

  const selectedThemeLabels = THEMES.filter((t) => wishes?.themes?.includes(t.id)).map((t) => t.label)

  return (
    <div className="page">
      <header className="page-hero page-hero--compact page-hero--circuits">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Nos treks</p>
          <h1 className="page-hero__title">Circuits</h1>
          <p className="page-hero__subtitle">
            Choisissez votre aventure et personnalisez la durée selon votre disponibilité.
          </p>
        </div>
      </header>

      <section className="section-padding" style={{ paddingTop: '56px' }}>
        <div className="container">

          {wishes && (
            <div className={`circuits-wishes-banner ${useWishes ? '' : 'circuits-wishes-banner--off'}`}>
              <div>
                <strong>{useWishes ? '🎯 Trié selon votre recherche' : 'Recherche ignorée'}</strong>
                <span>
                  {' '}Budget {wishes.budget.toLocaleString('fr-FR')} € · {wishes.duree} jours — tous les circuits restent affichés,
                  {selectedThemeLabels.length > 0 ? ` ${selectedThemeLabels.join(', ')} en tête` : ' les plus compatibles en tête'}
                </span>
              </div>
              <div className="circuits-wishes-banner__actions">
                <Link href="/composer" className="circuits-wishes-banner__link">Modifier ma recherche</Link>
                <button
                  className="circuits-wishes-banner__link"
                  onClick={() => setWishesActive((v) => !v)}
                >
                  {useWishes ? 'Ignorer' : 'Réactiver'}
                </button>
              </div>
            </div>
          )}

          <button
            className="circuits-layout__filter-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span>☰</span>
            Filtres
            {hasActiveFilters && <span className="circuits-layout__filter-dot" />}
          </button>

          <div className="circuits-layout">
            <aside className={`circuits-sidebar${sidebarOpen ? ' open' : ''}`}>
              <div className="circuits-sidebar__header">
                <h3>Filtres</h3>
                {hasActiveFilters && (
                  <button className="circuits-sidebar__clear" onClick={clearAll}>
                    Tout effacer
                  </button>
                )}
              </div>

              <FilterGroup title="Durée" options={DUREE_OPTIONS} selected={filters.duree} onToggle={(v) => toggle('duree', v)} />
              <FilterGroup title="Budget" options={BUDGET_OPTIONS} selected={filters.budget} onToggle={(v) => toggle('budget', v)} />
              <FilterGroup title="Thématique" options={THEME_OPTIONS} selected={filters.theme} onToggle={(v) => toggle('theme', v)} />
              <FilterGroup title="Niveau" options={NIVEAU_OPTIONS} selected={filters.niveau} onToggle={(v) => toggle('niveau', v)} />
              <FilterGroup title="Saison" options={SAISON_OPTIONS} selected={filters.saison} onToggle={(v) => toggle('saison', v)} />
            </aside>

            <div className="circuits-results">
              <div className="circuits-results__header">
                <span className="circuits-results__count">
                  {visible.length} circuit{visible.length !== 1 ? 's' : ''}
                </span>
                {hasActiveFilters && (
                  <button className="circuits-results__reset" onClick={clearAll}>
                    Réinitialiser
                  </button>
                )}
              </div>

              {visible.length > 0 ? (
                <div className="circuits__grid">
                  {visible.map((circuit) => (
                    <CircuitCard
                      key={circuit.id}
                      circuit={circuit}
                      matchBadge={useWishes && getMatchedThemes(circuit, wishes.themes).length > 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="circuits-results__empty">
                  <p>Aucun circuit ne correspond à ces critères.</p>
                  <button className="btn-secondary" onClick={clearAll}>
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
