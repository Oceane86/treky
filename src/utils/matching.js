// Formulaire d'envies : taxonomie et algorithme de matching voyageur → circuits/guides.
// Les 8 thématiques sont des points de départ pour le matching, pas des forfaits figés.

import { guides } from '../data/circuits'
import { getClimatForMonth, isClosedInMonth, getIdealMonths } from './climate'

export const THEMES = [
  { id: 'aventure-sommets', label: 'Aventure & Sommets', labelEn: 'Adventure & Summits', labelMg: 'Fitetezana sarotra sy Tampony', icon: 'mountain' },
  { id: 'paysages-mineraux', label: 'Paysages minéraux', labelEn: 'Mineral Landscapes', labelMg: 'Toe-tany vato', icon: 'gem' },
  { id: 'faune-biodiversite', label: 'Faune & Biodiversité', labelEn: 'Wildlife & Biodiversity', labelMg: 'Biby sy Harena voajanahary', icon: 'lizard' },
  { id: 'culture-traditions', label: 'Culture & Traditions', labelEn: 'Culture & Traditions', labelMg: 'Kolontsaina sy Fomban-drazana', icon: 'masks' },
  { id: 'histoire-patrimoine', label: 'Histoire & Patrimoine', labelEn: 'History & Heritage', labelMg: 'Tantara sy Lova', icon: 'landmark' },
  { id: 'saveurs-artisanat', label: 'Saveurs & Artisanat', labelEn: 'Flavors & Crafts', labelMg: 'Tsiro sy Asa tanana', icon: 'leaf' },
  { id: 'plages-ocean', label: 'Plages & Océan', labelEn: 'Beaches & Ocean', labelMg: 'Morontsiraka sy Ranomasina', icon: 'waves' },
  { id: 'expedition-integrale', label: 'Expédition intégrale', labelEn: 'Full Expedition', labelMg: 'Dia feno', icon: 'compass' },
]

// "Lodge partenaire" regroupe les hébergements gérés par des partenaires Treky
// (lodge, hôtel, bungalow), distincts de l'hébergement chez l'habitant et du bivouac.
export const HEBERGEMENT_OPTIONS = [
  { id: 'habitant', label: "Chez l'habitant", labelEn: 'With locals', labelMg: "Any amin'ny mponina", icon: 'user', types: ["Chez l'habitant"] },
  { id: 'lodge', label: 'Lodge partenaire', labelEn: 'Partner lodge', labelMg: "Lojy mpiara-miombon'antoka", icon: 'landmark', types: ['Lodge', 'Hôtel', 'Bungalow'] },
  { id: 'bivouac', label: 'Bivouac', labelEn: 'Bivouac', labelMg: 'Toby', icon: 'mountain', types: ['Bivouac'] },
]

export const NIVEAU_OPTIONS = ['Facile', 'Modéré', 'Sportif', 'Engagé']
export const NIVEAU_LABEL_EN = { Facile: 'Easy', 'Modéré': 'Moderate', Sportif: 'Challenging', 'Engagé': 'Demanding' }
export const NIVEAU_LABEL_MG = { Facile: 'Mora', 'Modéré': 'Antonony', Sportif: 'Mafy', 'Engagé': 'Sarotra be' }

export const LANGUE_OPTIONS = [...new Set(guides.flatMap((g) => g.langues))]
export const LANGUE_LABEL_EN = { Français: 'French', Malgache: 'Malagasy', Anglais: 'English', Italien: 'Italian' }
export const LANGUE_LABEL_MG = { Français: 'Frantsay', Malgache: 'Malagasy', Anglais: 'Anglisy', Italien: 'Italianina' }

export function localeLabel(fr, en, mg, locale) {
  if (locale === 'en') return en ?? fr
  if (locale === 'mg') return mg ?? fr
  return fr
}

export function themeLabel(theme, locale) {
  return localeLabel(theme.label, theme.labelEn, theme.labelMg, locale)
}

export function hebergementLabel(option, locale) {
  return localeLabel(option.label, option.labelEn, option.labelMg, locale)
}

export function niveauLabel(niveau, locale) {
  return localeLabel(niveau, NIVEAU_LABEL_EN[niveau], NIVEAU_LABEL_MG[niveau], locale)
}

export function langueLabel(langue, locale) {
  return localeLabel(langue, LANGUE_LABEL_EN[langue], LANGUE_LABEL_MG[langue], locale)
}

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

const GROUP_SIZE_WORDS = {
  fr: (min, max) => `${min} à ${max} personnes`,
  en: (min, max) => `${min} to ${max} people`,
  mg: (min, max) => `${min} ka hatramin'ny ${max} olona`,
}

// Reformate "2 à 15 personnes" dans la langue active plutôt que de traduire
// ce texte gabarit circuit par circuit.
export function formatGroupSize(text, locale) {
  const [min, max] = parseGroupSize(text)
  return (GROUP_SIZE_WORDS[locale] ?? GROUP_SIZE_WORDS.fr)(min, max)
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

// Mots-clés associant chaque thématique aux spécialités de guides (texte libre,
// ex. "Faune endémique", "Culture Betsileo") — sert au matching guide ci-dessous.
const THEME_KEYWORDS = {
  'aventure-sommets': ['aventure', 'sommet', 'extrême', 'montagne'],
  'paysages-mineraux': ['nature', 'paysage', 'minéral', 'géolog'],
  'faune-biodiversite': ['faune', 'biodiversité', 'naturaliste', 'animal', 'nature'],
  'culture-traditions': ['culture', 'tradition', 'village'],
  'histoire-patrimoine': ['histoire', 'patrimoine'],
  'saveurs-artisanat': ['artisanat', 'saveur', 'cuisine'],
  'plages-ocean': ['plage', 'océan', 'mer'],
  'expedition-integrale': ['expédition', 'extrême', 'aventure'],
}

// Score un guide par rapport aux envies (langue + thématiques ↔ spécialités),
// utilisé pour matcher circuit ET guide en une seule passe plutôt que d'attacher
// des guides génériques à un circuit déjà choisi.
export function guideMatchScore(guide, wishes) {
  const { themes, langue } = wishes ?? {}
  let score = langue ? (guide.langues.includes(langue) ? 15 : 0) : 5

  if (themes?.length) {
    const specText = guide.specialites.join(' ').toLowerCase()
    const matched = themes.some((themeId) =>
      (THEME_KEYWORDS[themeId] ?? []).some((kw) => specText.includes(kw))
    )
    if (matched) score += 20
  }
  return score
}

// Le guide assigné au circuit le plus compatible avec les envies du voyageur,
// au lieu des deux premiers guides assignés sans distinction.
export function getBestGuide(circuit, wishes) {
  const candidates = getCircuitGuides(circuit)
  if (!candidates.length) return null
  return candidates
    .map((guide) => ({ guide, score: guideMatchScore(guide, wishes) }))
    .sort((a, b) => b.score - a.score)[0].guide
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

  return { score, seasonStatus, idealMonths: getIdealMonths(circuit), bestGuide: getBestGuide(circuit, wishes) }
}

export function matchCircuits(circuits, wishes, limit = 3) {
  return circuits
    .map((circuit) => ({ circuit, ...scoreCircuit(circuit, wishes) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// Comme matchCircuits, mais garantit qu'aucune thématique sélectionnée ne soit
// absente du résultat : sans ça, un circuit moins bien noté que le meilleur match
// d'une autre thématique pouvait disparaître entièrement de la page (il n'apparaît
// ni ici ni dans les "autres thématiques", qui ne couvre que les thématiques non
// choisies).
export function matchCircuitsByTheme(circuits, wishes, limit = 3) {
  const scored = circuits.map((circuit) => ({ circuit, ...scoreCircuit(circuit, wishes) }))
  const usedIds = new Set()
  const result = []

  for (const themeId of wishes.themes ?? []) {
    const best = scored
      .filter((r) => !usedIds.has(r.circuit.id) && (r.circuit.themes ?? []).includes(themeId))
      .sort((a, b) => b.score - a.score)[0]
    if (!best) continue
    usedIds.add(best.circuit.id)
    result.push(best)
  }

  const bestOverall = [...scored].sort((a, b) => b.score - a.score)
  for (const r of bestOverall) {
    if (result.length >= limit) break
    if (usedIds.has(r.circuit.id)) continue
    usedIds.add(r.circuit.id)
    result.push(r)
  }

  return result.sort((a, b) => b.score - a.score)
}
