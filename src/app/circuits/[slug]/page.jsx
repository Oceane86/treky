import { getCircuitBySlug } from '../../../data/circuits'
import CircuitDetailClient from './CircuitDetailClient'

export function generateMetadata({ params }) {
  const circuit = getCircuitBySlug(params.slug)
  if (!circuit) return { title: 'Circuit introuvable' }
  return {
    title: `${circuit.name} – Trek ${circuit.region}`,
    description: circuit.teaser,
    openGraph: {
      title: `${circuit.name} | Treky`,
      description: circuit.teaser,
      type: 'website',
      images: [{ url: circuit.image, width: 1200, height: 630, alt: circuit.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: circuit.name,
      description: circuit.teaser,
      images: [circuit.image],
    },
  }
}

export default function CircuitDetailPage() {
  return <CircuitDetailClient />
}
