import Link from 'next/link'
import '../legal.css'

export const metadata = {
  title: 'Politique de confidentialité',
  description: 'Comment Treky collecte, utilise et protège vos données personnelles.',
  robots: { index: true, follow: false },
}

export default function ConfidentialitePage() {
  return (
    <>
      <div className="legal-hero">
        <div className="container">
          <p className="legal-hero__eyebrow">Légal</p>
          <h1 className="legal-hero__title">Politique de confidentialité</h1>
          <p className="legal-hero__date">Dernière mise à jour : juin 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <nav className="legal-nav" aria-label="Pages légales">
            <Link href="/mentions-legales" className="legal-nav__link">Mentions légales</Link>
            <Link href="/confidentialite" className="legal-nav__link legal-nav__link--active">Confidentialité</Link>
            <Link href="/cgv" className="legal-nav__link">CGV</Link>
            <Link href="/cookies" className="legal-nav__link">Cookies</Link>
          </nav>

          <div className="legal-content">
            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement de vos données personnelles est <strong>Treky SARL</strong>,
              dont le siège est situé à Antananarivo 101, Madagascar.
              Contact : <a href="mailto:contact@treky.mg">contact@treky.mg</a>
            </p>

            <h2>2. Données collectées</h2>
            <h3>Via le formulaire de contact et de réservation</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse e-mail</li>
              <li>Numéro de téléphone (optionnel)</li>
              <li>Informations sur votre projet de trek (circuit, durée, dates souhaitées)</li>
            </ul>

            <h3>Via la newsletter</h3>
            <ul>
              <li>Adresse e-mail</li>
            </ul>

            <h3>Via la création de compte</h3>
            <ul>
              <li>Nom, prénom, adresse e-mail, mot de passe (chiffré)</li>
              <li>Historique des réservations et circuits favoris</li>
            </ul>

            <h3>Données de navigation</h3>
            <p>
              Nous collectons automatiquement des données techniques (adresse IP, type de navigateur,
              pages visitées, durée de visite) à des fins statistiques anonymes, via des outils
              d'analyse respectueux de la vie privée.
            </p>

            <h2>3. Finalités et bases légales</h2>
            <ul>
              <li><strong>Traitement des demandes de contact et de réservation</strong> — Base légale : exécution d'un contrat / mesures précontractuelles.</li>
              <li><strong>Envoi de la newsletter</strong> — Base légale : consentement explicite (vous pouvez vous désabonner à tout moment).</li>
              <li><strong>Gestion de votre compte</strong> — Base légale : exécution du contrat.</li>
              <li><strong>Statistiques de navigation</strong> — Base légale : intérêt légitime (amélioration du service).</li>
              <li><strong>Conformité légale et comptable</strong> — Base légale : obligation légale.</li>
            </ul>

            <h2>4. Destinataires des données</h2>
            <p>
              Vos données sont traitées par Treky SARL et ses prestataires techniques (hébergeur
              Vercel, outil d'envoi d'e-mails). Elles ne sont jamais revendues à des tiers à des
              fins commerciales.
            </p>
            <p>
              Dans le cadre d'une réservation confirmée, vos coordonnées peuvent être transmises
              au guide assigné à votre circuit, uniquement dans la mesure nécessaire à
              l'organisation du trek.
            </p>

            <h2>5. Durée de conservation</h2>
            <ul>
              <li>Données de contact et réservation : 3 ans après le dernier contact.</li>
              <li>Données de compte : durée d'activité du compte + 1 an après sa suppression.</li>
              <li>Newsletter : jusqu'au désabonnement.</li>
              <li>Données comptables : 10 ans (obligation légale).</li>
            </ul>

            <h2>6. Vos droits</h2>
            <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données.</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes.</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données.</li>
              <li><strong>Droit d'opposition</strong> : vous opposer à certains traitements.</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré.</li>
              <li><strong>Droit au retrait du consentement</strong> : à tout moment pour les traitements fondés sur votre consentement (notamment la newsletter).</li>
            </ul>
            <p>
              Pour exercer vos droits, contactez-nous à{' '}
              <a href="mailto:contact@treky.mg">contact@treky.mg</a>. Nous vous répondrons dans
              un délai d'un mois.
            </p>

            <h2>7. Sécurité</h2>
            <p>
              Treky met en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données contre tout accès non autorisé, perte, destruction ou divulgation :
              connexion HTTPS, mots de passe chiffrés, accès restreint aux données.
            </p>

            <h2>8. Cookies</h2>
            <p>
              Pour plus d'informations sur notre utilisation des cookies, consultez notre{' '}
              <Link href="/cookies">politique de cookies</Link>.
            </p>

            <h2>9. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. La date de dernière révision est indiquée en
              haut de page. Nous vous invitons à la consulter régulièrement.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
