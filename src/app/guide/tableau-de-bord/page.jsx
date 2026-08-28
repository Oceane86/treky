'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { guides as guidesData } from '../../../data/circuits'
import { readJSON, writeJSON } from '../../../utils/storage'
import { getConversationsForGuide, appendMessage, markGuideRead } from '../../../utils/messages'
import Icon from '../../../components/Icon'
import '../../../pages/Page.css'
import '../../../pages/GuideDashboard.css'

const TABS = [
  { id: 'profil', label: 'Profil', icon: 'user' },
  { id: 'dispo', label: 'Disponibilités', icon: 'calendar' },
  { id: 'reservations', label: 'Réservations', icon: 'route' },
  { id: 'messages', label: 'Messages', icon: 'chat' },
  { id: 'avis', label: 'Avis reçus', icon: 'star' },
]

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

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
  const [bookings, setBookings] = useState(DEMO_BOOKINGS)
  const [monthOffset, setMonthOffset] = useState(0)
  const [conversations, setConversations] = useState([])
  const [selectedConvId, setSelectedConvId] = useState(null)
  const [reply, setReply] = useState('')

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

    const realBookings = readJSON('treky_reservations', [])
      .filter((r) => r.guideId === user.guideId)
      .map((r) => ({
        id: r.id,
        circuit: r.circuit,
        traveler: r.traveler ?? 'Voyageur',
        dates: r.dateDepart,
        statut: r.statut,
        prix: r.prix,
      }))
    setBookings([...realBookings, ...DEMO_BOOKINGS])

    setConversations(getConversationsForGuide(user.guideId))
  }, [isGuide, user])

  // Un voyageur peut écrire pendant que le guide est sur le dashboard (autre onglet) :
  // on garde la liste et le fil ouvert à jour.
  useEffect(() => {
    if (!user?.guideId) return
    function onStorage(e) {
      if (e.key !== 'treky_conversations') return
      setConversations(getConversationsForGuide(user.guideId))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [user?.guideId])

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

  function selectConversation(convId) {
    setSelectedConvId(convId)
    const conv = conversations.find((c) => c.id === convId)
    if (conv?.guideUnread) {
      markGuideRead(user.guideId, conv.travelerEmail)
      setConversations(getConversationsForGuide(user.guideId))
    }
  }

  function sendReply(e) {
    e.preventDefault()
    const text = reply.trim()
    const conv = conversations.find((c) => c.id === selectedConvId)
    if (!text || !conv) return
    const msg = { id: `g-${Date.now()}`, from: 'guide', text, at: new Date().toISOString() }
    appendMessage(
      user.guideId,
      { email: conv.travelerEmail, name: conv.travelerName, avatar: conv.travelerAvatar },
      conv.circuitName,
      msg
    )
    setConversations(getConversationsForGuide(user.guideId))
    setReply('')
  }

  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const days = buildMonthDays(viewDate.getFullYear(), viewDate.getMonth())
  const avgReview = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null
  const selectedConv = conversations.find((c) => c.id === selectedConvId) ?? null
  const unreadCount = conversations.filter((c) => c.guideUnread).length

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
              <span><Icon name={t.icon} size={15} /></span> {t.label}
              {t.id === 'messages' && unreadCount > 0 && (
                <span className="guide-dash__tab-badge">{unreadCount}</span>
              )}
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
                <Image
                  src={profile.photo}
                  alt={profile.nom}
                  width={72}
                  height={72}
                  unoptimized={profile.photo?.startsWith('data:')}
                  className="guide-dash__avatar"
                />
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

              <div className="guide-dash__field">
                <label>Localisation</label>
                <input
                  type="text"
                  value={profile.localisation ?? ''}
                  onChange={(e) => setProfile((p) => ({ ...p, localisation: e.target.value }))}
                  placeholder="Ville / région où vous guidez"
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
              {bookings.map((b) => (
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

          {tab === 'messages' && (
            <div className="guide-dash__messages">
              <div className="guide-dash__conv-list">
                {conversations.length === 0 ? (
                  <p className="guide-dash__messages-empty">Aucune conversation pour le moment.</p>
                ) : (
                  conversations.map((c) => {
                    const last = c.messages[c.messages.length - 1]
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`guide-dash__conv-item ${selectedConvId === c.id ? 'guide-dash__conv-item--active' : ''}`}
                        onClick={() => selectConversation(c.id)}
                      >
                        <span className="guide-dash__conv-name">
                          {c.travelerName}
                          {c.guideUnread && <span className="guide-dash__conv-dot" />}
                        </span>
                        {c.circuitName && <span className="guide-dash__conv-circuit">{c.circuitName}</span>}
                        {last && <span className="guide-dash__conv-preview">{last.text}</span>}
                      </button>
                    )
                  })
                )}
              </div>

              <div className="guide-dash__conv-thread">
                {selectedConv ? (
                  <>
                    <div className="guide-dash__thread-header">
                      <strong>{selectedConv.travelerName}</strong>
                      {selectedConv.circuitName && <span>{selectedConv.circuitName}</span>}
                    </div>
                    <div className="guide-dash__thread-messages">
                      {selectedConv.messages.map((m) => (
                        <div
                          key={m.id}
                          className={`guide-dash__thread-bubble guide-dash__thread-bubble--${m.from === 'guide' ? 'me' : 'them'}`}
                        >
                          <p>{m.text}</p>
                          <span>{formatTime(m.at)}</span>
                        </div>
                      ))}
                    </div>
                    <form className="guide-dash__thread-input" onSubmit={sendReply}>
                      <input
                        type="text"
                        placeholder="Répondre…"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        autoComplete="off"
                      />
                      <button type="submit" disabled={!reply.trim()}>Envoyer</button>
                    </form>
                  </>
                ) : (
                  <p className="guide-dash__messages-empty">Sélectionnez une conversation.</p>
                )}
              </div>
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
