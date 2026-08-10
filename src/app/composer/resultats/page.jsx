import ResultatsClient from './ResultatsClient'

export const metadata = {
  title: 'Vos recommandations de trek',
  description: 'Circuits et guides Treky sélectionnés selon vos envies.',
  robots: { index: false, follow: true },
}

export default function ComposerResultatsPage() {
  return <ResultatsClient />
}
