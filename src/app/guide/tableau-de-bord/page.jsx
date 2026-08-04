'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { guides as guidesData } from '../../../data/circuits'
import { readJSON, writeJSON } from '../../../utils/storage'
import '../../../pages/Page.css'
import '../../../pages/GuideDashboard.css'

const TABS = [
  { id: 'profil', label: 'Profil', icon: '👤' },
  { id: 'dispo', label: 'Disponibilités', icon: '📅' },
  { id: 'reservations', label: 'Réservations', icon: '📋' },
  { id: 'avis', label: 'Avis reçus', icon: '⭐' },
]

const DAYS_OF_WEEK = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di']

const DEMO_BOOKINGS = [
  { id: 'TRK-2026-0042', circuit: 'Trek Découverte Isalo', traveler: 'Océane Rakotomalala', dates: '15 → 19 juillet 2026', statut: 'Terminée', prix: '2 000 000 Ar' },
  { id: 'TRK-2026-0031', circuit: 'Trek Immersion Andringitra', traveler: 'Léa Fontaine', dates: '3 → 8 septembre 2026', statut: 'Confirmée', prix: '3 500 000 Ar' },
  { id: 'TRK-2026-0019', circuit: 'Dédale des Tsingy', traveler: 'Marco Bianchi', dates: '10 → 17 mai 2026', statut: 'Terminée', prix: '6 000 000 Ar' },
]

function monthLabel(date) {
  const label = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function buildMonthDays(year, month) {
  const days = []
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7 // lundi en premier
  for (let i = 0; i < startOffset; i++) days.push(null)
  const total = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= total; d++) days.push(new Date(year, month, d))
  return days
}

function isoDate(date) { return date.toISOString().split('T')[0] }

export default function GuideDashboardPage() {
  const router = useRouter()
  const { user, isGuide, authReady, logout } = useAuth()
  const [tab, setTab] = useState('profil')
  const [profile, setProfile] = useState(null)
  const [saved, setSaved] = useState(false)
  const [availability, setAvailability] = useState({})
  const [reviews, setReviews] = useState([])
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    if (!isGuide || !user) return
    const base = guidesData.find((g) => g.id === user.guideId) ?? guidesData[0]
    const stored = readJSON(`treky_guide_profile_${user.guideId}`, null)
    setProfile(
      stored ?? {
        ...base,
        langues_text: base.langues.join(', '),
        specialites_text: base.specialites.join(', '),
        certifications_text: (base.certifications ?? []).join(', '),
      }
    )
    setAvailability(readJSON(`treky_guide_availability_${user.guideId}`, {}))
    setReviews(readJSON('treky_reviews', []).filter((r) => r.guide_id === user.guideId))
  }, [isGuide, user])

  useEffect(() => {
    if (authReady && !isGuide) router.replace('/guide/connexion')
  }, [authReady, isGuide, router])

  if (!isGuide || !profile) return null

  function saveProfile(e) {
    e.preventDefault()
    writeJSON(`treky_guide_profile_${user.guideId}`, profile)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setProfile((p) => ({ ...p, photo: reader.result }))
    reader.readAsDataURL(file)
  }

  function toggleDay(iso) {
    setAvailability((prev) => {
      const next = { ...prev, [iso]: prev[iso] === 'indisponible' ? 'disponible' : 'indisponible' }
      writeJSON(`treky_guide_availability_${user.guideId}`, next)
      return next
    })
  }

  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const days = buildMonthDays(viewDate.getFullYear(), viewDate.getMonth())
  const avgReview = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="page guide-dash">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Espace guide</p>
          <h1 className="page-hero__title">Bonjour, {user.name.split(' ')[0]}</h1>
          <p className="page-hero__subtitle">Gérez votre profil, vos disponibilités et vos réservations.</p>
        </div>
      </header>

      <div className="container guide-dash__body">
        <nav className="guide-dash__tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`guide-dash__tab ${tab === t.id ? 'guide-dash__tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
          <button className="guide-dash__tab guide-dash__tab--logout" onClick={() => { logout(); router.push('/') }}>
            <span>↪</span> Déconnexion
          </button>
        </nav>

        <div className="guide-dash__panel">

          {tab === 'profil' && (
            <form className="guide-dash__profile-form" onSubmit={saveProfile}>
              <div className="guide-dash__profile-top">
                <img src={profile.photo} alt={profile.nom} className="guide-dash__avatar" />
                <label className="guide-dash__photo-btn">
                  Changer la photo
                  <input type="file" accept="image/*" onChange={handlePhoto} hidden />
                </label>
              </div>

              <div className="guide-dash__field">
                <label>Nom</label>
                <input
                  type="text"
                  value={profile.nom}
                  onChange={(e) => setProfile((p) => ({ ...p, nom: e.target.value }))}
                />
              </div>

              <div className="guide-dash__field">
                <label>Bio</label>
                <textarea
                  rows={4}
                  value={profile.bio ?? ''}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                />
              </div>

              <div className="guide-dash__field-row">
                <div className="guide-dash__field">
                  <label>Langues parlées</label>
                  <input
                    type="text"
                    value={profile.langues_text}
                    onChange={(e) => setProfile((p) => ({ ...p, langues_text: e.target.value }))}
                    placeholder="Français, Malgache, Anglais"
                  />
                </div>
                <div className="guide-dash__field">
                  <label>Spécialités</label>
                  <input
                    type="text"
                    value={profile.specialites_text}
                    onChange={(e) => setProfile((p) => ({ ...p, specialites_text: e.target.value }))}
                    placeholder="Aventure, Faune endémique"
                  />
                </div>
              </div>

              <div className="guide-dash__field">
                <label>Certifications</label>
                <input
                  type="text"
                  value={profile.certifications_text}
                  onChange={(e) => setProfile((p) => ({ ...p, certifications_text: e.target.value }))}
                  placeholder="Guide haute montagne FFME, Premiers secours"
                />
              </div>

              <div className="guide-dash__field">
                <label>Vidéo de présentation (lien)</label>
                <input
                  type="text"
                  value={profile.video_url ?? ''}
                  onChange={(e) => setProfile((p) => ({ ...p, video_url: e.target.value }))}
                  placeholder="https://…"
                />
              </div>

              <div className="guide-dash__save-row">
                <button type="submit" className="btn-primary guide-dash__save-btn">Enregistrer le profil</button>
                {saved && <span className="guide-dash__saved">✓ Profil mis à jour</span>}
              </div>
            </form>
          )}

          {tab === 'dispo' && (
            <div className="guide-dash__calendar">
              <div className="guide-dash__calendar-header">
                <button type="button" onClick={() => setMonthOffset((m) => m - 1)}>‹</button>
                <span>{monthLabel(viewDate)}</span>
                <button type="button" onClick={() => setMonthOffset((m) => m + 1)}>›</button>
              </div>
              <div className="guide-dash__calendar-legend">
                <span><i className="guide-dash__dot guide-dash__dot--dispo" /> Disponible</span>
                <span><i className="guide-dash__dot guide-dash__dot--indispo" /> Indisponible</span>
              </div>
              <div className="guide-dash__calendar-grid">
                {DAYS_OF_WEEK.map((d) => (
                  <span key={d} className="guide-dash__calendar-dow">{d}</span>
                ))}
                {days.map((d, i) => {
                  if (!d) return <span key={`empty-${i}`} className="guide-dash__calendar-empty" />
                  const iso = isoDate(d)
                  const status = availability[iso] === 'indisponible' ? 'indispo' : 'dispo'
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={`guide-dash__calendar-day guide-dash__calendar-day--${status}`}
                      onClick={() => toggleDay(iso)}
                    >
                      {d.getDate()}
                    </button>
                  )
                })}
              </div>
              <p className="guide-dash__calendar-hint">Cliquez sur un jour pour basculer sa disponibilité.</p>
            </div>
          )}

          {tab === 'reservations' && (
            <div className="guide-dash__bookings">
              {DEMO_BOOKINGS.map((b) => (
                <div key={b.id} className="guide-dash__booking-card">
                  <div>
                    <p className="guide-dash__booking-circuit">{b.circuit}</p>
                    <p className="guide-dash__booking-meta">Réf. {b.id} · {b.traveler}</p>
                    <p className="guide-dash__booking-meta">{b.dates}</p>
                  </div>
                  <div className="guide-dash__booking-right">
                    <span
                      className={`guide-dash__booking-statut guide-dash__booking-statut--${
                        b.statut === 'Terminée' ? 'done' : 'confirmed'
                      }`}
                    >
                      {b.statut}
                    </span>
                    <span className="guide-dash__booking-prix">{b.prix}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'avis' && (
            <div className="guide-dash__reviews">
              {avgReview && (
                <div className="guide-dash__reviews-avg">
                  <span className="guide-dash__reviews-avg-val">{avgReview}</span>
                  <span>★ note moyenne sur {reviews.length} avis reçus</span>
                </div>
              )}
              {reviews.length === 0 ? (
                <p className="guide-dash__reviews-empty">Aucun avis reçu pour le moment.</p>
              ) : (
                reviews.map((r) => (
                  <div key={r._id} className="guide-dash__review-card">
                    <div className="guide-dash__review-top">
                      <span>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span className="guide-dash__review-date">{new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="guide-dash__review-transfo">« {r.transformation_note} »</p>
                    {r.comment && <p className="guide-dash__review-comment">{r.comment}</p>}
                    <span className="guide-dash__review-author">— {r.traveler_name}, {r.circuit_name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
