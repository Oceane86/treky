'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCurrency } from '../context/CurrencyContext'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useBooking } from '../context/BookingContext'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import Icon from './Icon'
import './Navbar.css'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currency, toggle } = useCurrency()
  const { user, isLoggedIn, isGuide, logout } = useAuth()
  const { favorites } = useFavorites()
  const { booking } = useBooking()
  const { locale, setLocale } = useLocale()
  const t = getUI(locale).nav

  const navLinks = [
    { to: '/circuits', label: t.circuits },
    { to: '/blog', label: t.blog },
    { to: '/a-propos', label: t.about },
    { to: '/contact', label: t.contact },
  ]
  const dropdownRef = useRef(null)
  const chatHref = `/chat/${booking?.guide?.id ?? 1}`

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setAccountOpen(false)
    setProfileOpen(false)
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
          <img src="/logo.png" alt="Treky" className="navbar__logo-img" loading="lazy" />
          <span className="navbar__logo-text">Treky</span>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(({ to, label }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`)
            return (
              <li key={to}>
                <Link
                  href={to}
                  className={`navbar__link ${active ? 'navbar__link--active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
          {/* Mobile-only language switcher */}
          {menuOpen && (
            <li className="navbar__mobile-locale" role="group" aria-label="Choisir la langue">
              <button type="button" className={`navbar__mobile-locale-opt ${locale === 'fr' ? 'active' : ''}`} onClick={() => setLocale('fr')}>FR</button>
              <button type="button" className={`navbar__mobile-locale-opt ${locale === 'en' ? 'active' : ''}`} onClick={() => setLocale('en')}>EN</button>
              <button type="button" className={`navbar__mobile-locale-opt ${locale === 'mg' ? 'active' : ''}`} onClick={() => setLocale('mg')}>MG</button>
            </li>
          )}
          {/* Mobile-only auth links */}
          {menuOpen && !isLoggedIn && (
            <li className="navbar__mobile-auth">
              <Link href="/inscription" className="navbar__link navbar__link--register">{t.register}</Link>
              <Link href="/connexion" className="navbar__link navbar__link--cta">{t.login}</Link>
            </li>
          )}
          {menuOpen && isLoggedIn && (
            <li className="navbar__mobile-account">
              <button
                type="button"
                className="navbar__mobile-account-toggle"
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
              >
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="navbar__mobile-account-avatar" loading="lazy" />
                  : <span className="navbar__mobile-account-initials">{user?.name?.[0] ?? 'U'}</span>
                }
                <span className="navbar__mobile-account-name">Profil</span>
                <span className="navbar__mobile-account-chevron">{profileOpen ? '▲' : '▼'}</span>
              </button>

              {profileOpen && (
                <div className="navbar__mobile-account-links">
                  {isGuide ? (
                    <Link href="/guide/tableau-de-bord" className="navbar__mobile-account-link">
                      <Icon name="compass" size={16} /> Espace guides
                    </Link>
                  ) : (
                    <>
                      <Link href="/compte/reservations" className="navbar__mobile-account-link">
                        <Icon name="route" size={16} /> Mes réservations
                      </Link>
                      <Link href="/compte/favoris" className="navbar__mobile-account-link">
                        <Icon name="heartOutline" size={16} /> Mes favoris
                        {favorites.length > 0 && (
                          <span className="navbar__mobile-account-badge">{favorites.length}</span>
                        )}
                      </Link>
                      <Link href={chatHref} className="navbar__mobile-account-link">
                        <Icon name="chat" size={16} /> Messages guide
                      </Link>
                      <Link href="/compte/carnet" className="navbar__mobile-account-link">
                        <Icon name="journal" size={16} /> Carnet de trek
                      </Link>
                    </>
                  )}

                  <button className="navbar__mobile-account-logout" onClick={handleLogout}>
                    <span>↪</span> Déconnexion
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>

        <div className="navbar__actions">
          <div className="navbar__currency-toggle navbar__locale-toggle" role="group" aria-label="Choisir la langue">
            <button type="button" className={`navbar__currency-opt ${locale === 'fr' ? 'active' : ''}`} onClick={() => setLocale('fr')} title="Français">FR</button>
            <span className="navbar__currency-sep">|</span>
            <button type="button" className={`navbar__currency-opt ${locale === 'en' ? 'active' : ''}`} onClick={() => setLocale('en')} title="English">EN</button>
            <span className="navbar__currency-sep">|</span>
            <button type="button" className={`navbar__currency-opt ${locale === 'mg' ? 'active' : ''}`} onClick={() => setLocale('mg')} title="Malagasy">MG</button>
          </div>

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
                  ? <img src={user.avatar} alt={user.name} className="navbar__account-avatar" loading="lazy" />
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

                  {isGuide ? (
                    <Link href="/guide/tableau-de-bord" className="navbar__dropdown-item">
                      <span className="navbar__dropdown-icon"><Icon name="compass" size={15} /></span>
                      Espace guides
                    </Link>
                  ) : (
                    <>
                      <Link href="/compte/reservations" className="navbar__dropdown-item">
                        <span className="navbar__dropdown-icon"><Icon name="route" size={15} /></span>
                        Mes réservations
                      </Link>

                      <Link href="/compte/favoris" className="navbar__dropdown-item">
                        <span className="navbar__dropdown-icon">♡</span>
                        Mes favoris
                        {favorites.length > 0 && (
                          <span className="navbar__dropdown-badge">{favorites.length}</span>
                        )}
                      </Link>

                      <Link href={chatHref} className="navbar__dropdown-item">
                        <span className="navbar__dropdown-icon"><Icon name="chat" size={15} /></span>
                        Messages guide
                      </Link>

                      <Link href="/compte/carnet" className="navbar__dropdown-item">
                        <span className="navbar__dropdown-icon"><Icon name="journal" size={15} /></span>
                        Carnet de trek
                      </Link>
                    </>
                  )}

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
                {t.register}
              </button>
              <button className="navbar__btn-cta" onClick={() => router.push('/connexion')}>
                {t.login}
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
