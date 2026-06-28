import Link from 'next/link'
import '../legal.css'

export const metadata = {
  title: 'Conditions Générales de Vente',
  description: "Conditions générales de vente applicables aux circuits et prestations de trekking Treky à Madagascar.",
  robots: { index: true, follow: false },
}

export default function CGVPage() {
  return (
    <>
      <div className="legal-hero">
        <div className="container">
          <p className="legal-hero__eyebrow">Légal</p>
          <h1 className="legal-hero__title">Conditions Générales de Vente</h1>
          <p className="legal-hero__date">Dernière mise à jour : juin 2026</p>
        </div>
      </div>

      <div className="legal-body">
        <div className="container">
          <nav className="legal-nav" aria-label="Pages légales">
            <Link href="/mentions-legales" className="legal-nav__link">Mentions légales</Link>
            <Link href="/confidentialite" className="legal-nav__link">Confidentialité</Link>
            <Link href="/cgv" className="legal-nav__link legal-nav__link--active">CGV</Link>
            <Link href="/cookies" className="legal-nav__link">Cookies</Link>
          </nav>

          <div className="legal-content">
            <h2>1. Objet et champ d'application</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations
              contractuelles entre <strong>Treky SARL</strong> (ci-après « Treky ») et toute
              personne physique (ci-après « le Client ») souhaitant réserver un circuit de
              trekking ou toute autre prestation proposée sur le site <strong>treky.mg</strong>.
            </p>
            <p>
              Toute réservation implique l'acceptation pleine et entière des présentes CGV.
            </p>

            <h2>2. Réservation</h2>
            <p>
              La réservation est constituée par :
            </p>
            <ol>
              <li>La sélection du circuit, de la durée et des dates souhaitées sur le site.</li>
              <li>Le remplissage du formulaire de réservation et la transmission des informations demandées.</li>
              <li>La réception d'un e-mail de confirmation de la part de Treky.</li>
              <li>Le versement de l'acompte prévu à l'article 3.</li>
            </ol>
            <p>
              La réservation est définitivement confirmée dès réception de l'acompte et de l'e-mail
              de confirmation de Treky.
            </p>

            <h2>3. Tarifs et paiement</h2>
            <h3>Tarifs</h3>
            <p>
              Les tarifs affichés sur le site sont exprimés en Ariary malgache (Ar) et en euros (€)
              à titre indicatif. Ils sont susceptibles d'évoluer sans préavis. Le tarif applicable
              est celui en vigueur au moment de la confirmation de réservation.
            </p>
            <p>
              Les prix incluent les prestations mentionnées dans la fiche circuit (hébergement,
              pension complète, guide, entrées de parcs). Les éléments listés en « non inclus »
              restent à la charge du Client.
            </p>

            <h3>Modalités de paiement</h3>
            <ul>
              <li><strong>Acompte</strong> : 30 % du montant total à la réservation.</li>
              <li><strong>Solde</strong> : 70 % au plus tard 15 jours avant le départ.</li>
            </ul>
            <p>Moyens de paiement acceptés :</p>
            <ul>
              <li>MVola (paiement mobile malgache)</li>
              <li>Virement bancaire</li>
              <li>Carte bancaire (via lien de paiement sécurisé)</li>
              <li>Espèces sur place (pour le solde uniquement, sous conditions)</li>
            </ul>

            <h2>4. Modification du circuit et durée adaptable</h2>
            <p>
              Treky propose des circuits à durée adaptable. Le Client peut ajuster la durée de son
              trek (dans les limites min/max indiquées). Toute modification de durée impacte le
              tarif selon les conditions indiquées sur la fiche circuit.
            </p>
            <p>
              Toute modification de réservation (dates, durée, circuit) doit être notifiée par
              e-mail à <a href="mailto:contact@treky.mg">contact@treky.mg</a> au moins <strong>21 jours avant le départ</strong>.
              Treky s'efforce d'y répondre favorablement sous réserve de disponibilité.
            </p>

            <h2>5. Annulation</h2>
            <h3>Annulation par le Client</h3>
            <ul>
              <li>Plus de 30 jours avant le départ : remboursement intégral de l'acompte.</li>
              <li>Entre 15 et 30 jours avant le départ : retenue de 30 % du montant total.</li>
              <li>Entre 7 et 14 jours avant le départ : retenue de 50 % du montant total.</li>
              <li>Moins de 7 jours avant le départ : aucun remboursement.</li>
            </ul>
            <p>
              Toute annulation doit être notifiée par e-mail à{' '}
              <a href="mailto:contact@treky.mg">contact@treky.mg</a>.
            </p>

            <h3>Annulation par Treky</h3>
            <p>
              Treky se réserve le droit d'annuler un circuit pour des raisons de force majeure
              (catastrophe naturelle, troubles politiques, conditions météorologiques extrêmes) ou
              si le nombre minimum de participants n'est pas atteint. Dans ce cas, le Client sera
              remboursé intégralement ou pourra reporter son circuit sans frais.
            </p>

            <h2>6. Assurance</h2>
            <p>
              Il est <strong>fortement recommandé</strong> au Client de souscrire une assurance
              voyage incluant la garantie rapatriement médical et l'assistance en cas d'accident.
              Treky ne saurait être tenu responsable des frais médicaux ou de rapatriement
              non couverts par une assurance.
            </p>

            <h2>7. Responsabilité de Treky</h2>
            <p>
              Treky s'engage à mettre tout en œuvre pour assurer la réalisation du circuit dans
              les meilleures conditions de sécurité. Cependant, la pratique du trekking en milieu
              naturel comporte des risques inhérents que le Client reconnaît accepter.
            </p>
            <p>
              La responsabilité de Treky ne pourra être engagée en cas de force majeure, de faute
              du Client, ou de conditions extérieures indépendantes de sa volonté (météo, fermeture
              de parcs, etc.).
            </p>

            <h2>8. Obligations du Client</h2>
            <ul>
              <li>Être en bonne condition physique adaptée au niveau du circuit choisi.</li>
              <li>Se munir des équipements recommandés dans la fiche circuit.</li>
              <li>Respecter les règles des parcs nationaux et les consignes du guide.</li>
              <li>Disposer d'un passeport valide et des visas nécessaires à l'entrée à Madagascar.</li>
              <li>Informer Treky de tout problème de santé pouvant affecter la pratique du trek.</li>
            </ul>

            <h2>9. Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit malgache. En cas de litige non résolu
              amiablement, les tribunaux compétents d'Antananarivo seront seuls compétents.
            </p>

            <h2>10. Contact</h2>
            <p>
              Pour toute question relative à une réservation :{' '}
              <a href="mailto:contact@treky.mg">contact@treky.mg</a> —{' '}
              <a href="tel:+261000000000">+261 00 00 000 00</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
