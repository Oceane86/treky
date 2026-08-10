'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import './AboutMadagascar.css'

export default function AboutMadagascar() {
  const { locale } = useLocale()
  const t = getUI(locale).home

  return (
    <section className="about section-padding" id="about">
      <div className="container">
        <h2 className="section-title about__title" data-reveal>{t.aboutTitle}</h2>

        <div className="about__grid" data-reveal data-reveal-delay="1">
          {/* Colonne 1 : bloc valeurs */}
          <div className="about__text-block about__text-block--card">
            <h3 className="about__block-title">{t.aboutValuesTitle}</h3>
            <p className="about__block-text">{t.aboutValuesText}</p>
          </div>

          {/* Colonne 2 : bloc texte libre */}
          <div className="about__text-block">
            <p className="about__block-quote">{t.aboutQuote}</p>
            <p className="about__block-author">{t.aboutQuoteAuthor}</p>
            <p className="about__block-text" style={{ marginTop: '16px' }}>{t.aboutText2}</p>
          </div>

          {/* Colonne 3 : images empilées */}
          <div className="about__images-col">
            <div className="about__img-wrap">
              <Image src="/images/about2.jpg" alt="Coucher de soleil Madagascar" fill sizes="(max-width: 900px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
            </div>
            <div className="about__img-wrap">
              <Image src="/images/about3.jpg" alt="Paysage malgache" fill sizes="(max-width: 900px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        <div className="about__cta" data-reveal data-reveal-delay="2">
          <Link href="/a-propos" className="btn-secondary">{t.aboutCta}</Link>
        </div>
      </div>
    </section>
  )
}
