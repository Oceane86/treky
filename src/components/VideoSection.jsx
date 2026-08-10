'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import './VideoSection.css'

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const { locale } = useLocale()
  const t = getUI(locale).home

  return (
    <section className="video-section" id="explorer">
      {/* Banderole titre + bouton */}
      <div className="video-section__strip" data-reveal>
        <div className="container video-section__strip-inner">
          <h2 className="video-section__title">{t.videoTitle}</h2>
          <a href="#circuits" className="btn-primary video-section__cta">
            {t.videoCta}
          </a>
        </div>
      </div>

      {/* Image pleine largeur avec bouton play */}
      <div className="video-section__media">
        <Image
          src="/images/video-thumb.jpg"
          alt="Explorer Madagascar - Baobabs"
          fill
          sizes="100vw"
          className="video-section__bg"
        />
        <div className="video-section__overlay"></div>

        {isPlaying ? (
          <div className="video-section__player">
            <video
              src="/videos/treky-promo.mp4"
              autoPlay
              controls
              className="video-section__video"
            />
            <button
              className="video-section__close"
              onClick={() => setIsPlaying(false)}
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            className="video-section__play"
            onClick={() => setIsPlaying(true)}
            aria-label="Lire la vidéo"
          >
            <span className="video-section__play-icon">▶</span>
          </button>
        )}
      </div>
    </section>
  )
}
