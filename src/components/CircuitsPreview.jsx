import Link from 'next/link'
import { circuits } from '../data/circuits'
import CircuitCard from './CircuitCard'
import './Circuits.css'

export default function CircuitsPreview() {
  const preview = circuits.slice(0, 3)

  return (
    <section className="circuits section-padding" id="circuits">
      <div className="container">
        <div className="circuits__header" data-reveal>
          <h2 className="section-title">Choisir votre circuit idéal</h2>
          <p className="section-subtitle circuits__subtitle">
            Des treks soigneusement sélectionnés pour vous faire vivre une immersion
            totale dans la nature malgache.
          </p>
        </div>

        <div className="circuits__grid" data-reveal data-reveal-delay="1">
          {preview.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>

        <div className="circuits__cta-wrap" data-reveal data-reveal-delay="2">
          <Link href="/circuits" className="btn-secondary">Voir tous nos circuits</Link>
        </div>
      </div>
    </section>
  )
}
