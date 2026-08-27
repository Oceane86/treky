import Link from 'next/link'
import Icon from './Icon'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container footer__grid">

          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.png" alt="Treky" className="footer__logo-img" loading="lazy" />
              <span className="footer__logo-name">Treky</span>
            </div>
            <p className="footer__tagline">
              Le trek qui vous connecte à l'essentiel. Découvrez Madagascar autrement,
              à travers ses paysages, sa faune et ses habitants.
            </p>
            <div className="footer__socials">
              <Link href="/social/instagram" className="footer__social-link" aria-label="Treky sur Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4.5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </Link>
              <Link href="/social/facebook" className="footer__social-link" aria-label="Treky sur Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="footer__col">
            <p className="footer__col-label">Agence</p>
            <ul className="footer__links">
              <li><Link href="/circuits">Circuits</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/a-propos">À propos</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/guide/connexion">Espace guides</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-label">Légal</p>
            <ul className="footer__links">
              <li><Link href="/mentions-legales">Mentions légales</Link></li>
              <li><Link href="/confidentialite">Confidentialité</Link></li>
              <li><Link href="/cgv">CGV</Link></li>
              <li><Link href="/cookies">Cookies</Link></li>
            </ul>
          </div>

          <div className="footer__col footer__col--contact">
            <p className="footer__col-label">Nous contacter</p>
            <ul className="footer__contact-list">
              <li>
                <span className="footer__contact-icon"><Icon name="mail" size={15} /></span>
                <a href="mailto:contact@treky.mg">contact@treky.mg</a>
              </li>
              <li>
                <span className="footer__contact-icon"><Icon name="phone" size={15} /></span>
                <a href="tel:+261000000000">+261 00 00 000 00</a>
              </li>
              <li>
                <span className="footer__contact-icon"><Icon name="pin" size={15} /></span>
                <span>Antananarivo, Madagascar</span>
              </li>
            </ul>
            <div className="footer__mvola">
              <p className="footer__mvola-label">Paiement mobile</p>
              <img src="/images/mvola.webp" alt="MVola" loading="lazy" />
            </div>
          </div>

        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>© {new Date().getFullYear()} Treky. Tous droits réservés.</p>
          <p>Fait avec ❤ à Madagascar</p>
        </div>
      </div>
    </footer>
  )
}
