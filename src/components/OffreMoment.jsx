'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCurrency } from '../context/CurrencyContext'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import Icon from './Icon'
import './OffreMoment.css'

const SLUG = 'sainte-marie-pirates-baleines'
const PRICE_AR = 4_000_000

export default function OffreMoment() {
  const { format } = useCurrency()
  const { locale } = useLocale()
  const t = getUI(locale).home

  return (
    <section className="offre section-padding" id="offre">
      <div className="container">
        <div className="offre__header" data-reveal>
          <h2 className="section-title">{t.offreTitle}</h2>
        </div>

        <div className="offre__card" data-reveal>
          <Link href={`/circuits/${SLUG}`} className="offre__image-wrap offre__image-link">
            <span className="badge badge-offer offre__badge">{t.offreBadge}</span>
            <Image
              src="/images/sainte_marie.webp"
              alt={t.offreCircuitTitle}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              className="offre__image"
            />
          </Link>

          <div className="offre__content">
            <h3 className="offre__title">{t.offreCircuitTitle}</h3>
            <p className="offre__description">{t.offreDescription}</p>
            <ul className="offre__details">
              <li>
                <span className="offre__detail-icon"><Icon name="pin" size={16} /></span>
                <span>{t.offreLocation}</span>
              </li>
              <li>
                <span className="offre__detail-icon"><Icon name="clock" size={16} /></span>
                <span>{t.offreDuration}</span>
              </li>
              <li>
                <span className="offre__detail-icon"><Icon name="users" size={16} /></span>
                <span>{t.offreGroup}</span>
              </li>
              <li>
                <span className="offre__detail-icon"><Icon name="star" size={16} /></span>
                <span>{t.offreLevel}</span>
              </li>
            </ul>
            <div className="offre__price-row">
              <div className="offre__price">
                <span className="offre__price-label">{t.offreFrom}</span>
                <span className="offre__price-amount">{format(PRICE_AR)}</span>
              </div>
              <Link href={`/circuits/${SLUG}`} className="btn-primary">{t.offreViewCircuit}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
