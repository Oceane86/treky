'use client'
import Image from 'next/image'
import Link from 'next/link'
import AboutTeamSection from '../../components/AboutTeamSection'
import Icon from '../../components/Icon'
import { useLocale } from '../../context/LocaleContext'
import { getUI } from '../../utils/i18n'
import '../../pages/Page.css'
import '../../pages/About.css'

const TEAM = [
  {
    id: 1,
    nom: 'Rakoto Jean',
    role: 'Guide aventure & faune endémique',
    localisation: 'Ambalavao',
    photo: '/images/avatar1.jpg',
    langues: ['Français', 'Malgache', 'Anglais'],
    note: 4.9,
    avis: 87,
    bio: "Né à Antananarivo, Jean parcourt les sentiers de Madagascar depuis 15 ans. Spécialiste de l'Isalo, des Tsingy et de la grande traversée Nord-Sud.",
    en: {
      role: 'Adventure & endemic wildlife guide',
      bio: "Born in Antananarivo, Jean has walked the trails of Madagascar for 15 years. Specialist in Isalo, the Tsingy, and the Grand North-South Traverse.",
    },
    mg: {
      role: 'Mpitarika fitetezana sarotra sy biby manokana',
      bio: "Teraka tany Antananarivo, mandeha eny amin'ny lalan-tongotr'i Madagasikara nandritra ny 15 taona i Jean. Manam-pahaizana amin'ny Isalo, ny Tsingy ary ny fitetezana lehibe Avaratra-Atsimo.",
    },
  },
  {
    id: 2,
    nom: 'Solofo Andry',
    role: 'Guide nature & photographie',
    localisation: 'Andasibe',
    photo: '/images/avatar2.jpg',
    langues: ['Français', 'Malgache'],
    note: 4.8,
    avis: 64,
    bio: "Naturaliste passionné et photographe animalier, Solofo est votre meilleur allié pour observer lémuriens, caméléons et oiseaux endémiques dans leur milieu naturel.",
    en: {
      role: 'Nature & photography guide',
      bio: "A passionate naturalist and wildlife photographer, Solofo is your best ally for observing lemurs, chameleons and endemic birds in their natural habitat.",
    },
    mg: {
      role: 'Mpitarika natiora sy fakan-tsary',
      bio: "Mpankafy ny natiora sady mpaka sary biby, i Solofo no mpiara-dia tsaranao indrindra hijerena gidro, tanalahy ary vorona manokana any amin'ny tontolony voajanahary.",
    },
  },
  {
    id: 3,
    nom: 'Nirina Mamy',
    role: 'Guide culturel & villages locaux',
    localisation: 'Fianarantsoa',
    photo: '/images/avatar3.jpg',
    langues: ['Français', 'Malgache', 'Italien'],
    note: 5.0,
    avis: 42,
    bio: "Issue du peuple Betsileo, Nirina vous ouvre les portes des villages, des traditions et de l'artisanat des Hautes Terres avec une authenticité rare.",
    en: {
      role: 'Cultural & local villages guide',
      bio: "Hailing from the Betsileo people, Nirina opens the doors of the villages, traditions and craftsmanship of the Highlands with rare authenticity.",
    },
    mg: {
      role: 'Mpitarika ara-kolontsaina sy tanàna eny an-toerana',
      bio: "Avy amin'ny foko Betsileo, manokatra ny varavaran'ny tanàna, ny fomban-drazana ary ny asa tanan'ny Tany Avo amin'ny fahamarinana tsy fahita firy i Nirina.",
    },
  },
]

const ENGAGEMENTS = [
  {
    icon: 'leaf',
    titre: 'Écotourisme responsable',
    texte: "Chaque circuit est conçu pour minimiser l'impact sur les écosystèmes : groupes limités, bivouacs zéro déchet, sentiers balisés avec les parcs nationaux.",
    en: {
      titre: 'Responsible ecotourism',
      texte: "Every circuit is designed to minimize impact on ecosystems: small groups, zero-waste bivouacs, trails marked out with the national parks.",
    },
    mg: {
      titre: 'Fizahantany voajanahary tompon\'andraikitra',
      texte: "Ny sirkoity tsirairay dia natao mba hampihena ny fiantraikany amin'ny tontolo iainana: vondrona voafetra, toby tsy misy fako, lalana voamarika miaraka amin'ireo valanjavaboary.",
    },
  },
  {
    icon: 'users',
    titre: "Économie locale d'abord",
    texte: "Guides, porteurs, cuisiniers, hébergeurs — 100% de nos prestataires sont issus des régions traversées. Votre voyage crée des emplois durables sur place.",
    en: {
      titre: 'Local economy first',
      texte: "Guides, porters, cooks, hosts — 100% of our providers come from the regions we travel through. Your trip creates lasting local jobs.",
    },
    mg: {
      titre: 'Toe-karena eny an-toerana no laharam-pahamehana',
      texte: "Mpitarika, mpitondra entana, mpahandro, mpampiantrano — 100% amin'ireo mpanome tolotra dia avy amin'ny faritra aleha. Ny dianao dia mamorona asa maharitra eo an-toerana.",
    },
  },
  {
    icon: 'building',
    titre: 'Immersion authentique',
    texte: "Nuits chez l'habitant, repas familiaux, ateliers artisanaux : nous privilégions les rencontres réelles aux expériences standardisées.",
    en: {
      titre: 'Authentic immersion',
      texte: "Nights with local families, home-cooked meals, craft workshops: we favor real encounters over standardized experiences.",
    },
    mg: {
      titre: 'Fidirana lalina marina',
      texte: "Fandriana any amin'ny mponina, sakafo miaraka amin'ny fianakaviana, atelie asa tanana: mankasitraka ny fihaonana marina izahay fa tsy ny traikefa mahazatra.",
    },
  },
  {
    icon: 'gem',
    titre: 'Contribution conservation',
    texte: "Une partie de chaque réservation est reversée aux associations de protection de la biodiversité malgache avec lesquelles nous travaillons.",
    en: {
      titre: 'Conservation contribution',
      texte: "Part of every booking goes to the Malagasy biodiversity conservation associations we work with.",
    },
    mg: {
      titre: 'Fandraisana anjara amin\'ny fiarovana',
      texte: "Ampahany amin'ny famandrihana tsirairay dia averina amin'ireo fikambanana miaro ny harena biolojika malagasy iarahanay miasa.",
    },
  },
]

const ASSOCIATIONS = [
  {
    nom: 'Mitsinjo',
    lieu: 'Andasibe',
    role: 'Conservation lémuriens & forêt primaire',
    desc: "Association communautaire qui gère la réserve privée d'Andasibe, formant les guides locaux et finançant la reboisement des espèces endémiques.",
    lien: '#',
    en: {
      role: 'Lemur & primary forest conservation',
      desc: "Community association managing the Andasibe private reserve, training local guides and funding reforestation of endemic species.",
    },
    mg: {
      role: 'Fiarovana gidro sy ala voajanahary',
      desc: "Fikambanana ifotony mitantana ny valanjavaboary manokan'i Andasibe, mampiofana ireo mpitarika eny an-toerana ary mamatsy vola ny fambolen-kazo ho an'ireo karazana manokana.",
    },
  },
  {
    nom: 'Fanamby',
    lieu: 'Antananarivo',
    role: 'Aires protégées & biodiversité',
    desc: 'ONG nationale qui gère et protège plusieurs aires protégées à Madagascar, notamment dans les zones que nous traversons lors de nos circuits.',
    lien: '#',
    en: {
      role: 'Protected areas & biodiversity',
      desc: "National NGO managing and protecting several protected areas in Madagascar, including in zones our circuits travel through.",
    },
    mg: {
      role: 'Faritra voaaro sy harena biolojika',
      desc: "ONG nasionaly mitantana sy miaro faritra voaaro maro any Madagasikara, indrindra amin'ireo faritra alehan'ny sirkoitinay.",
    },
  },
  {
    nom: 'Zafimaniry Artisans',
    lieu: 'Ambositra',
    role: 'Préservation artisanat UNESCO',
    desc: "Coopérative d'artisans Zafimaniry qui perpétue l'art de la sculpture sur bois inscrit au patrimoine immatériel de l'UNESCO. Partenaire de notre circuit culturel.",
    lien: '#',
    en: {
      role: 'UNESCO craft preservation',
      desc: "Cooperative of Zafimaniry craftsmen who carry on the art of wood carving listed as UNESCO Intangible Heritage. Partner of our cultural circuit.",
    },
    mg: {
      role: 'Fikajiana asa tanana UNESCO',
      desc: "Kaoperativan'ny mpandrafitra Zafimaniry mitohy amin'ny zavakanto fandrafetana hazo voasoratra ao amin'ny lova tsy hita maso an'ny UNESCO. Mpiara-miombon'antoka amin'ny sirkoity ara-kolontsaina.",
    },
  },
]

function pick(val, locale) {
  if (typeof val !== 'object' || val === null) return val
  return val[locale] ?? val.fr
}

function localizeItem(item, locale) {
  const translation = item[locale]
  if (!translation) return item
  return { ...item, ...translation }
}

export default function AboutClient() {
  const { locale } = useLocale()
  const t = getUI(locale).about

  return (
    <div className="page">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">{t.eyebrow}</p>
          <h1 className="page-hero__title">{t.title}</h1>
          <p className="page-hero__subtitle">{t.subtitle}</p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">

          {/* Mission + Engagement */}
          <div className="about-page__intro page-grid-2">
            <div className="page-card">
              <h2>{t.missionTitle}</h2>
              <p>{t.missionText}</p>
            </div>
            <div className="page-card">
              <h2>{t.responsibleTitle}</h2>
              <p>{t.responsibleText}</p>
            </div>
          </div>

          {/* Chiffres */}
          <div className="about-page__stats">
            <div className="about-page__stat">
              <span className="about-page__stat-num">11</span>
              <span className="about-page__stat-label">{t.statCircuits}</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">500+</span>
              <span className="about-page__stat-label">{t.statTravelers}</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">3</span>
              <span className="about-page__stat-label">{t.statGuides}</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">5</span>
              <span className="about-page__stat-label">{t.statEcosystems}</span>
            </div>
          </div>

          {/* Paysages + Culture */}
          <div className="about-page__values page-grid-2">
            <div className="about-page__value">
              <div className="about-page__value-img">
                <Image src="/images/about2.jpg" alt="Paysages Madagascar" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <h3>{t.landscapesTitle}</h3>
                <p>{t.landscapesText}</p>
              </div>
            </div>
            <div className="about-page__value">
              <div className="about-page__value-img">
                <Image src="/images/about3.jpg" alt="Culture malgache" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <h3>{t.cultureTitle}</h3>
                <p>{t.cultureText}</p>
              </div>
            </div>
          </div>

          {/* Nos engagements */}
          <div className="about-engagements">
            <h2 className="about-section-title">{t.engagementsTitle}</h2>
            <div className="about-engagements__grid">
              {ENGAGEMENTS.map((baseE) => {
                const e = localizeItem(baseE, locale)
                return (
                  <div key={baseE.titre} className="about-engagement-card">
                    <span className="about-engagement-card__icon"><Icon name={e.icon} size={26} /></span>
                    <h3>{e.titre}</h3>
                    <p>{e.texte}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Nos guides */}
          <div className="about-team">
            <h2 className="about-section-title">{t.teamTitle}</h2>
            <p className="about-section-subtitle">{t.teamSubtitle}</p>
            <AboutTeamSection team={TEAM} />
          </div>

          {/* Associations partenaires */}
          <div className="about-associations">
            <h2 className="about-section-title">{t.associationsTitle}</h2>
            <p className="about-section-subtitle">{t.associationsSubtitle}</p>
            <div className="about-associations__grid">
              {ASSOCIATIONS.map((baseA) => {
                const a = localizeItem(baseA, locale)
                return (
                  <div key={baseA.nom} className="about-assoc-card">
                    <div className="about-assoc-card__top">
                      <div>
                        <h3 className="about-assoc-card__name">{a.nom}</h3>
                        <span className="about-assoc-card__lieu"><Icon name="pin" size={13} /> {a.lieu}</span>
                      </div>
                      <span className="about-assoc-card__role-tag">{a.role}</span>
                    </div>
                    <p className="about-assoc-card__desc">{a.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="about-cta">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
            <div className="about-cta__btns">
              <Link href="/circuits" className="btn-primary">{t.ctaCircuits}</Link>
              <Link href="/contact" className="btn-secondary">{t.ctaContact}</Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
