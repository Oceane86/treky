import { Suspense } from 'react'
import CircuitsClient from './CircuitsClient'

export const metadata = {
  title: 'Circuits de trek à Madagascar',
  description:
    'Découvrez nos circuits de trekking à Madagascar : Isalo, Tsingy de Bemaraha, Tsaratanana, Sainte-Marie et bien plus. Filtrez par durée, niveau et budget.',
  openGraph: {
    title: 'Circuits de trek à Madagascar – Treky',
    description:
      'Tous nos circuits de trekking à Madagascar avec guides locaux certifiés. Durée adaptable, départ sur mesure.',
    images: [{ url: '/images/isalo.jpg', width: 1200, height: 630 }],
  },
}

export default function CircuitsPage() {
  return (
    <Suspense>
      <CircuitsClient />
    </Suspense>
  )
}
