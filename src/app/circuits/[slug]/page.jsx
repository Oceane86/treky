import { getCircuitBySlug } from '../../../data/circuits'
import CircuitDetailClient from './CircuitDetailClient'

export function generateMetadata({ params }) {
  const circuit = getCircuitBySlug(params.slug)
  if (!circuit) return { title: 'Circuit introuvable' }
  return {
    title: `${circuit.name} – Trek ${circuit.region}`,
    description: circuit.teaser,
    alternates: { canonical: `https://treky.mg/circuits/${circuit.slug}` },
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

function circuitJsonLd(circuit) {
  const minEur = circuit.priceEurMin ?? Math.round(circuit.priceAr / 4000)
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: circuit.name,
    description: circuit.description ?? circuit.teaser,
    image: `https://treky.mg${circuit.image}`,
    touristType: circuit.level,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: (circuit.steps ?? []).map((step, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: step.title,
        description: step.description,
      })),
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: minEur,
      url: `https://treky.mg/circuits/${circuit.slug}`,
      availability: 'https://schema.org/InStock',
    },
    ...(circuit.rating && circuit.reviews
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: circuit.rating,
            reviewCount: circuit.reviews,
          },
        }
      : {}),
    provider: { '@type': 'TravelAgency', name: 'Treky', url: 'https://treky.mg' },
  }
}

function breadcrumbJsonLd(circuit) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://treky.mg' },
      { '@type': 'ListItem', position: 2, name: 'Circuits', item: 'https://treky.mg/circuits' },
      { '@type': 'ListItem', position: 3, name: circuit.name, item: `https://treky.mg/circuits/${circuit.slug}` },
    ],
  }
}

export default function CircuitDetailPage({ params }) {
  const circuit = getCircuitBySlug(params.slug)
  return (
    <>
      {circuit && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(circuitJsonLd(circuit)) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(circuit)) }}
          />
        </>
      )}
      <CircuitDetailClient />
    </>
  )
}
