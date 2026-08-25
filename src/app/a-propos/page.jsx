import AboutClient from './AboutClient'

export const metadata = {
  title: 'À propos de Treky',
  description:
    'Treky, agence de trekking responsable à Madagascar. Découvrez notre mission, nos guides certifiés et nos engagements éco-touristiques.',
  openGraph: {
    title: 'À propos de Treky – Agence de trek à Madagascar',
    description:
      'Circuits responsables, guides locaux certifiés, immersion authentique. Treky vous connecte à l\'essentiel de Madagascar.',
    images: [{ url: '/images/about1.webp', width: 1200, height: 630 }],
  },
}

export default function AboutPage() {
  return <AboutClient />
}
