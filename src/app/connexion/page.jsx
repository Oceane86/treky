import { Suspense } from 'react'
import ConnexionClient from './ConnexionClient'

export const metadata = {
  title: 'Connexion — Treky',
  description: 'Connectez-vous à votre compte Treky pour gérer vos réservations et favoris.',
}

export default function ConnexionPage() {
  return (
    <Suspense>
      <ConnexionClient />
    </Suspense>
  )
}
