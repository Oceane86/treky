import Link from 'next/link'
import '../legal.css'

export const metadata = {
  title: 'Politique de cookies',
  description: 'Informations sur l\'utilisation des cookies sur le site Treky.',
  robots: { index: true, follow: false },
}

export default function CookiesPage() {
  return (
    <>
      <div className="legal-hero">
        <div className="container">
          <p className="legal-hero__eyebrow">Légal</p>
          <h1 className="legal-hero__title">Politique de cookies</h1>
          <p className="legal-hero__date">Dernière mise à jour : juin 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <nav className="legal-nav" aria-label="Pages légales">
            <Link href="/mentions-legales" className="legal-nav__link">Mentions légales</Link>
            <Link href="/confidentialite" className="legal-nav__link">Confidentialité</Link>
            <Link href="/cgv" className="legal-nav__link">CGV</Link>
            <Link href="/cookies" className="legal-nav__link legal-nav__link--active">Cookies</Link>
          </nav>

          <div className="legal-content">
            <h2>1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, smartphone,
              tablette) lors de votre visite sur un site web. Il permet au site de mémoriser des
              informations relatives à votre navigation afin d'améliorer votre expérience.
            </p>

            <h2>2. Cookies utilisés sur treky.mg</h2>

            <h3>Cookies strictement nécessaires</h3>
            <p>
              Ces cookies sont indispensables au bon fonctionnement du site. Ils ne peuvent pas
              être désactivés.
            </p>
            <ul>
              <li><strong>Session d'authentification</strong> : maintient votre connexion lors de la navigation entre les pages.</li>
              <li><strong>Préférences de devise</strong> : mémorise votre choix de devise (Ar / €).</li>
              <li><strong>Favoris</strong> : conserve votre liste de circuits favoris.</li>
              <li><strong>Panier de réservation</strong> : maintient les informations de votre réservation en cours.</li>
            </ul>

            <h3>Cookies de performance et d'analyse</h3>
            <p>
              Ces cookies nous permettent de mesurer l'audience du site et d'en améliorer
              les performances. Les données collectées sont agrégées et anonymisées.
            </p>
            <ul>
              <li><strong>Statistiques de visite</strong> : pages consultées, durée de visite, origine du trafic — aucune donnée personnelle identifiable.</li>
            </ul>

            <h3>Cookies fonctionnels</h3>
            <p>
              Ces cookies améliorent l'expérience utilisateur en mémorisant vos préférences.
            </p>
            <ul>
              <li><strong>Langue et région</strong> : mémorise vos paramètres d'affichage.</li>
              <li><strong>Filtres circuits</strong> : conserve vos filtres de recherche le temps de la session.</li>
            </ul>

            <h3>Cookies de médias sociaux et contenu tiers</h3>
            <p>
              Treky n'intègre pas de boutons de partage social actifs ni de traceurs publicitaires
              tiers sur ses pages. Les seuls contenus tiers susceptibles de déposer des cookies sont :
            </p>
            <ul>
              <li><strong>OpenStreetMap / Leaflet</strong> : utilisé pour les cartes de circuits (données de tuiles cartographiques uniquement).</li>
              <li><strong>Google Fonts</strong> : polices de caractères chargées depuis les serveurs Google.</li>
            </ul>

            <h2>3. Durée de conservation des cookies</h2>
            <ul>
              <li>Cookies de session : supprimés à la fermeture du navigateur.</li>
              <li>Cookies de préférences (devise, favoris) : 12 mois maximum.</li>
              <li>Cookies analytiques : 13 mois maximum.</li>
            </ul>

            <h2>4. Gestion de vos cookies</h2>
            <p>
              Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de
              votre navigateur. La désactivation de certains cookies peut toutefois dégrader votre
              expérience sur le site (perte des favoris, déconnexion automatique, etc.).
            </p>
            <p>Instructions pour les principaux navigateurs :</p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/fr-fr/windows/supprimer-et-gérer-les-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            </ul>

            <h2>5. Contact</h2>
            <p>
              Pour toute question concernant notre utilisation des cookies :{' '}
              <a href="mailto:contact@treky.mg">contact@treky.mg</a>
            </p>
            <p>
              Voir aussi notre{' '}
              <Link href="/confidentialite">politique de confidentialité</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
