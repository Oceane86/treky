'use client'
import Link from 'next/link'
import { useFavorites } from '../../../context/FavoritesContext'
import { useAuth } from '../../../context/AuthContext'
import { circuits } from '../../../data/circuits'
import CircuitCard from '../../../components/CircuitCard'
import '../../../pages/Page.css'
import './favoris.css'

export default function FavorisPage() {
  const { isLoggedIn } = useAuth()
  const { favorites, toggleFavorite } = useFavorites()

  const favoriteCircuits = circuits.filter((c) => favorites.includes(c.id))

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="favoris-gate">
          <div className="favoris-gate__icon">🔒</div>
          <h2>Connexion requise</h2>
          <p>Connectez-vous pour retrouver vos circuits favoris.</p>
          <Link href="/connexion" className="btn-primary">Se connecter</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Mon compte</p>
          <h1 className="page-hero__title">Mes favoris</h1>
          <p className="page-hero__subtitle">
            {favoriteCircuits.length > 0
              ? `${favoriteCircuits.length} circuit${favoriteCircuits.length > 1 ? 's' : ''} sauvegardé${favoriteCircuits.length > 1 ? 's' : ''}`
              : 'Aucun favori pour le moment'}
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          {favoriteCircuits.length === 0 ? (
            <div className="favoris-empty">
              <div className="favoris-empty__icon">♡</div>
              <h3>Vous n'avez pas encore de favoris</h3>
              <p>Explorez nos circuits et cliquez sur ♡ pour sauvegarder vos coups de cœur.</p>
              <Link href="/circuits" className="btn-primary">Découvrir les circuits</Link>
            </div>
          ) : (
            <>
              <div className="circuits__grid">
                {favoriteCircuits.map((circuit) => (
                  <div key={circuit.id} className="favoris-card-wrap">
                    <CircuitCard circuit={circuit} />
                    <button
                      className="favoris-remove-btn"
                      onClick={() => toggleFavorite(circuit.id)}
                      title="Retirer des favoris"
                    >
                      ✕ Retirer
                    </button>
                  </div>
                ))}
              </div>
              <div className="favoris-cta">
                <Link href="/circuits" className="btn-secondary">
                  Découvrir d'autres circuits
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
