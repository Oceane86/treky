import Link from 'next/link'
import '../legal.css'

export const metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales de Treky, agence de trekking à Madagascar.',
  robots: { index: true, follow: false },
}

export default function MentionsLegalesPage() {
  return (
    <>
      <div className="legal-hero">
        <div className="container">
          <p className="legal-hero__eyebrow">Légal</p>
          <h1 className="legal-hero__title">Mentions légales</h1>
          <p className="legal-hero__date">Dernière mise à jour : juin 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <nav className="legal-nav" aria-label="Pages légales">
            <Link href="/mentions-legales" className="legal-nav__link legal-nav__link--active">Mentions légales</Link>
            <Link href="/confidentialite" className="legal-nav__link">Confidentialité</Link>
            <Link href="/cgv" className="legal-nav__link">CGV</Link>
            <Link href="/cookies" className="legal-nav__link">Cookies</Link>
          </nav>

          <div className="legal-content">
            <h2>1. Éditeur du site</h2>
            <p>Le site <strong>treky.mg</strong> est édité par :</p>
            <address>
              <strong>Treky SARL</strong><br />
              Antananarivo 101, Madagascar<br />
              N° STAT : [à compléter]<br />
              N° NIF : [à compléter]<br />
              E-mail : <a href="mailto:contact@treky.mg">contact@treky.mg</a><br />
              Téléphone : <a href="tel:+261000000000">+261 00 00 000 00</a>
            </address>
            <p>Directeur de la publication : [Nom du responsable légal]</p>

            <h2>2. Hébergement</h2>
            <p>Ce site est hébergé par :</p>
            <address>
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133, Covina, CA 91723 — États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </address>

            <h2>3. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur ce site (textes, photographies, vidéos, logos,
              itinéraires, noms de circuits) est la propriété exclusive de Treky SARL ou de ses
              partenaires, sauf mention contraire explicite.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou
              partie de ces éléments, quel que soit le moyen ou le procédé utilisé, est interdite
              sans l'autorisation écrite préalable de Treky SARL.
            </p>

            <h2>4. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers des sites tiers. Treky ne saurait être tenu
              responsable du contenu de ces sites ni des pratiques de confidentialité mises en œuvre
              par ces tiers. L'existence d'un lien ne vaut pas approbation des contenus vers lesquels
              il pointe.
            </p>

            <h2>5. Limitation de responsabilité</h2>
            <p>
              Les informations diffusées sur ce site sont fournies à titre informatif. Treky
              s'efforce de maintenir ces informations exactes et à jour, mais ne peut garantir leur
              exhaustivité ou leur absence d'erreur. Les tarifs et disponibilités des circuits sont
              donnés à titre indicatif et peuvent évoluer sans préavis.
            </p>
            <p>
              Treky ne pourra être tenu responsable de tout dommage direct ou indirect résultant de
              l'accès ou de l'utilisation du site, ni de l'impossibilité d'y accéder.
            </p>

            <h2>6. Droit applicable et juridiction</h2>
            <p>
              Le présent site et ses contenus sont soumis au droit malgache. En cas de litige, et
              après tentative de résolution amiable, les tribunaux compétents d'Antananarivo seront
              seuls compétents.
            </p>

            <h2>7. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales :{' '}
              <a href="mailto:contact@treky.mg">contact@treky.mg</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
