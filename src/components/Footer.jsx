import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="container footer__grid">

          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.png" alt="Treky" className="footer__logo-img" />
              <span className="footer__logo-name">Treky</span>
            </div>
            <p className="footer__tagline">
              Le trek qui vous connecte à l'essentiel. Découvrez Madagascar autrement,
              à travers ses paysages, sa faune et ses habitants.
            </p>
          </div>

          <div className="footer__col">
            <p className="footer__col-label">Agence</p>
            <ul className="footer__links">
              <li><Link to="/circuits">Circuits</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/a-propos">À propos</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <p className="footer__col-label">Légal</p>
            <ul className="footer__links">
              <li><a href="#">Mentions légales</a></li>
              <li><a href="#">Confidentialité</a></li>
              <li><a href="#">CGV</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>

          <div className="footer__col footer__col--contact">
            <p className="footer__col-label">Nous contacter</p>
            <ul className="footer__contact-list">
              <li>
                <span className="footer__contact-icon">✉</span>
                <a href="mailto:contact@treky.mg">contact@treky.mg</a>
              </li>
              <li>
                <span className="footer__contact-icon">☎</span>
                <a href="tel:+261000000000">+261 00 00 000 00</a>
              </li>
              <li>
                <span className="footer__contact-icon">⌖</span>
                <span>Antananarivo, Madagascar</span>
              </li>
            </ul>
            <div className="footer__mvola">
              <p className="footer__mvola-label">Paiement mobile</p>
              <img src="/images/mvola.png" alt="MVola" />
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
