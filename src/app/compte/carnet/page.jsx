'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import { readJSON, writeJSON } from '../../../utils/storage'
import Icon from '../../../components/Icon'
import '../../../pages/Page.css'
import '../../../pages/Journal.css'

const BOOKING_ID = 'TRK-2026-0042'
const TREK_DAYS = 4
const CIRCUIT_NAME = 'Trek Découverte Isalo'
const STORAGE_KEY = `treky_journal_${BOOKING_ID}`

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
      {photo && <img src={photo} alt="Aperçu" className="journal__photo-preview" />}
    </form>
  )
}

export default function CarnetPage() {
  const { isLoggedIn, user } = useAuth()
  const [entries, setEntries] = useState([])
  const [online, setOnline] = useState(true)
  const [syncToast, setSyncToast] = useState(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setEntries(readJSON(STORAGE_KEY, []))
    setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
    setHydrated(true)

    function handleOnline() {
      setOnline(true)
      setEntries((prev) => {
        const pending = prev.filter((e) => !e.synced).length
        if (pending === 0) return prev
        const next = prev.map((e) => ({ ...e, synced: true }))
        writeJSON(STORAGE_KEY, next)
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
  }, [])

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
      writeJSON(STORAGE_KEY, next)
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

  const days = Array.from({ length: TREK_DAYS }, (_, i) => i + 1)
  const completed = entries.length

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Mon compte · {user?.name}</p>
          <h1 className="page-hero__title">Carnet de trek</h1>
          <p className="page-hero__subtitle">
            {CIRCUIT_NAME} — une réflexion chaque soir, jour après jour.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container journal">

          {hydrated && !online && (
            <div className="journal__offline-banner">
              <Icon name="wifiOff" size={16} /> Vous êtes hors ligne — vos entrées restent accessibles et seront synchronisées automatiquement à la reconnexion.
            </div>
          )}
          {syncToast && <div className="journal__sync-toast">✓ {syncToast}</div>}

          <div className="journal__progress">
            <div className="journal__progress-bar">
              <div className="journal__progress-fill" style={{ width: `${(completed / TREK_DAYS) * 100}%` }} />
            </div>
            <span className="journal__progress-label">{completed} / {TREK_DAYS} jours documentés</span>
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
                        <img src={entry.photo_url} alt={`Jour ${day}`} className="journal__entry-photo" />
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

          {completed === TREK_DAYS && (
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
