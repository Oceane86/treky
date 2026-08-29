'use client'
import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { readJSON, writeJSON } from '../../../utils/storage'
import Icon from '../../../components/Icon'
import '../../../pages/Page.css'
import '../../../pages/Journal.css'

const DEMO_RESERVATION = {
  id: 'TRK-2026-0042',
  circuit: 'Trek Découverte Isalo',
  duree: '4 jours',
}

function parseDuree(duree) {
  const n = parseInt(duree, 10)
  return Number.isFinite(n) && n > 0 ? n : 4
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function DayEntryForm({ dayNumber, onSave }) {
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState(null)

  async function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(await fileToDataUrl(file))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSave({ day_number: dayNumber, text: text.trim(), photo_url: photo })
  }

  return (
    <form className="journal__form" onSubmit={handleSubmit}>
      <textarea
        className="journal__textarea"
        placeholder="Qu'avez-vous vécu aujourd'hui ? Une rencontre, un effort, une émotion…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <div className="journal__form-row">
        <label className="journal__photo-btn">
          <Icon name="camera" size={16} /> {photo ? 'Changer la photo' : 'Ajouter une photo'}
          <input type="file" accept="image/*" onChange={handlePhoto} hidden />
        </label>
        <button type="submit" className="btn-primary journal__save-btn" disabled={!text.trim()}>
          Enregistrer l'entrée
        </button>
      </div>
      {photo && <img src={photo} alt="Aperçu" className="journal__photo-preview" loading="lazy" />}
    </form>
  )
}

function CarnetContent() {
  const { isLoggedIn, user } = useAuth()
  const searchParams = useSearchParams()
  const [reservations, setReservations] = useState([DEMO_RESERVATION])
  const [selectedId, setSelectedId] = useState(null)
  const [entries, setEntries] = useState([])
  const [online, setOnline] = useState(true)
  const [syncToast, setSyncToast] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readJSON('treky_reservations', [])
    const all = [...stored, DEMO_RESERVATION]
    setReservations(all)
    const requestedId = searchParams.get('id')
    const match = all.find((r) => r.id === requestedId)
    setSelectedId(match ? match.id : all[0].id)
  }, [searchParams])

  const reservation = reservations.find((r) => r.id === selectedId) ?? reservations[0]
  const storageKey = `treky_journal_${reservation.id}`
  const trekDays = parseDuree(reservation.duree)

  useEffect(() => {
    setEntries(readJSON(storageKey, []))
    setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
    setHydrated(true)

    function handleOnline() {
      setOnline(true)
      setEntries((prev) => {
        const pending = prev.filter((e) => !e.synced).length
        if (pending === 0) return prev
        const next = prev.map((e) => ({ ...e, synced: true }))
        writeJSON(storageKey, next)
        setSyncToast(`${pending} entrée${pending > 1 ? 's' : ''} synchronisée${pending > 1 ? 's' : ''}`)
        setTimeout(() => setSyncToast(null), 3500)
        return next
      })
    }
    function handleOffline() { setOnline(false) }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [storageKey])

  function saveEntry({ day_number, text, photo_url }) {
    const entry = {
      day_number,
      text,
      photo_url,
      created_at: new Date().toISOString(),
      synced: typeof navigator !== 'undefined' ? navigator.onLine : true,
    }
    setEntries((prev) => {
      const next = [...prev.filter((e) => e.day_number !== day_number), entry].sort(
        (a, b) => a.day_number - b.day_number
      )
      writeJSON(storageKey, next)
      return next
    })
  }

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="resa-gate">
          <div className="resa-gate__icon"><Icon name="lock" size={40} /></div>
          <h2>Connexion requise</h2>
          <p>Connectez-vous pour accéder à votre carnet de trek.</p>
          <Link href="/connexion" className="btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  const days = Array.from({ length: trekDays }, (_, i) => i + 1)
  const completed = entries.length

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Mon compte · {user?.name}</p>
          <h1 className="page-hero__title">Carnet de trek</h1>
          <p className="page-hero__subtitle">
            {reservation.circuit} — une réflexion chaque soir, jour après jour.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container journal">

          {reservations.length > 1 && (
            <div className="journal__trek-switcher">
              {reservations.map((r) => (
                <Link
                  key={r.id}
                  href={`/compte/carnet?id=${r.id}`}
                  className={`journal__trek-chip ${r.id === reservation.id ? 'journal__trek-chip--active' : ''}`}
                >
                  {r.circuit}
                </Link>
              ))}
            </div>
          )}

          {hydrated && !online && (
            <div className="journal__offline-banner">
              <Icon name="wifiOff" size={16} /> Vous êtes hors ligne — vos entrées restent accessibles et seront synchronisées automatiquement à la reconnexion.
            </div>
          )}
          {syncToast && <div className="journal__sync-toast">✓ {syncToast}</div>}

          <div className="journal__progress">
            <div className="journal__progress-bar">
              <div className="journal__progress-fill" style={{ width: `${(completed / trekDays) * 100}%` }} />
            </div>
            <span className="journal__progress-label">{completed} / {trekDays} jours documentés</span>
          </div>

          <div className="journal__days">
            {days.map((day) => {
              const entry = entries.find((e) => e.day_number === day)
              return (
                <div key={day} className="journal__day-card">
                  <div className="journal__day-header">
                    <span className="journal__day-badge">Soir {day}</span>
                    {entry && (
                      <span
                        className={`journal__sync-badge ${
                          entry.synced ? 'journal__sync-badge--ok' : 'journal__sync-badge--pending'
                        }`}
                      >
                        {entry.synced ? (
                          '✓ Synchronisé'
                        ) : (
                          <><Icon name="clock" size={12} /> En attente de synchronisation</>
                        )}
                      </span>
                    )}
                  </div>
                  {entry ? (
                    <div className="journal__entry">
                      {entry.photo_url && (
                        <img src={entry.photo_url} alt={`Jour ${day}`} className="journal__entry-photo" loading="lazy" />
                      )}
                      <p className="journal__entry-text">{entry.text}</p>
                      <span className="journal__entry-date">
                        {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ) : (
                    <DayEntryForm dayNumber={day} onSave={saveEntry} />
                  )}
                </div>
              )
            })}
          </div>

          {completed === trekDays && (
            <div className="journal__complete-cta">
              <h3>Votre carnet est complet <Icon name="sparkles" size={18} /></h3>
              <p>Relisez votre cheminement, puis partagez en quoi ce trek vous a changé.</p>
              <Link href="/compte/avis" className="btn-primary">Laisser mon avis final →</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function CarnetPage() {
  return (
    <Suspense fallback={null}>
      <CarnetContent />
    </Suspense>
  )
}
