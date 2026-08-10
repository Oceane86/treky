'use client'
import Link from 'next/link'
import { circuits } from '../data/circuits'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import CircuitCard from './CircuitCard'
import './Circuits.css'

export default function CircuitsPreview() {
  const preview = circuits.slice(0, 3)
  const { locale } = useLocale()
  const t = getUI(locale).home

  return (
    <section className="circuits section-padding" id="circuits">
      <div className="container">
        <div className="circuits__header" data-reveal>
          <h2 className="section-title">{t.circuitsTitle}</h2>
          <p className="section-subtitle circuits__subtitle">{t.circuitsSubtitle}</p>
        </div>

        <div className="circuits__grid" data-reveal data-reveal-delay="1">
          {preview.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>

        <div className="circuits__cta-wrap" data-reveal data-reveal-delay="2">
          <Link href="/circuits" className="btn-secondary">{t.circuitsCta}</Link>
        </div>
      </div>
    </section>
  )
}
