'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import './Hero.css'

export default function Hero() {
  const { locale } = useLocale()
  const t = getUI(locale).home

  return (
    <section className="hero">
      <div className="hero__bg">
        <Image
          src="/images/hero-bg.jpg"
          alt="Paysage de Madagascar"
          fill
          sizes="100vw"
          priority
          className="hero__bg-img"
        />
        <div className="hero__overlay"></div>
      </div>

      <div className="hero__content container">
        <span className="hero__eyebrow">{t.heroEyebrow}</span>
        <h1 className="hero__title">
          {t.heroTitleLine1}<br />
          <em>{t.heroTitleEm}</em>
        </h1>
        <p className="hero__subtitle">{t.heroSubtitle}</p>
        <div className="hero__actions">
          <Link href="/composer" className="btn-primary hero__cta">
            {t.heroCta}
          </Link>
          <a href="#circuits" className="btn-outline-white">
            {t.heroSecondary}
          </a>
        </div>
      </div>

    </section>
  )
}
