// Petits helpers localStorage — persistance mockée en attendant un vrai backend.

export function readJSON(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function removeJSON(key) {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch {}
}
