export function adaptItinerary(steps, targetDays) {
  if (!steps?.length) return []

  const n = steps.length

  // ── Condensé : moins de jours que d'étapes ──────────────────────────────
  if (targetDays < n) {
    const indices = new Set([0, n - 1])
    if (targetDays > 2) {
      const slots = targetDays - 2
      for (let i = 1; i <= slots; i++) {
        indices.add(Math.round((i / (slots + 1)) * (n - 1)))
      }
    }
    const sorted = [...indices].sort((a, b) => a - b).slice(0, targetDays)
    return sorted.map((idx, i) => ({
      day: i + 1,
      ...steps[idx],
      originalDay: idx + 1,
      adapted: true,
      extra: false,
    }))
  }

  // ── Exact ────────────────────────────────────────────────────────────────
  if (targetDays === n) {
    return steps.map((step, i) => ({
      day: i + 1,
      ...step,
      originalDay: i + 1,
      adapted: false,
      extra: false,
    }))
  }

  // ── Étendu : plus de jours que d'étapes ─────────────────────────────────
  const extraCount = targetDays - n
  const base = steps.map((step, i) => ({
    ...step,
    originalDay: i + 1,
    adapted: false,
    extra: false,
  }))

  // Positions d'insertion (indices dans le tableau base, hors dernière étape)
  const positions = []
  for (let i = 1; i <= extraCount; i++) {
    const pos = Math.round(i * (n - 1) / (extraCount + 1))
    positions.push(Math.max(1, Math.min(pos, n - 1)))
  }
  // Trier décroissant pour éviter le décalage d'index à l'insertion
  positions.sort((a, b) => b - a)

  for (const pos of positions) {
    const refStep = base[pos - 1]
    base.splice(pos, 0, {
      title: 'Journée libre · Exploration',
      description: "Journée flexible pour explorer les environs à votre rythme, profiter des équipements du lodge ou choisir une activité optionnelle proposée par votre guide.",
      lodge: refStep?.lodge ?? null,
      typeHebergement: refStep?.typeHebergement ?? null,
      activities: ['Exploration libre', 'Activité optionnelle au choix', 'Repos et détente'],
      originalDay: null,
      adapted: true,
      extra: true,
    })
  }

  return base.map((item, i) => ({ ...item, day: i + 1 }))
}

export function adaptPrice(basePrice, recommendedDays, selectedDays) {
  return Math.round(basePrice * selectedDays / recommendedDays)
}
