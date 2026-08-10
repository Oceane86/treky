// Climat, meilleures périodes et fermetures de sites — source unique utilisée par la
// fiche circuit et le formulaire d'envies (matching + avertissements de fermeture).

export const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
export const MONTHS_FULL = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

export const CLIMAT_MAP = {
  seche:         ['avoid', 'avoid', 'avoid', 'ok', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ok', 'avoid'],
  'toute-saison': ['ok', 'ok', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ok'],
  baleines:      ['ok', 'ok', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ideal', 'ok'],
}

export const CLIMAT_ICON = { ideal: 'sun', ok: 'cloud', avoid: 'cloudRain' }
export const CLIMAT_LABEL = { ideal: 'Idéal', ok: 'Correct', avoid: 'Déconseillé' }

// Fermetures réelles ou quasi-officielles de sites pendant la saison des pluies —
// utilisées pour avertir le voyageur avant qu'il ne fixe des dates.
export const CLOSURE_DATA = {
  'dedale-tsingy': {
    months: [12, 1, 2, 3, 4],
    note: "Le parc des Tsingy de Bemaraha ferme aux visiteurs en saison des pluies : les pistes depuis Morondava deviennent impraticables.",
  },
  'makay-traversee': {
    months: [12, 1, 2, 3, 4, 5],
    note: "Le massif du Makay est inaccessible en saison des pluies : les rivières en crue empêchent toute traversée.",
  },
  'traversee-nord-sud': {
    months: [12, 1, 2, 3],
    note: "La traversée intégrale n'est pas praticable en saison des pluies : plusieurs portions (Ankarana, Andringitra) deviennent inaccessibles.",
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

export function isClosedInMonth(circuit, monthIndex) {
  const closure = getClosure(circuit)
  return closure ? closure.months.includes(monthIndex) : false
}

export function formatMonthRange(monthIndexes) {
  if (!monthIndexes.length) return ''
  return monthIndexes.map((m) => MONTHS[m]).join(', ')
}
