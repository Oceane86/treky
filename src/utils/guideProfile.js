// Fusionne les infos statiques d'un guide avec les modifications qu'il a
// enregistrées depuis son tableau de bord (src/app/guide/tableau-de-bord).
import { readJSON } from './storage'

function splitList(text) {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export function applyGuideOverride(baseGuide) {
  const saved = readJSON(`treky_guide_profile_${baseGuide.id}`, null)
  if (!saved) return baseGuide
  return {
    ...baseGuide,
    nom: saved.nom || baseGuide.nom,
    photo: saved.photo || baseGuide.photo,
    bio: saved.bio ?? baseGuide.bio,
    localisation: saved.localisation || baseGuide.localisation,
    langues: saved.langues_text ? splitList(saved.langues_text) : baseGuide.langues,
    specialites: saved.specialites_text ? splitList(saved.specialites_text) : baseGuide.specialites,
    certifications: saved.certifications_text ? splitList(saved.certifications_text) : baseGuide.certifications,
    video_url: saved.video_url || baseGuide.video_url,
  }
}

export function applyGuideOverrides(baseGuides) {
  return baseGuides.map(applyGuideOverride)
}
