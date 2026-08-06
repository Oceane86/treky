'use client'
import Link from 'next/link'
import { guides } from '../data/circuits'
import './GuidesPreview.css'

export default function GuidesPreview() {
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
                <img src={guide.photo} alt={guide.nom} className="guide-preview-card__image" />
              </div>
              <div className="guide-preview-card__body">
                <div className="guide-preview-card__top">
                  <div>
                    <h3 className="guide-preview-card__name">{guide.nom}</h3>
                    {guide.localisation && (
                      <span className="guide-preview-card__lieu">📍 {guide.localisation}</span>
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

                <p className="guide-preview-card__langues">🗣️ {guide.langues.join(' · ')}</p>
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
