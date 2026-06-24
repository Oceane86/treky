/**
 * Adapte un itinéraire complet à un nombre de jours disponibles.
 * Conserve toujours la première et la dernière étape, puis répartit
 * les étapes intermédiaires de façon équilibrée.
 */
export function adaptItinerary(steps, targetDays) {
  if (!steps?.length) return []
  if (targetDays >= steps.length) {
    return steps.map((step, i) => ({
      day: i + 1,
      title: step.title,
      description: step.description,
      originalDay: i + 1,
      adapted: false,
    }))
  }

  const indices = new Set([0, steps.length - 1])

  if (targetDays > 2) {
    const slots = targetDays - 2
    for (let i = 1; i <= slots; i++) {
      const idx = Math.round((i / (slots + 1)) * (steps.length - 1))
      indices.add(idx)
    }
  }

  const sorted = [...indices].sort((a, b) => a - b).slice(0, targetDays)

  return sorted.map((stepIndex, i) => ({
    day: i + 1,
    title: steps[stepIndex].title,
    description: steps[stepIndex].description,
    originalDay: stepIndex + 1,
    adapted: targetDays < steps.length,
  }))
}

export function adaptPrice(basePrice, recommendedDays, selectedDays) {
  if (selectedDays >= recommendedDays) return basePrice
  const ratio = selectedDays / recommendedDays
  return Math.round(basePrice * ratio)
}
