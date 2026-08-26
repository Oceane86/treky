import ComposerClient from './ComposerClient'

export const metadata = {
  title: 'Composez votre trek sur-mesure',
  description:
    'Indiquez vos envies (thématiques, durée, budget, niveau) et Treky vous propose instantanément les circuits et guides malgaches compatibles.',
  alternates: { canonical: 'https://treky.vercel.app/composer' },
}

export default function ComposerPage() {
  return <ComposerClient />
}
