import { Suspense } from 'react'
import ContactClient from './ContactClient'

export const metadata = {
  title: 'Contact – Planifiez votre trek à Madagascar',
  description:
    "Contactez Treky pour organiser votre trek à Madagascar. Notre équipe vous répond sous 24 à 48 heures.",
  openGraph: {
    title: 'Nous contacter | Treky',
    description: "Posez vos questions ou lancez votre réservation de trek avec Treky.",
  },
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactClient />
    </Suspense>
  )
}
