'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import './Navbar.css'

const navLinks = [
  { to: '/circuits', label: 'Circuits' },
  { to: '/blog', label: 'Blog' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currency, toggle } = useCurrency()
  const { user, isLoggedIn, logout } = useAuth()
  const { favorites } = useFavorites()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setAccountOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isHome = pathname === '/'

  function handleLogout() {
    logout()
    setAccountOpen(false)
    router.push('/')
  }

  return (
    <nav className={`navbar ${(isScrolled || !isHome) ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link href="/" className="navbar__logo">
          <img src="/logo.png" alt="Treky" className="navbar__logo-img" />
          <span className="navbar__logo-text">Treky</span>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                href={to}
                className={`navbar__link ${pathname === to ? 'navbar__link--active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
          {/* Mobile-only auth links */}
          {menuOpen && !isLoggedIn && (
            <>
              <li><Link href="/inscription" className="navbar__link">S'inscrire</Link></li>
              <li><Link href="/connexion" className="navbar__link">Connexion</Link></li>
            </>
          )}
          {menuOpen && isLoggedIn && (
            <>
              <li><Link href="/compte/reservations" className="navbar__link">Mes réservations</Link></li>
              <li><Link href="/compte/favoris" className="navbar__link">Mes favoris</Link></li>
              <li><Link href="/chat/1" className="navbar__link">Messages guide</Link></li>
              <li>
                <button className="navbar__link navbar__link--logout" onClick={handleLogout}>
                  Déconnexion
                </button>
              </li>
            </>
          )}
        </ul>

        <div className="navbar__actions">
          <button
            className="navbar__currency-toggle"
            onClick={toggle}
            aria-label="Changer de devise"
            title={currency === 'AR' ? 'Afficher en euros' : 'Afficher en Ariary'}
          >
            <span className={`navbar__currency-opt ${currency === 'AR' ? 'active' : ''}`}>Ar</span>
            <span className="navbar__currency-sep">|</span>
            <span className={`navbar__currency-opt ${currency === 'EUR' ? 'active' : ''}`}>€</span>
          </button>

          {isLoggedIn ? (
            <div className="navbar__account" ref={dropdownRef}>
              <button
                className="navbar__account-btn"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
              >
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="navbar__account-avatar" />
                  : <span className="navbar__account-initials">{user?.name?.[0] ?? 'U'}</span>
                }
                <span className="navbar__account-name">{user?.name?.split(' ')[0]}</span>
                <span className="navbar__account-chevron">{accountOpen ? '▲' : '▼'}</span>
              </button>

              {accountOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <span className="navbar__dropdown-name">{user?.name}</span>
                    <span className="navbar__dropdown-email">{user?.email}</span>
                  </div>

                  <Link href="/compte/reservations" className="navbar__dropdown-item">
                    <span className="navbar__dropdown-icon">📋</span>
                    Mes réservations
                  </Link>

                  <Link href="/compte/favoris" className="navbar__dropdown-item">
                    <span className="navbar__dropdown-icon">♡</span>
                    Mes favoris
                    {favorites.length > 0 && (
                      <span className="navbar__dropdown-badge">{favorites.length}</span>
                    )}
                  </Link>

                  <Link href="/chat/1" className="navbar__dropdown-item">
                    <span className="navbar__dropdown-icon">💬</span>
                    Messages guide
                  </Link>

                  <div className="navbar__dropdown-sep" />

                  <button className="navbar__dropdown-logout" onClick={handleLogout}>
                    <span className="navbar__dropdown-icon">↪</span>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="navbar__btn-login" onClick={() => router.push('/inscription')}>
                S'inscrire
              </button>
              <button className="navbar__btn-cta" onClick={() => router.push('/connexion')}>
                Connexion
              </button>
            </>
          )}
        </div>

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
