// Formulaire d'envies : taxonomie et algorithme de matching voyageur → circuits/guides.
// Les 8 thématiques sont des points de départ pour le matching, pas des forfaits figés.

import { guides } from '../data/circuits'
import { getClimatForMonth, isClosedInMonth, getIdealMonths } from './climate'

export const THEMES = [
  { id: 'aventure-sommets', label: 'Aventure & Sommets', icon: '🏔️' },
  { id: 'paysages-mineraux', label: 'Paysages minéraux', icon: '🪨' },
  { id: 'faune-biodiversite', label: 'Faune & Biodiversité', icon: '🦎' },
  { id: 'culture-traditions', label: 'Culture & Traditions', icon: '🎭' },
  { id: 'histoire-patrimoine', label: 'Histoire & Patrimoine', icon: '🏛️' },
  { id: 'saveurs-artisanat', label: 'Saveurs & Artisanat', icon: '🌿' },
  { id: 'plages-ocean', label: 'Plages & Océan', icon: '🌊' },
  { id: 'expedition-integrale', label: 'Expédition intégrale', icon: '🧭' },
]

// "Lodge partenaire" regroupe les hébergements gérés par des partenaires Treky
// (lodge, hôtel, bungalow), distincts de l'hébergement chez l'habitant et du bivouac.
export const HEBERGEMENT_OPTIONS = [
  { id: 'habitant', label: "Chez l'habitant", icon: '🏡', types: ["Chez l'habitant"] },
  { id: 'lodge', label: 'Lodge partenaire', icon: '🏨', types: ['Lodge', 'Hôtel', 'Bungalow'] },
  { id: 'bivouac', label: 'Bivouac', icon: '⛺', types: ['Bivouac'] },
]

export const NIVEAU_OPTIONS = ['Facile', 'Modéré', 'Sportif', 'Engagé']

export const LANGUE_OPTIONS = [...new Set(guides.flatMap((g) => g.langues))]

export function getHebergementTypes(circuit) {
  return [...new Set((circuit.steps ?? []).map((s) => s.typeHebergement).filter(Boolean))]
}

export function getCircuitGuides(circuit) {
  return (circuit.guideIds ?? []).map((id) => guides.find((g) => g.id === id)).filter(Boolean)
}

// Extrait la fourchette d'un texte type "2 à 15 personnes" → [2, 15].
export function parseGroupSize(text) {
  const nums = (text ?? '').match(/\d+/g)
  if (!nums || nums.length < 2) return [1, 99]
  return [Number(nums[0]), Number(nums[1])]
}

function hebergementScore(circuit, wishedIds) {
  if (!wishedIds?.length) return 20 // aucune préférence = compatible
  const available = getHebergementTypes(circuit)
  const wishedTypes = HEBERGEMENT_OPTIONS.filter((o) => wishedIds.includes(o.id)).flatMap((o) => o.types)
  return wishedTypes.some((t) => available.includes(t)) ? 20 : 0
}

function dureeScore(circuit, days) {
  if (!days) return 10
  if (days < circuit.minDays || days > (circuit.maxDays ?? circuit.recommendedDays)) return 0
  const distance = Math.abs(days - circuit.recommendedDays)
  return distance === 0 ? 15 : Math.max(15 - distance, 6)
}

function budgetScore(circuit, budgetEur) {
  if (!budgetEur) return 10
  if (budgetEur < circuit.priceEurMin) return 0
  if (budgetEur <= circuit.priceEurMax) return 15
  return 8 // budget large, toujours compatible mais moins "ajusté"
}

function niveauScore(circuit, niveau) {
  if (!niveau) return 5
  const dist = Math.abs(NIVEAU_OPTIONS.indexOf(circuit.level) - NIVEAU_OPTIONS.indexOf(niveau))
  if (dist === 0) return 10
  if (dist === 1) return 5
  return 0
}

function themeScore(circuit, themeIds) {
  if (!themeIds?.length) return 0
  const matched = (circuit.themes ?? []).filter((t) => themeIds.includes(t)).length
  if (!matched) return 0
  return Math.min(40 + (matched - 1) * 10, 60)
}

function langueScore(circuit, langue) {
  if (!langue) return 5
  return getCircuitGuides(circuit).some((g) => g.langues.includes(langue)) ? 15 : 0
}

function groupeScore(circuit, nbPersonnes) {
  if (!nbPersonnes) return 5
  const [min, max] = parseGroupSize(circuit.groupSize)
  return nbPersonnes >= min && nbPersonnes <= max ? 10 : 0
}

export function getMatchedThemes(circuit, themeIds) {
  return (circuit.themes ?? []).filter((t) => themeIds?.includes(t))
}

export function getSeasonStatus(circuit, monthIndex) {
  if (monthIndex === null || monthIndex === undefined) return null
  if (isClosedInMonth(circuit, monthIndex)) return 'closed'
  return getClimatForMonth(circuit, monthIndex)
}

export function scoreCircuit(circuit, wishes) {
  const { themes, hebergement, duree, budget, niveau, month, nbPersonnes, langue } = wishes
  let score =
    themeScore(circuit, themes) +
    hebergementScore(circuit, hebergement) +
    dureeScore(circuit, duree) +
    budgetScore(circuit, budget) +
    niveauScore(circuit, niveau) +
    langueScore(circuit, langue) +
    groupeScore(circuit, nbPersonnes)

  const seasonStatus = getSeasonStatus(circuit, month)
  if (seasonStatus === 'closed') score -= 25
  else if (seasonStatus === 'avoid') score -= 8
  else if (seasonStatus === 'ideal') score += 5

  return { score, seasonStatus, idealMonths: getIdealMonths(circuit) }
}

export function matchCircuits(circuits, wishes, limit = 3) {
  return circuits
    .map((circuit) => ({ circuit, ...scoreCircuit(circuit, wishes) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
