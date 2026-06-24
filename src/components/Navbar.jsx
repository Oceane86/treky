import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext'
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
  const location = useLocation()
  const navigate = useNavigate()
  const { currency, toggle } = useCurrency()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isHome = location.pathname === '/'

  return (
    <nav className={`navbar ${(isScrolled || !isHome) ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo">
          <img src="/logo.png" alt="Treky" className="navbar__logo-img" />
          <span className="navbar__logo-text">Treky</span>
        </Link>

        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
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

          <button className="navbar__btn-login" onClick={() => navigate('/inscription')}>
            S'inscrire
          </button>
          <button className="navbar__btn-cta" onClick={() => navigate('/connexion')}>
            Connexion
          </button>
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
