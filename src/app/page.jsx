import HomeClient from './HomeClient'

export const metadata = {
  title: 'Treky – Trek Madagascar avec guides locaux certifiés',
  description:
    "Treky organise des circuits de trekking à Madagascar avec des guides locaux certifiés. Isalo, Tsingy de Bemaraha, Tsaratanana — vivez l'aventure malgache en toute sécurité.",
  alternates: { canonical: 'https://treky.vercel.app' },
}

export default function HomePage() {
  return <HomeClient />
}
