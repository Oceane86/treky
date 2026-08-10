'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { guides as baseGuides } from '../data/circuits'
import { applyGuideOverrides } from '../utils/guideProfile'
import Icon from './Icon'
import './GuidesPreview.css'

export default function GuidesPreview() {
  const [guides, setGuides] = useState(baseGuides)

  useEffect(() => {
    setGuides(applyGuideOverrides(baseGuides))
  }, [])

  return (
    <section className="guides-preview section-padding" id="guides">
      <div className="container">
        <div className="guides-preview__header" data-reveal>
          <h2 className="section-title">Des guides qui font la différence</h2>
          <p className="section-subtitle guides-preview__subtitle">
            Chaque trek est mené par un guide certifié, natif de la région, qui connaît ses
            sentiers, sa faune et ses habitants mieux que quiconque.
          </p>
        </div>

        <div className="guides-preview__grid" data-reveal data-reveal-delay="1">
          {guides.map((guide) => (
            <div key={guide.id} className="guide-preview-card">
              <div className="guide-preview-card__image-wrap">
                <Image
                  src={guide.photo}
                  alt={guide.nom}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  unoptimized={guide.photo?.startsWith('data:')}
                  className="guide-preview-card__image"
                />
              </div>
              <div className="guide-preview-card__body">
                <div className="guide-preview-card__top">
                  <div>
                    <h3 className="guide-preview-card__name">{guide.nom}</h3>
                    {guide.localisation && (
                      <span className="guide-preview-card__lieu"><Icon name="pin" size={13} /> {guide.localisation}</span>
                    )}
                  </div>
                  <div className="guide-preview-card__rating">
                    <span className="guide-preview-card__star">★</span>
                    <span className="guide-preview-card__rating-value">{guide.note}</span>
                    <span className="guide-preview-card__reviews">({guide.nb_avis})</span>
                  </div>
                </div>

                <div className="guide-preview-card__tags">
                  {guide.specialites.map((s) => (
                    <span key={s} className="guide-preview-card__tag">{s}</span>
                  ))}
                </div>

                <p className="guide-preview-card__langues"><Icon name="globe" size={14} /> {guide.langues.join(' · ')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="guides-preview__cta-wrap" data-reveal data-reveal-delay="2">
          <Link href="/composer" className="btn-secondary">Trouver mon guide idéal</Link>
        </div>
      </div>
    </section>
  )
}
