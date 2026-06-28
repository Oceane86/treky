import Link from 'next/link'

export const metadata = {
  title: 'À propos de Treky',
  description:
    'Treky, agence de trekking responsable à Madagascar. Découvrez notre mission, nos guides certifiés et nos engagements éco-touristiques.',
  openGraph: {
    title: 'À propos de Treky – Agence de trek à Madagascar',
    description:
      'Circuits responsables, guides locaux certifiés, immersion authentique. Treky vous connecte à l\'essentiel de Madagascar.',
    images: [{ url: '/images/about1.jpg', width: 1200, height: 630 }],
  },
}
import '../../pages/Page.css'
import '../../pages/About.css'

const TEAM = [
  {
    id: 1,
    nom: 'Rakoto Jean',
    role: 'Guide aventure & faune endémique',
    photo: '/images/avatar1.jpg',
    langues: ['Français', 'Malgache', 'Anglais'],
    note: 4.9,
    avis: 87,
    bio: "Né à Antananarivo, Jean parcourt les sentiers de Madagascar depuis 15 ans. Spécialiste de l'Isalo, des Tsingy et de la grande traversée Nord-Sud.",
  },
  {
    id: 2,
    nom: 'Solofo Andry',
    role: 'Guide nature & photographie',
    photo: '/images/avatar2.jpg',
    langues: ['Français', 'Malgache'],
    note: 4.8,
    avis: 64,
    bio: "Naturaliste passionné et photographe animalier, Solofo est votre meilleur allié pour observer lémuriens, caméléons et oiseaux endémiques dans leur milieu naturel.",
  },
  {
    id: 3,
    nom: 'Nirina Mamy',
    role: 'Guide culturel & villages locaux',
    photo: '/images/avatar3.jpg',
    langues: ['Français', 'Malgache', 'Italien'],
    note: 5.0,
    avis: 42,
    bio: "Issue du peuple Betsileo, Nirina vous ouvre les portes des villages, des traditions et de l'artisanat des Hautes Terres avec une authenticité rare.",
  },
]

const ENGAGEMENTS = [
  {
    icon: '🌿',
    titre: 'Écotourisme responsable',
    texte: 'Chaque circuit est conçu pour minimiser l'impact sur les écosystèmes : groupes limités, bivouacs zéro déchet, sentiers balisés avec les parcs nationaux.',
  },
  {
    icon: '🤝',
    titre: 'Économie locale d'abord',
    texte: 'Guides, porteurs, cuisiniers, hébergeurs — 100% de nos prestataires sont issus des régions traversées. Votre voyage crée des emplois durables sur place.',
  },
  {
    icon: '🏡',
    titre: 'Immersion authentique',
    texte: 'Nuits chez l'habitant, repas familiaux, ateliers artisanaux : nous privilégions les rencontres réelles aux expériences standardisées.',
  },
  {
    icon: '🌍',
    titre: 'Contribution conservation',
    texte: 'Une partie de chaque réservation est reversée aux associations de protection de la biodiversité malgache avec lesquelles nous travaillons.',
  },
]

const ASSOCIATIONS = [
  {
    nom: 'Mitsinjo',
    lieu: 'Andasibe',
    role: 'Conservation lémuriens & forêt primaire',
    desc: "Association communautaire qui gère la réserve privée d'Andasibe, formant les guides locaux et finançant la reboisement des espèces endémiques.",
    lien: '#',
  },
  {
    nom: 'Fanamby',
    lieu: 'Antananarivo',
    role: 'Aires protégées & biodiversité',
    desc: 'ONG nationale qui gère et protège plusieurs aires protégées à Madagascar, notamment dans les zones que nous traversons lors de nos circuits.',
    lien: '#',
  },
  {
    nom: 'Zafimaniry Artisans',
    lieu: 'Ambositra',
    role: 'Préservation artisanat UNESCO',
    desc: "Coopérative d'artisans Zafimaniry qui perpétue l'art de la sculpture sur bois inscrit au patrimoine immatériel de l'UNESCO. Partenaire de notre circuit culturel.",
    lien: '#',
  },
]

export default function AboutPage() {
  return (
    <div className="page">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Notre histoire</p>
          <h1 className="page-hero__title">À propos de Treky</h1>
          <p className="page-hero__subtitle">
            Née d'une passion pour Madagascar et d'une conviction : le voyage à pied est la façon
            la plus authentique de découvrir la Grande Île.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">

          {/* Mission + Engagement */}
          <div className="about-page__intro page-grid-2">
            <div className="page-card">
              <h2>Notre mission</h2>
              <p>
                Treky crée des expériences de trek responsables, guidées par des experts locaux,
                au service des voyageurs et des communautés malgaches. Chaque itinéraire est une
                invitation à ralentir, observer et se connecter à l'essentiel.
              </p>
            </div>
            <div className="page-card">
              <h2>Tourisme responsable</h2>
              <p>
                Nous travaillons exclusivement avec des guides, porteurs et hébergeurs issus des
                régions traversées. Une partie de chaque réservation est reversée aux associations
                locales de conservation de la biodiversité.
              </p>
            </div>
          </div>

          {/* Chiffres */}
          <div className="about-page__stats">
            <div className="about-page__stat">
              <span className="about-page__stat-num">11</span>
              <span className="about-page__stat-label">Circuits disponibles</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">500+</span>
              <span className="about-page__stat-label">Voyageurs accompagnés</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">3</span>
              <span className="about-page__stat-label">Guides certifiés</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">5</span>
              <span className="about-page__stat-label">Écosystèmes couverts</span>
            </div>
          </div>

          {/* Paysages + Culture */}
          <div className="about-page__values page-grid-2">
            <div className="about-page__value">
              <img src="/images/about2.jpg" alt="Paysages Madagascar" />
              <div>
                <h3>Des paysages uniques</h3>
                <p>
                  Des baobabs centenaires aux canyons de grès de l'Isalo, en passant par les
                  forêts primaires d'Andasibe et les Tsingy de Bemaraha — Madagascar concentre
                  une diversité géologique et biologique sans équivalent sur terre.
                </p>
              </div>
            </div>
            <div className="about-page__value">
              <img src="/images/about3.jpg" alt="Culture malgache" />
              <div>
                <h3>Une culture vivante</h3>
                <p>
                  Nos treks incluent des rencontres avec les communautés locales : artisans
                  Zafimaniry, paysans Betsileo, pêcheurs Vezo. Chaque étape est une immersion
                  culturelle authentique loin des sentiers touristiques standardisés.
                </p>
              </div>
            </div>
          </div>

          {/* Nos engagements */}
          <div className="about-engagements">
            <h2 className="about-section-title">Nos engagements</h2>
            <div className="about-engagements__grid">
              {ENGAGEMENTS.map((e) => (
                <div key={e.titre} className="about-engagement-card">
                  <span className="about-engagement-card__icon">{e.icon}</span>
                  <h3>{e.titre}</h3>
                  <p>{e.texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nos guides */}
          <div className="about-team">
            <h2 className="about-section-title">Nos guides</h2>
            <p className="about-section-subtitle">
              Certifiés, passionnés et issus des régions qu'ils vous feront découvrir.
            </p>
            <div className="about-team__grid">
              {TEAM.map((g) => (
                <div key={g.id} className="about-guide-card">
                  <img src={g.photo} alt={g.nom} className="about-guide-card__photo" />
                  <div className="about-guide-card__body">
                    <div className="about-guide-card__header">
                      <div>
                        <h3 className="about-guide-card__name">{g.nom}</h3>
                        <p className="about-guide-card__role">{g.role}</p>
                      </div>
                      <div className="about-guide-card__note">
                        <span className="about-guide-card__star">★</span>
                        <strong>{g.note}</strong>
                        <span>({g.avis})</span>
                      </div>
                    </div>
                    <p className="about-guide-card__bio">{g.bio}</p>
                    <div className="about-guide-card__langues">
                      {g.langues.map((l) => (
                        <span key={l} className="about-guide-card__langue">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Associations partenaires */}
          <div className="about-associations">
            <h2 className="about-section-title">Nos associations partenaires</h2>
            <p className="about-section-subtitle">
              Nous co-construisons chaque circuit avec des organisations locales dont l'action
              sur le terrain fait la différence.
            </p>
            <div className="about-associations__grid">
              {ASSOCIATIONS.map((a) => (
                <div key={a.nom} className="about-assoc-card">
                  <div className="about-assoc-card__top">
                    <div>
                      <h3 className="about-assoc-card__name">{a.nom}</h3>
                      <span className="about-assoc-card__lieu">📍 {a.lieu}</span>
                    </div>
                    <span className="about-assoc-card__role-tag">{a.role}</span>
                  </div>
                  <p className="about-assoc-card__desc">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta">
            <h2>Prêt à vivre l'aventure ?</h2>
            <p>Explorez nos 11 circuits et trouvez celui qui correspond à votre rythme.</p>
            <div className="about-cta__btns">
              <Link href="/circuits" className="btn-primary">Voir les circuits</Link>
              <Link href="/contact" className="btn-secondary">Nous contacter</Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
