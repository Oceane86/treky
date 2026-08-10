import Link from 'next/link'
import Icon from '../components/Icon'
import './NotFound.css'

export const metadata = {
  title: 'Page introuvable',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="page">
      <div className="container not-found__body">
        <div className="not-found__icon">
          <Icon name="compass" size={64} strokeWidth={1.5} />
        </div>
        <p className="not-found__code">ERREUR 404</p>
        <h1 className="not-found__title">Vous êtes hors piste</h1>
        <p className="not-found__text">
          Cette page n'existe pas ou a changé d'adresse. Retrouvez votre chemin vers nos circuits
          de trekking à Madagascar ou revenez à l'accueil.
        </p>
        <div className="not-found__actions">
          <Link href="/" className="btn-primary">Retour à l'accueil</Link>
          <Link href="/circuits" className="btn-secondary">Voir les circuits</Link>
        </div>
      </div>
    </div>
  )
}
