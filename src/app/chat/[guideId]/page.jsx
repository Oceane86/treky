'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { guides } from '../../../data/circuits'
import { useAuth } from '../../../context/AuthContext'
import { useBooking } from '../../../context/BookingContext'
import '../../../pages/Chat.css'

function now() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const { guideId } = useParams()
  const { user } = useAuth()
  const { booking } = useBooking()

  const guide = guides.find((g) => g.id === Number(guideId)) ?? guides[0]
  const circuitName = booking?.circuit?.name ?? 'votre circuit'

  const initialMessages = [
    {
      id: 1,
      from: 'guide',
      text: `Bonjour ! Je suis ${guide.nom}, votre guide pour ${circuitName}. Je suis ravi de vous accompagner dans cette aventure 🌿`,
      time: '09:00',
    },
    {
      id: 2,
      from: 'guide',
      text: `N'hésitez pas à me poser toutes vos questions sur l'itinéraire, l'équipement à prévoir, ou les conditions sur le terrain. Je suis là pour vous aider à préparer le meilleur trek possible !`,
      time: '09:01',
    },
  ]

  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    const userMsg = { id: Date.now(), from: 'user', text, time: now() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const replies = [
        `Bonne question ! Je vous prépare un briefing complet la veille du départ.`,
        `Absolument, c'est bien prévu dans l'itinéraire. Vous verrez, c'est magnifique !`,
        `Pour l'équipement, pensez à des chaussures de randonnée montantes et une veste imperméable.`,
        `La meilleure période est la saison sèche. Vous avez fait le bon choix de dates !`,
        `Je confirme, on se retrouve au point de départ à 7h. Je serai là avec tout le matériel.`,
      ]
      const reply = replies[Math.floor(Math.random() * replies.length)]
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, from: 'guide', text: reply, time: now() },
      ])
    }, 1000 + Math.random() * 800)
  }

  return (
    <div className="chat">

      <div className="chat__header">
        <Link href={booking?.circuit ? `/circuits/${booking.circuit.slug}` : '/circuits'} className="chat__back">
          ←
        </Link>
        <img src={guide.photo} alt={guide.nom} className="chat__header-avatar" />
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
          <span>📋</span>
          <span>
            <strong>{booking.circuit.name}</strong>
            {booking.checkin && ` · Départ le ${new Date(booking.checkin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`}
          </span>
        </div>
      )}

      <div className="chat__messages">
        <div className="chat__date-divider">Aujourd'hui</div>

        {messages.map((msg) => {
          const isUser = msg.from === 'user'
          return (
            <div key={msg.id} className={`chat__bubble-wrap ${isUser ? 'chat__bubble-wrap--user' : ''}`}>
              {!isUser && (
                <img src={guide.photo} alt={guide.nom} className="chat__bubble-avatar" />
              )}
              <div className={`chat__bubble ${isUser ? 'chat__bubble--user' : 'chat__bubble--guide'}`}>
                <p>{msg.text}</p>
                <span className="chat__bubble-time">{msg.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

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
    </div>
  )
}
