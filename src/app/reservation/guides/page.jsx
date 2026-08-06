'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { guides as baseGuides } from '../../../data/circuits'
import { useBooking } from '../../../context/BookingContext'
import { applyGuideOverrides } from '../../../utils/guideProfile'
import '../../../pages/GuideSelection.css'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

export default function GuideSelectionPage() {
  const { booking, setBooking } = useBooking()
  const router = useRouter()
  const [guides, setGuides] = useState(baseGuides)

  useEffect(() => {
    if (!booking) router.replace('/circuits')
  }, [booking, router])

  useEffect(() => {
    setGuides(applyGuideOverrides(baseGuides))
  }, [])

  if (!booking) return null

  const availableGuides = guides.filter((g) =>
    !booking.guide_ids || booking.guide_ids.includes(g.id)
  )

  function chooseGuide(guide) {
    setBooking({ ...booking, guide: { id: guide.id, nom: guide.nom, photo: guide.photo, note: guide.note } })
    router.push('/reservation/confirmation')
  }

  return (
    <div className="guide-sel">
      <div className="guide-sel__hero">
        <p className="guide-sel__eyebrow">Étape finale</p>
        <h1 className="guide-sel__title">Choisissez votre guide</h1>
        <p className="guide-sel__subtitle">
          Guides disponibles du {formatDate(booking.checkin)} au {formatDate(booking.checkout)} · {booking.circuit.name}
        </p>
      </div>

      <div className="container guide-sel__body">
        <div className="guide-sel__grid">
          {availableGuides.map((guide) => (
            <div key={guide.id} className="guide-sel__card">
              <div className="guide-sel__card-top">
                <Image
                  src={guide.photo}
                  alt={guide.nom}
                  width={60}
                  height={60}
                  unoptimized={guide.photo?.startsWith('data:')}
                  className="guide-sel__avatar"
                />
                <div className="guide-sel__info">
                  <h3 className="guide-sel__name">{guide.nom}</h3>
                  <div className="guide-sel__rating">
                    <span className="guide-sel__star">★</span>
                    <span className="guide-sel__note">{guide.note}</span>
                    <span className="guide-sel__reviews">({guide.nb_avis} avis)</span>
                  </div>
                  {guide.localisation && (
                    <span className="guide-sel__lieu">📍 {guide.localisation}</span>
                  )}
                </div>
                <span className="guide-sel__available-dot" title="Disponible">●</span>
              </div>

              <div className="guide-sel__specialites">
                {guide.specialites.map((s) => (
                  <span key={s} className="guide-sel__tag">{s}</span>
                ))}
              </div>

              <div className="guide-sel__langues">
                <span className="guide-sel__langues-label">Langues</span>
                <span className="guide-sel__langues-val">{guide.langues.join(' · ')}</span>
              </div>

              <button className="btn-primary guide-sel__choose-btn" onClick={() => chooseGuide(guide)}>
                Choisir ce guide →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
