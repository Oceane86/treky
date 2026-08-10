// Climat, meilleures périodes et fermetures de sites — source unique utilisée par la
// fiche circuit et le formulaire d'envies (matching + avertissements de fermeture).

export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
export const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_MG = ['Jan', 'Feb', 'Mar', 'Apr', 'Mey', 'Jon', 'Jol', 'Aog', 'Sep', 'Okt', 'Nov', 'Des']
export const MONTHS_FULL = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export function getMonths(locale) {
  if (locale === 'en') return MONTHS_EN
  if (locale === 'mg') return MONTHS_MG
  return MONTHS
}

export const CLIMAT_MAP = {
  seche:         ['avoid', 'avoid', 'avoid', 'ok', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ok', 'avoid'],
  'toute-saison': ['ok', 'ok', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ok'],
  baleines:      ['ok', 'ok', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ok'],
}

export const CLIMAT_ICON = { ideal: 'sun', ok: 'cloud', avoid: 'cloudRain' }
export const CLIMAT_LABEL = {
  fr: { ideal: 'Idéal', ok: 'Correct', avoid: 'Déconseillé' },
  en: { ideal: 'Ideal', ok: 'Good', avoid: 'Not recommended' },
  mg: { ideal: 'Tsara indrindra', ok: 'Mety', avoid: 'Tsy tokony' },
}

export function climatLabel(cond, locale) {
  return (CLIMAT_LABEL[locale] ?? CLIMAT_LABEL.fr)[cond]
}

// Fermetures réelles ou quasi-officielles de sites pendant la saison des pluies —
// utilisées pour avertir le voyageur avant qu'il ne fixe des dates.
export const CLOSURE_DATA = {
  'dedale-tsingy': {
    months: [12, 1, 2, 3, 4],
    note: "Le parc des Tsingy de Bemaraha ferme aux visiteurs en saison des pluies : les pistes depuis Morondava deviennent impraticables.",
    note_en: "The Tsingy de Bemaraha park closes to visitors during the rainy season: tracks from Morondava become impassable.",
    note_mg: "Mikatona amin'ny mpitsidika ny valanjavaboaran'ny Tsingy de Bemaraha amin'ny vanim-potoana orana: tsy azo aleha intsony ireo lalana avy any Morondava.",
  },
  'makay-traversee': {
    months: [12, 1, 2, 3, 4, 5],
    note: "Le massif du Makay est inaccessible en saison des pluies : les rivières en crue empêchent toute traversée.",
    note_en: "The Makay massif is inaccessible during the rainy season: flooded rivers prevent any crossing.",
    note_mg: "Tsy azo idirana ny havoana Makay amin'ny vanim-potoana orana: manakana ny fitetezana ny fanondrahan-drano.",
  },
  'traversee-nord-sud': {
    months: [12, 1, 2, 3],
    note: "La traversée intégrale n'est pas praticable en saison des pluies : plusieurs portions (Ankarana, Andringitra) deviennent inaccessibles.",
    note_en: "The full traverse is not practicable during the rainy season: several sections (Ankarana, Andringitra) become inaccessible.",
    note_mg: "Tsy azo atao amin'ny vanim-potoana orana ny fitetezana feno: tsy azo idirana ireo ampahany maromaro (Ankarana, Andringitra).",
  },
}

export function getClimatKey(circuit) {
  if (circuit.slug === 'sainte-marie-pirates-baleines') return 'baleines'
  return circuit.saison || 'seche'
}

export function getClimatForMonth(circuit, monthIndex) {
  const key = getClimatKey(circuit)
  return (CLIMAT_MAP[key] || CLIMAT_MAP.seche)[monthIndex]
}

export function getIdealMonths(circuit) {
  const key = getClimatKey(circuit)
  const arr = CLIMAT_MAP[key] || CLIMAT_MAP.seche
  return arr.reduce((acc, cond, i) => (cond === 'ideal' ? [...acc, i] : acc), [])
}

export function getClosure(circuit) {
  return CLOSURE_DATA[circuit.slug] ?? null
}

export function getClosureNote(closure, locale) {
  if (!closure) return ''
  if (locale === 'en') return closure.note_en ?? closure.note
  if (locale === 'mg') return closure.note_mg ?? closure.note
  return closure.note
}

export function isClosedInMonth(circuit, monthIndex) {
  const closure = getClosure(circuit)
  return closure ? closure.months.includes(monthIndex) : false
}

export function formatMonthRange(monthIndexes, locale = 'fr') {
  if (!monthIndexes.length) return ''
  const months = getMonths(locale)
  return monthIndexes.map((m) => months[m]).join(', ')
}
