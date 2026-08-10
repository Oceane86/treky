'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getCircuitBySlug } from '../../../data/circuits'
import { adaptItinerary, adaptPrice } from '../../../utils/adaptItinerary'
import { useCurrency } from '../../../context/CurrencyContext'
import { useAuth } from '../../../context/AuthContext'
import { useFavorites } from '../../../context/FavoritesContext'
import { readJSON } from '../../../utils/storage'
import { MONTHS, CLIMAT_MAP, CLIMAT_ICON, CLIMAT_LABEL, getClimatKey, getClosure, formatMonthRange } from '../../../utils/climate'
import BookingModal from '../../../components/BookingModal'
import '../../../pages/CircuitDetail.css'

const CircuitMap = dynamic(() => import('../../../components/CircuitMap'), { ssr: false })

// Avis génériques utilisés uniquement si un circuit n'a pas d'entrée dans REVIEWS_BY_SLUG.
const DEFAULT_REVIEWS = [
  { id: 1, name: 'Jean Dupont',   avatar: '/images/avatar1.jpg', stars: 5, date: 'Mars 2026',    text: 'Une expérience absolument inoubliable. Le guide était exceptionnel, les paysages à couper le souffle.', tag: 'Randonneur passionné' },
  { id: 2, name: 'Marie Martin',  avatar: '/images/avatar2.jpg', stars: 5, date: 'Février 2026', text: 'Voyage en solo et je me suis sentie en sécurité à chaque instant. Organisation irréprochable.', tag: 'Voyageuse solo' },
  { id: 3, name: 'Thomas Bernard',avatar: '/images/avatar3.jpg', stars: 4, date: 'Janvier 2026', text: 'Superbes photos ramenées, la nature est époustouflante. Petite déception sur les lodges mais rien de grave.', tag: 'Photographe nature' },
]

// Avis propres à chaque circuit, pour ne pas afficher les 3 mêmes voyageurs partout.
const REVIEWS_BY_SLUG = {
  'decouverte-isalo': [
    { id: 101, name: 'Camille Dubois', avatar: '/images/avatar1.jpg', stars: 5, date: 'Juin 2026', text: 'Parfait pour un premier trek ! Les piscines naturelles du Canyon des Makis sont magiques, et Solofo connaît chaque recoin du parc.', tag: 'Premier trek' },
    { id: 102, name: 'Marc Legrand', avatar: '/images/avatar2.jpg', stars: 5, date: 'Mai 2026', text: "La Fenêtre de l'Isalo au coucher du soleil restera un des plus beaux souvenirs de ma vie. Guide au top.", tag: 'Photographe amateur' },
    { id: 103, name: 'Sophie Nguyen', avatar: null, stars: 4, date: 'Avril 2026', text: 'Très beau parcours, accessible même en famille. Juste un peu chaud en milieu de journée, prévoir beaucoup d\'eau.', tag: 'Voyage en famille' },
  ],
  'immersion-andringitra': [
    { id: 111, name: 'Julien Petit', avatar: '/images/avatar1.jpg', stars: 5, date: 'Juillet 2026', text: "L'ascension du Pic Boby au lever du soleil, c'est indescriptible. Jean nous a poussés sans jamais nous mettre en danger.", tag: 'Sommet conquis' },
    { id: 112, name: 'Anna Schmidt', avatar: '/images/avatar2.jpg', stars: 5, date: 'Juin 2026', text: 'Le bivouac en altitude était froid mais le ciel étoilé sans aucune pollution lumineuse valait chaque frisson.', tag: 'Amoureuse de montagne' },
    { id: 113, name: 'Karim Belkacem', avatar: null, stars: 4, date: 'Mai 2026', text: 'Niveau modéré annoncé mais la montée finale est costaud. Prévoyez d\'être en forme. Splendide malgré tout.', tag: 'Randonneur régulier' },
  ],
  'dedale-tsingy': [
    { id: 121, name: 'Laura Moreau', avatar: '/images/avatar1.jpg', stars: 5, date: 'Juillet 2026', text: 'Traverser les Tsingy sur les ponts de singe suspendus, sensations garanties ! Solofo rassure sans jamais infantiliser.', tag: 'Sensations fortes' },
    { id: 122, name: 'David Chen', avatar: '/images/avatar3.jpg', stars: 5, date: 'Juin 2026', text: 'La descente en pirogue sur la Manambolo après trois jours de calcaire acéré, un vrai moment de calme bienvenu.', tag: 'Voyage nature' },
    { id: 123, name: 'Elise Rousseau', avatar: null, stars: 4, date: 'Avril 2026', text: 'Attention si vous avez le vertige, certains passages sont impressionnants. Guide très pédagogue sur la sécurité.', tag: 'Aventurière prudente' },
  ],
  'makay-traversee': [
    { id: 131, name: 'Vincent Caron', avatar: '/images/avatar2.jpg', stars: 5, date: 'Août 2026', text: "L'expédition la plus exigeante que j'ai faite à Madagascar, et de loin la plus belle. Le Makay ne ressemble à rien d'autre.", tag: 'Expédition extrême' },
    { id: 132, name: 'Natasha Petrov', avatar: '/images/avatar3.jpg', stars: 5, date: 'Juillet 2026', text: 'Dix jours sans réseau, juste le canyon, la rivière et l\'équipe. Jean et les porteurs ont rendu l\'impossible confortable.', tag: 'Territoire vierge' },
    { id: 133, name: 'Diane Mbeki', avatar: null, stars: 4, date: 'Juin 2026', text: "Très physique, ce n'est pas un trek pour débuter. Mais la forêt fossile vaut à elle seule le déplacement.", tag: 'Grande aventurière' },
  ],
  'zafimaniry-culture': [
    { id: 141, name: 'Isabelle Laurent', avatar: '/images/avatar1.jpg', stars: 5, date: 'Mai 2026', text: 'Rencontrer les sculpteurs Zafimaniry dans leur village, un moment d\'humanité rare. Nirina traduisait avec beaucoup de tact.', tag: 'Immersion culturelle' },
    { id: 142, name: 'Thomas Weber', avatar: '/images/avatar2.jpg', stars: 4, date: 'Avril 2026', text: 'Artisanat incroyable, on repart avec des trésors. Les chemins entre villages sont un peu longs pour les moins sportifs.', tag: "Amateur d'artisanat" },
    { id: 143, name: 'Nadia Haddad', avatar: null, stars: 5, date: 'Mars 2026', text: "L'atelier sculpture avec les maîtres artisans restera un souvenir fort. Merci Solofo pour cette rencontre.", tag: 'Curieuse de traditions' },
  ],
  'parfums-epices': [
    { id: 151, name: 'Claire Fontaine', avatar: '/images/avatar3.jpg', stars: 5, date: 'Juin 2026', text: 'Un trek qui se hume autant qu\'il se marche. La plantation de vanille SAVA est un enchantement pour les sens.', tag: 'Épicurienne' },
    { id: 152, name: 'Marco Rossi', avatar: '/images/avatar1.jpg', stars: 5, date: 'Mai 2026', text: "La distillerie d'ylang-ylang était fascinante, et je suis reparti avec des huiles essentielles incroyables.", tag: 'Passionné de gastronomie' },
    { id: 153, name: 'Aminata Diallo', avatar: null, stars: 4, date: 'Avril 2026', text: "Très riche en découvertes, un peu court à mon goût. J'aurais aimé une journée de plus en plantation.", tag: 'Gourmande voyageuse' },
  ],
  'biodiversite-andasibe': [
    { id: 161, name: 'Paul Girard', avatar: '/images/avatar2.jpg', stars: 5, date: 'Juillet 2026', text: "Le chant des Indris au lever du jour m'a donné des frissons. Accessible en un week-end depuis Tana, aucune excuse pour rater ça.", tag: 'Amoureux des lémuriens' },
    { id: 162, name: 'Yuki Tanaka', avatar: '/images/avatar3.jpg', stars: 5, date: 'Juin 2026', text: 'Sortie nocturne incroyable, on a vu des caméléons partout. Jean a un œil hors du commun pour repérer la faune.', tag: 'Photographe naturaliste' },
    { id: 163, name: 'Léa Bernard', avatar: null, stars: 4, date: 'Mai 2026', text: 'Très beau parc, un peu fréquenté en haute saison. Idéal pour s\'initier à la forêt primaire malgache.', tag: 'Découverte nature' },
  ],
  'histoire-ambohimanga': [
    { id: 171, name: 'Pierre Lefebvre', avatar: '/images/avatar1.jpg', stars: 5, date: 'Mai 2026', text: "La colline royale d'Ambohimanga porte une charge historique impressionnante. Nirina raconte l'histoire merina avec passion.", tag: "Passionné d'histoire" },
    { id: 172, name: 'Sarah Cohen', avatar: '/images/avatar2.jpg', stars: 4, date: 'Avril 2026', text: 'Belle immersion patrimoniale, la Haute-Ville de Fianarantsoa est magnifique au coucher du soleil.', tag: 'Amatrice de patrimoine' },
    { id: 173, name: 'Rania Amrani', avatar: null, stars: 5, date: 'Mars 2026', text: 'Un trek culturel loin des clichés touristiques, on ressort avec une vraie compréhension de l\'histoire malgache.', tag: 'Curieuse du monde' },
  ],
  'sainte-marie-pirates-baleines': [
    { id: 181, name: 'Nicolas Roy', avatar: '/images/avatar3.jpg', stars: 5, date: 'Août 2026', text: 'Voir des baleines à bosse depuis le bateau, un moment suspendu. Toute la famille était bouche bée.', tag: 'Papa voyageur' },
    { id: 182, name: 'Emma Wilson', avatar: '/images/avatar1.jpg', stars: 5, date: 'Juillet 2026', text: 'Le cimetière pirate est fascinant, et les plages du nord de l\'île sont d\'une beauté sauvage rare.', tag: "Amoureuse d'histoire maritime" },
    { id: 183, name: 'Fabrice Nguyen', avatar: null, stars: 4, date: 'Juin 2026', text: "Très belle escapade, parfaite pour se reposer après un trek plus physique ailleurs sur l'île principale.", tag: 'Voyageur détente' },
  ],
  'rizieres-betsileo': [
    { id: 191, name: 'Charlotte Simon', avatar: '/images/avatar2.jpg', stars: 5, date: 'Mai 2026', text: "Dormir chez l'habitant au milieu des rizières en terrasses, une immersion Betsileo authentique et généreuse.", tag: "Amoureuse d'authenticité" },
    { id: 192, name: 'Hassan Youssef', avatar: '/images/avatar3.jpg', stars: 4, date: 'Avril 2026', text: "L'atelier tissage était passionnant. Petit bémol sur le confort de l'hébergement, mais l'accueil compense largement.", tag: "Curieux d'artisanat" },
    { id: 193, name: 'Mireille Traoré', avatar: null, stars: 5, date: 'Mars 2026', text: 'Nirina nous a appris tellement sur le cycle du riz et la vie paysanne des Hautes Terres. Un vrai coup de cœur.', tag: 'Passionnée de culture rurale' },
  ],
  'traversee-nord-sud': [
    { id: 201, name: 'Alexandre Faure', avatar: '/images/avatar1.jpg', stars: 5, date: 'Août 2026', text: '28 jours qui ont changé ma vision du voyage. Traverser Madagascar du nord au sud avec cette équipe, une expérience totale.', tag: 'Grand voyageur' },
    { id: 202, name: 'Ingrid Larsen', avatar: '/images/avatar2.jpg', stars: 5, date: 'Juillet 2026', text: 'Chaque région révèle un Madagascar différent : volcanique au nord, minéral dans l\'Isalo, océanique à Tuléar. Inoubliable.', tag: 'Exploratrice' },
    { id: 203, name: 'Omar Zidane', avatar: null, stars: 4, date: 'Juin 2026', text: 'Le circuit le plus complet que j\'ai fait, mais réservez-le uniquement si vous avez vraiment le temps et l\'expérience du trek.', tag: 'Trekkeur expérimenté' },
  ],
}

const RATING_BARS = [
  { stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },  { stars: 1, pct: 1 },
]

function infoIcon(text) {
  const t = text.toLowerCase()
  if (t.includes('chaussure') || t.includes('équipement') || t.includes('materiel')) return '🥾'
  if (t.includes('saison') || t.includes('période') || t.includes('recommandée')) return '📅'
  if (t.includes('physique') || t.includes('condition') || t.includes('expérience')) return '💪'
  if (t.includes('solaire') || t.includes('chapeau') || t.includes('soleil')) return '☀️'
  if (t.includes('groupe') || t.includes('personnes') || t.includes('limité')) return '👥'
  if (t.includes('accessible') || t.includes('famille')) return '✅'
  if (t.includes('eau') || t.includes('hydratation')) return '💧'
  return 'ℹ️'
}

export default function CircuitDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const circuit = getCircuitBySlug(slug)
  const baseReviews = REVIEWS_BY_SLUG[circuit?.slug] ?? DEFAULT_REVIEWS
  const { format } = useCurrency()
  const { isLoggedIn } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [selectedDays, setSelectedDays] = useState(5)
  const [descExpanded, setDescExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('jour')
  const [openStep, setOpenStep] = useState(null)
  const [showBooking, setShowBooking] = useState(false)
  const [showLoginGate, setShowLoginGate] = useState(false)
  const [toast, setToast] = useState(null)
  const [reviews, setReviews] = useState(() => baseReviews)
  const [reviewStars, setReviewStars] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(null)

  function openLightbox(idx) { setLightboxIdx(idx) }
  function closeLightbox() { setLightboxIdx(null) }
  function lightboxPrev() { setLightboxIdx((i) => (i - 1 + photos.length) % photos.length) }
  function lightboxNext() { setLightboxIdx((i) => (i + 1) % photos.length) }

  useEffect(() => {
    if (!circuit) return
    const wishes = readJSON('treky_wishes', null)
    if (wishes?.duree) {
      const max = circuit.maxDays ?? circuit.recommendedDays
      setSelectedDays(Math.min(Math.max(wishes.duree, circuit.minDays), max))
    } else {
      setSelectedDays(circuit.recommendedDays)
    }
  }, [circuit])

  useEffect(() => {
    if (!circuit) return
    const stored = readJSON(`treky_circuit_reviews_${circuit.slug}`, [])
    if (stored.length) setReviews((prev) => [...stored, ...prev])
  }, [circuit])

  if (!circuit) notFound()

  const itinerary = adaptItinerary(circuit.steps, selectedDays)
  const price = adaptPrice(circuit.priceAr, circuit.recommendedDays, selectedDays)
  const priceAr = Math.round(circuit.priceAr * selectedDays / circuit.recommendedDays)
  const isCondensed = selectedDays < circuit.recommendedDays
  const isExtended  = selectedDays > circuit.recommendedDays
  const isAdapted   = isCondensed || isExtended
  const photos = circuit.photos?.length >= 1 ? circuit.photos : [circuit.image]

  const fav = isFavorite(circuit.id)

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleReserve() {
    if (isLoggedIn) {
      setShowBooking(true)
    } else {
      setShowLoginGate(true)
    }
  }

  function handleBack() {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back()
    } else {
      router.push('/circuits')
    }
  }

  function handleFav() {
    if (!isLoggedIn) { setShowLoginGate(true); return }
    toggleFavorite(circuit.id)
    showToast(fav ? 'Retiré des favoris' : 'Ajouté aux favoris ♥')
  }

  function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: circuit.name, text: circuit.teaser, url })
    } else {
      navigator.clipboard.writeText(url).then(() => showToast('Lien copié dans le presse-papier'))
    }
  }

  function handleCompare() {
    showToast('Comparateur bientôt disponible')
  }

  function handleReviewSubmit(e) {
    e.preventDefault()
    if (!reviewStars || !reviewName.trim() || !reviewText.trim()) return
    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      avatar: null,
      stars: reviewStars,
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      text: reviewText.trim(),
      tag: 'Voyageur Treky',
    }
    setReviews((prev) => [newReview, ...prev])
    setReviewStars(0)
    setReviewName('')
    setReviewText('')
    setReviewSuccess(true)
    setTimeout(() => setReviewSuccess(false), 4000)
  }

  const stars = Math.round(circuit.rating)

  return (
    <div className="cd">

      {/* ── SECTION 1 · EN-TÊTE ── */}
      <div className="cd__header-wrap">
        <div className="container cd__header">
          <button type="button" className="cd__back" onClick={handleBack}>← Retour</button>
          <div className="cd__header-row">
            <div className="cd__header-info">
              <h1 className="cd__title">{circuit.name}</h1>
              <div className="cd__meta-row">
                <span className="cd__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                <span className="cd__rating-val">{circuit.rating}</span>
                <span className="cd__reviews">({circuit.reviews} avis)</span>
                <span className="cd__safe-badge">✓ Solo Sécurisé</span>
              </div>
            </div>
            <div className="cd__actions">
              <button className={`cd__action-btn${fav ? ' cd__action-btn--active' : ''}`} onClick={handleFav} title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                <span>{fav ? '♥' : '♡'}</span>
                <small>Favoris</small>
              </button>
              <button className="cd__action-btn" onClick={handleShare} title="Partager">
                <span>⤴</span>
                <small>Partager</small>
              </button>
              <button className="cd__action-btn" onClick={handleCompare} title="Comparer">
                <span>⊞</span>
                <small>Comparer</small>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 · GALERIE ── */}
      <div className="container cd__gallery">
        <div className="cd__gallery-main" onClick={() => openLightbox(0)} style={{ cursor: 'pointer' }}>
          <Image src={photos[0]} alt={circuit.name} fill sizes="(max-width: 900px) 100vw, 60vw" priority className="cd__gallery-big" />
          <button className="cd__gallery-all-btn" onClick={(e) => { e.stopPropagation(); openLightbox(0) }}>📷 Voir tout</button>
        </div>
        <div className="cd__gallery-grid">
          {photos.slice(1, 5).map((src, i) => (
            <div key={i} className="cd__gallery-thumb" onClick={() => openLightbox(i + 1)} style={{ cursor: 'pointer' }}>
              <Image src={src} alt={`${circuit.name} photo ${i + 2}`} fill sizes="(max-width: 900px) 50vw, 20vw" />
            </div>
          ))}
        </div>
      </div>

      {/* ── LAYOUT 2 COLONNES ── */}
      <div className="container cd__layout">

        {/* ── COLONNE GAUCHE ── */}
        <div className="cd__main">

          <section className="cd__section">
            <h2 className="cd__section-title">Présentation</h2>
            <div className={`cd__desc-wrap${descExpanded ? '' : ' cd__desc-wrap--clamped'}`}>
              <p className="cd__desc">{circuit.description}</p>
            </div>
            <button className="cd__expand-btn" onClick={() => setDescExpanded((v) => !v)}>
              {descExpanded ? 'Réduire ▲' : 'En savoir plus ▼'}
            </button>
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">Inclus dans le trek</h2>
            <div className="cd__inc-grid">
              <ul className="cd__inc-list">
                <li className="cd__inc-header">Inclus</li>
                {circuit.included.map((item) => (
                  <li key={item}><span className="cd__check">✓</span>{item}</li>
                ))}
              </ul>
              <ul className="cd__exc-list">
                <li className="cd__exc-header">Non inclus</li>
                {circuit.non_inclus.map((item) => (
                  <li key={item}><span className="cd__cross">✗</span>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">Plan du trek</h2>
            <div className="cd__tabs">
              <button
                className={`cd__tab${activeTab === 'jour' ? ' cd__tab--active' : ''}`}
                onClick={() => setActiveTab('jour')}
              >
                Jour par jour
              </button>
              <button
                className={`cd__tab${activeTab === 'depart' ? ' cd__tab--active' : ''}`}
                onClick={() => setActiveTab('depart')}
              >
                Dates de départ
              </button>
            </div>

            {activeTab === 'jour' ? (
              <div className="cd__accordion">
                {itinerary.map((step, idx) => (
                  <div
                    key={idx}
                    className={`cd__accordion-item${openStep === idx ? ' cd__accordion-item--open' : ''}`}
                  >
                    <button
                      className={`cd__accordion-trigger${step.extra ? ' cd__accordion-trigger--libre' : ''}`}
                      onClick={() => setOpenStep(openStep === idx ? null : idx)}
                    >
                      <span className={`cd__day-badge${step.extra ? ' cd__day-badge--libre' : ''}`}>J{step.day}</span>
                      <div className="cd__step-meta">
                        <span className="cd__step-title-text">{step.title}</span>
                      </div>
                      <span className="cd__accordion-chevron">{openStep === idx ? '▲' : '▼'}</span>
                    </button>
                    <div className="cd__accordion-body">
                      {step.extra ? (
                        <p className="cd__libre-desc">Journée à votre rythme — exploration libre, activité optionnelle ou repos.</p>
                      ) : (
                        <>
                          <p>{step.description}</p>

                          {step.lodge && (
                            <div className="cd__step-lodge">
                              <span className="cd__step-lodge-icon">
                                {step.typeHebergement === 'Bivouac' ? '⛺' : step.typeHebergement === 'Bungalow' ? '🏝' : step.typeHebergement === "Chez l'habitant" ? '🏡' : '🏨'}
                              </span>
                              <div>
                                <span className="cd__step-lodge-name">{step.lodge}</span>
                                <span className="cd__step-lodge-type">{step.typeHebergement}</span>
                              </div>
                            </div>
                          )}

                          {step.activities?.length > 0 && (
                            <ul className="cd__step-activities">
                              {step.activities.map((act, ai) => (
                                <li key={ai} className="cd__step-activity">
                                  <span className="cd__step-activity-dot" />
                                  {act}
                                </li>
                              ))}
                            </ul>
                          )}

                          {circuit.waypoints?.[idx] && (
                            <div className="cd__step-coords">
                              <span>🗺️</span>
                              <span>Point {idx + 1} sur le tracé</span>
                              {idx === 0 && <span className="cd__step-badge cd__step-badge--start">Départ</span>}
                              {idx === itinerary.length - 1 && <span className="cd__step-badge cd__step-badge--end">Arrivée</span>}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cd__depart-block">
                <p>
                  Les dates de départ sont disponibles sur demande. Contactez-nous pour
                  connaître les prochains départs groupés ou organiser un départ privé.
                </p>
                <Link href="/contact" className="btn-primary cd__depart-btn">
                  Demander les dates de départ
                </Link>
              </div>
            )}

            {circuit.waypoints?.length > 0 && (
              <div className="cd__plan-map">
                <div className="cd__plan-map-header">
                  <span className="cd__plan-map-title">Tracé du circuit</span>
                  <div className="cd__plan-map-legend">
                    <span className="cd__legend-item cd__legend-item--start">① Départ</span>
                    <span className="cd__legend-item cd__legend-item--end">② Arrivée</span>
                    <span className="cd__legend-item cd__legend-item--route">— Tracé</span>
                  </div>
                </div>
                <CircuitMap waypoints={circuit.waypoints} circuitName={circuit.name} />
                <p className="cd__plan-map-hint">
                  Cliquez sur un point pour voir le détail de l'étape · Molette pour zoomer
                </p>
              </div>
            )}
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">Infos pratiques</h2>
            <div className="cd__infos-grid">
              {circuit.infos_pratiques.map((info, i) => (
                <div key={i} className="cd__info-item">
                  <span className="cd__info-icon">{infoIcon(info)}</span>
                  <span className="cd__info-text">{info}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CLIMAT & MÉTÉO ── */}
          <section className="cd__section">
            <h2 className="cd__section-title">Climat & Météo</h2>
            <div className="cd__climat-grid">
              {MONTHS.map((m, i) => {
                const key = getClimatKey(circuit)
                const cond = (CLIMAT_MAP[key] || CLIMAT_MAP.seche)[i]
                return (
                  <div key={m} className="cd__climat-month">
                    <span className="cd__climat-month-label">{m}</span>
                    <div className={`cd__climat-bar cd__climat-bar--${cond}`} title={CLIMAT_LABEL[cond]}>
                      {CLIMAT_ICON[cond]}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="cd__climat-legend">
              {['ideal', 'ok', 'avoid'].map((c) => (
                <div key={c} className="cd__climat-legend-item">
                  <span className={`cd__climat-legend-dot cd__climat-legend-dot--${c}`} />
                  {CLIMAT_LABEL[c]}
                </div>
              ))}
            </div>
            {circuit.saison === 'seche' && (
              <p className="cd__climat-note">
                📅 Meilleure période : <strong>avril à novembre</strong> (saison sèche). Décembre à mars correspond à la saison des pluies — les sentiers peuvent être glissants et certains accès fermés.
              </p>
            )}
            {circuit.saison === 'toute-saison' && (
              <p className="cd__climat-note">
                📅 Ce circuit est praticable toute l'année. Évitez de préférence <strong>janvier et février</strong> (fortes pluies sur les hautes terres).
              </p>
            )}
            {circuit.slug === 'sainte-marie-pirates-baleines' && (
              <p className="cd__climat-note">
                🐋 L'observation des baleines à bosse est possible de <strong>juillet à septembre</strong>. En dehors de cette période, toutes les autres activités restent accessibles dans d'excellentes conditions.
              </p>
            )}
            {getClosure(circuit) && (
              <p className="cd__climat-note cd__climat-note--closed">
                🚫 <strong>Site fermé de {formatMonthRange(getClosure(circuit).months)}.</strong> {getClosure(circuit).note}
              </p>
            )}
          </section>

          {/* ── AVIS VOYAGEURS ── */}
          <section className="cd__section">
            <h2 className="cd__section-title">Avis voyageurs</h2>

            <div className="cd__reviews-summary">
              <div className="cd__reviews-score">
                <span className="cd__reviews-score-val">{circuit.rating}</span>
                <span className="cd__reviews-score-stars">
                  {'★'.repeat(Math.round(circuit.rating))}{'☆'.repeat(5 - Math.round(circuit.rating))}
                </span>
                <span className="cd__reviews-score-count">{circuit.reviews + reviews.length - baseReviews.length} avis</span>
              </div>
              <div className="cd__reviews-bars">
                {RATING_BARS.map(({ stars, pct }) => (
                  <div key={stars} className="cd__reviews-bar-row">
                    <span className="cd__reviews-bar-label">{stars}★</span>
                    <div className="cd__reviews-bar-track">
                      <div className="cd__reviews-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="cd__reviews-bar-count">{Math.round(circuit.reviews * pct / 100)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cd__reviews-list">
              {reviews.map((r) => (
                <div key={r.id} className="cd__review-card">
                  <div className="cd__review-header">
                    <div className="cd__review-author">
                      {r.avatar
                        ? <Image src={r.avatar} alt={r.name} width={40} height={40} className="cd__review-avatar" />
                        : <div className="cd__review-avatar-placeholder">{r.name[0]}</div>
                      }
                      <div>
                        <div className="cd__review-name">{r.name}</div>
                        <div className="cd__review-date">{r.date}</div>
                      </div>
                    </div>
                    <span className="cd__review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  </div>
                  <p className="cd__review-text">{r.text}</p>
                  {r.tag && <span className="cd__review-tag">{r.tag}</span>}
                </div>
              ))}
            </div>

            <form className="cd__review-form" onSubmit={handleReviewSubmit}>
              <h3 className="cd__review-form-title">Laisser un avis</h3>

              <div className="cd__review-form-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`cd__star-btn${(reviewHover || reviewStars) >= n ? ' cd__star-btn--active' : ''}`}
                    onClick={() => setReviewStars(n)}
                    onMouseEnter={() => setReviewHover(n)}
                    onMouseLeave={() => setReviewHover(0)}
                    aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="cd__review-form-grid">
                <div className="cd__review-form-field">
                  <label>Votre nom</label>
                  <input
                    type="text"
                    placeholder="Ex. Marie M."
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                  />
                </div>
                <div className="cd__review-form-field">
                  <label>Circuit effectué</label>
                  <input type="text" value={circuit.name} readOnly style={{ opacity: 0.6 }} />
                </div>
                <div className="cd__review-form-field cd__review-form-field--full">
                  <label>Votre avis</label>
                  <textarea
                    rows={4}
                    placeholder="Partagez votre expérience avec les futurs voyageurs…"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary cd__review-form-submit"
                disabled={!reviewStars || !reviewName.trim() || !reviewText.trim()}
              >
                Publier mon avis
              </button>

              {reviewSuccess && (
                <div className="cd__review-success">
                  ✓ Merci ! Votre avis a été publié.
                </div>
              )}
            </form>
          </section>
        </div>

        {/* ── COLONNE DROITE · WIDGET RÉSERVATION ── */}
        <aside className="cd__sidebar">
          <div className="cd__book-card">
            <div className="cd__book-price-block">
              <span className="cd__book-price-label">
                {isCondensed ? 'Prix condensé' : isExtended ? 'Prix étendu' : 'À partir de'}
              </span>
              <span className="cd__book-price-value">{format(price)}</span>
              {circuit.prix_reduit && (
                <span className="cd__book-price-original">au lieu de {format(circuit.prix_original)}</span>
              )}
            </div>

            <div className="cd__book-metas">
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Niveau</span>
                <span className="cd__book-meta-val">{circuit.level}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Groupe</span>
                <span className="cd__book-meta-val">{circuit.groupSize}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Note</span>
                <span className="cd__book-meta-val">★ {circuit.rating} · {circuit.reviews} avis</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">Région</span>
                <span className="cd__book-meta-val">{circuit.region}</span>
              </div>
            </div>

            <div className="cd__slider-block">
              <div className="cd__slider-header">
                <span className="cd__slider-label">Durée souhaitée</span>
                <div className="cd__slider-val">
                  <strong>{selectedDays} jour{selectedDays > 1 ? 's' : ''}</strong>
                  {isCondensed && <span className="cd__adapted-tag--condensed">Condensé</span>}
                  {isExtended  && <span className="cd__adapted-tag--extended">Étendu</span>}
                  {!isAdapted  && <span className="cd__adapted-tag--reco">Recommandé</span>}
                </div>
              </div>
              <input
                type="range"
                min={circuit.minDays}
                max={circuit.maxDays ?? circuit.recommendedDays}
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="cd__slider"
              />
              <div className="cd__slider-limits">
                <span>{circuit.minDays} j min.</span>
                <span>{circuit.recommendedDays} j reco.</span>
                <span>{circuit.maxDays ?? circuit.recommendedDays} j max.</span>
              </div>
              {isCondensed && <p className="cd__adapt-notice">Itinéraire condensé sur les étapes essentielles.</p>}
              {isExtended  && <p className="cd__adapt-notice cd__adapt-notice--extended">Journées libres ajoutées pour explorer à votre rythme.</p>}
            </div>

            <button className="btn-primary cd__book-btn" onClick={handleReserve}>
              Réserver ce trek
            </button>
            <p className="cd__book-note">Paiement MVola accepté · Annulation flexible</p>
          </div>
        </aside>
      </div>

      {showBooking && (
        <BookingModal
          circuit={circuit}
          selectedDays={selectedDays}
          priceAr={priceAr}
          onClose={() => setShowBooking(false)}
        />
      )}

      {showLoginGate && (
        <div className="cd__gate-overlay" onClick={(e) => e.target === e.currentTarget && setShowLoginGate(false)}>
          <div className="cd__gate-card">
            <button className="cd__gate-close" onClick={() => setShowLoginGate(false)}>✕</button>
            <div className="cd__gate-icon">🔒</div>
            <h3 className="cd__gate-title">Connexion requise</h3>
            <p className="cd__gate-text">
              Pour réserver ce trek, vous devez être connecté à votre compte Treky.
            </p>
            <div className="cd__gate-hint">
              <span className="cd__gate-hint-label">Compte démo</span>
              <code>oceane@treky.mg</code>
              <code>treky2026</code>
            </div>
            <button
              className="btn-primary cd__gate-btn"
              onClick={() => router.push(`/connexion?return=/circuits/${circuit.slug}`)}
            >
              Se connecter
            </button>
            <Link href="/inscription" className="cd__gate-register">
              Pas encore inscrit ? Créer un compte
            </Link>
          </div>
        </div>
      )}

      {toast && (
        <div className="cd__toast">{toast}</div>
      )}

      {lightboxIdx !== null && (
        <div className="cd__lightbox" onClick={closeLightbox}>
          <button className="cd__lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="cd__lightbox-prev" onClick={(e) => { e.stopPropagation(); lightboxPrev() }}>‹</button>
          <div className="cd__lightbox-img-wrap" onClick={(e) => e.stopPropagation()}>
            <img src={photos[lightboxIdx]} alt={`${circuit.name} ${lightboxIdx + 1}`} className="cd__lightbox-img" />
            <span className="cd__lightbox-counter">{lightboxIdx + 1} / {photos.length}</span>
          </div>
          <button className="cd__lightbox-next" onClick={(e) => { e.stopPropagation(); lightboxNext() }}>›</button>
        </div>
      )}
    </div>
  )
}
