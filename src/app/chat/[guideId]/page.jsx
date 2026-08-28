'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { guides } from '../../../data/circuits'
import { useAuth } from '../../../context/AuthContext'
import { useBooking } from '../../../context/BookingContext'
import { ensureConversation, getConversation, appendMessage, markTravelerRead } from '../../../utils/messages'
import Icon from '../../../components/Icon'
import '../../../pages/Chat.css'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const { guideId } = useParams()
  const numericGuideId = Number(guideId)
  const { user, isLoggedIn } = useAuth()
  const { booking } = useBooking()

  const guide = guides.find((g) => g.id === numericGuideId) ?? guides[0]
  const circuitName = booking?.circuit?.name ?? 'votre circuit'

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!isLoggedIn || !user?.email) return
    const traveler = { email: user.email, name: user.name, avatar: user.avatar ?? null }
    const greeting = [
      {
        id: 'greeting-1',
        from: 'guide',
        text: `Bonjour ! Je suis ${guide.nom}, votre guide pour ${circuitName}. Je suis ravi de vous accompagner dans cette aventure 🌿`,
        at: new Date().toISOString(),
      },
      {
        id: 'greeting-2',
        from: 'guide',
        text: `N'hésitez pas à me poser toutes vos questions sur l'itinéraire, l'équipement à prévoir, ou les conditions sur le terrain. Je suis là pour vous aider à préparer le meilleur trek possible !`,
        at: new Date().toISOString(),
      },
    ]
    const conv = ensureConversation(numericGuideId, traveler, booking?.circuit?.name ?? null, greeting)
    setMessages(conv.messages)
    markTravelerRead(numericGuideId, user.email)
  }, [isLoggedIn, user?.email, numericGuideId])

  // Si le guide répond depuis son espace (autre onglet du même navigateur), on suit la conversation.
  useEffect(() => {
    if (!user?.email) return
    function onStorage(e) {
      if (e.key !== 'treky_conversations') return
      const conv = getConversation(numericGuideId, user.email)
      if (conv) {
        setMessages(conv.messages)
        markTravelerRead(numericGuideId, user.email)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [user?.email, numericGuideId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || !user?.email) return

    const traveler = { email: user.email, name: user.name, avatar: user.avatar ?? null }
    const msg = { id: `u-${Date.now()}`, from: 'user', text, at: new Date().toISOString() }
    appendMessage(numericGuideId, traveler, booking?.circuit?.name ?? null, msg)
    setMessages((prev) => [...prev, msg])
    setInput('')
  }

  return (
    <div className="chat">

      <div className="chat__header">
        <Link href={booking?.circuit ? `/circuits/${booking.circuit.slug}` : '/circuits'} className="chat__back">
          ←
        </Link>
        <Image src={guide.photo} alt={guide.nom} width={44} height={44} className="chat__header-avatar" />
        <div className="chat__header-info">
          <h2 className="chat__header-name">{guide.nom}</h2>
          <span className="chat__header-status">
            <span className="chat__online-dot" />
            En ligne · Guide Treky
          </span>
        </div>
        <div className="chat__header-badge">
          <span>★ {guide.note}</span>
        </div>
      </div>

      {booking?.circuit && (
        <div className="chat__context-bar">
          <span><Icon name="route" size={16} /></span>
          <span>
            <strong>{booking.circuit.name}</strong>
            {booking.checkin && ` · Départ le ${new Date(booking.checkin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`}
          </span>
        </div>
      )}

      {booking?.guide?.id === numericGuideId && !booking.paid && (
        <Link href="/reservation/paiement" className="chat__continue-bar">
          <span>Prêt à réserver ? Continuez vers le paiement</span>
          <span className="chat__continue-bar-cta">Continuer →</span>
        </Link>
      )}

      <div className="chat__messages">
        <div className="chat__date-divider">Aujourd'hui</div>

        {messages.map((msg) => {
          const isUser = msg.from === 'user'
          return (
            <div key={msg.id} className={`chat__bubble-wrap ${isUser ? 'chat__bubble-wrap--user' : ''}`}>
              {!isUser && (
                <Image src={guide.photo} alt={guide.nom} width={32} height={32} className="chat__bubble-avatar" />
              )}
              <div className={`chat__bubble ${isUser ? 'chat__bubble--user' : 'chat__bubble--guide'}`}>
                <p>{msg.text}</p>
                <span className="chat__bubble-time">{formatTime(msg.at)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {isLoggedIn ? (
        <form className="chat__input-bar" onSubmit={sendMessage}>
          <input
            type="text"
            className="chat__input"
            placeholder="Écrire un message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="chat__send-btn" disabled={!input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      ) : (
        <div className="chat__login-bar">
          <span>Connectez-vous pour discuter avec {guide.nom}.</span>
          <Link href="/connexion" className="chat__login-cta">Se connecter →</Link>
        </div>
      )}
    </div>
  )
}
