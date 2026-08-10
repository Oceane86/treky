'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getCircuitBySlug, localizeCircuit } from '../../../data/circuits'
import { adaptItinerary, adaptPrice } from '../../../utils/adaptItinerary'
import { useCurrency } from '../../../context/CurrencyContext'
import { useAuth } from '../../../context/AuthContext'
import { useFavorites } from '../../../context/FavoritesContext'
import { useLocale } from '../../../context/LocaleContext'
import { readJSON } from '../../../utils/storage'
import { getMonths, CLIMAT_MAP, CLIMAT_ICON, climatLabel, getClimatKey, getClosure, getClosureNote, formatMonthRange } from '../../../utils/climate'
import { niveauLabel, formatGroupSize } from '../../../utils/matching'
import { getUI } from '../../../utils/i18n'
import BookingModal from '../../../components/BookingModal'
import Icon from '../../../components/Icon'
import '../../../pages/CircuitDetail.css'

const CircuitMap = dynamic(() => import('../../../components/CircuitMap'), { ssr: false })

// Avis génériques utilisés uniquement si un circuit n'a pas d'entrée dans REVIEWS_BY_SLUG.
// text/tag/date sont traduits (fr/en/mg) ; le nom du voyageur reste inchangé.
const DEFAULT_REVIEWS = [
  { id: 1, name: 'Jean Dupont',   avatar: '/images/avatar1.jpg', stars: 5,
    date: { fr: 'Mars 2026', en: 'March 2026', mg: 'Martsa 2026' },
    text: { fr: 'Une expérience absolument inoubliable. Le guide était exceptionnel, les paysages à couper le souffle.', en: 'An absolutely unforgettable experience. The guide was exceptional, the scenery breathtaking.', mg: 'Traikefa tsy hay hadinoina mihitsy. Nahavariana ilay mpitarika, ary nahatalanjona ny toe-tany.' },
    tag: { fr: 'Randonneur passionné', en: 'Passionate hiker', mg: 'Tia mandeha an-tongotra' } },
  { id: 2, name: 'Marie Martin',  avatar: '/images/avatar2.jpg', stars: 5,
    date: { fr: 'Février 2026', en: 'February 2026', mg: 'Febroary 2026' },
    text: { fr: 'Voyage en solo et je me suis sentie en sécurité à chaque instant. Organisation irréprochable.', en: 'Traveled solo and felt safe at every moment. Flawless organization.', mg: 'Nandeha irery aho ary tsy nanana ahiahy ny amin\'ny fiarovana. Tena nikarakara tsara ny fandaminana.' },
    tag: { fr: 'Voyageuse solo', en: 'Solo traveler', mg: 'Mpandeha irery' } },
  { id: 3, name: 'Thomas Bernard',avatar: '/images/avatar3.jpg', stars: 4,
    date: { fr: 'Janvier 2026', en: 'January 2026', mg: 'Janoary 2026' },
    text: { fr: 'Superbes photos ramenées, la nature est époustouflante. Petite déception sur les lodges mais rien de grave.', en: 'Brought back superb photos, the nature is breathtaking. Slightly disappointed by the lodges but nothing serious.', mg: 'Nahazo sary tsara be aho, tena mahatalanjona ny natiora. Kely fahadisoam-panantenana tamin\'ireo lojy fa tsy misy olana lehibe.' },
    tag: { fr: 'Photographe nature', en: 'Nature photographer', mg: 'Mpaka sary natiora' } },
]

// Avis propres à chaque circuit, pour ne pas afficher les 3 mêmes voyageurs partout.
const REVIEWS_BY_SLUG = {
  'decouverte-isalo': [
    { id: 101, name: 'Camille Dubois', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: 'Parfait pour un premier trek ! Les piscines naturelles du Canyon des Makis sont magiques, et Solofo connaît chaque recoin du parc.', en: 'Perfect for a first trek! The natural pools of Canyon des Makis are magical, and Solofo knows every corner of the park.', mg: 'Tena tsara ho an\'ny fisandratana voalohany! Mahagaga ireo dobo voajanahary ao amin\'ny Canyon des Makis, ary fantatr\'i Solofo tsara avokoa ny zoro rehetra ao amin\'ny valanjavaboary.' },
      tag: { fr: 'Premier trek', en: 'First trek', mg: 'Fisandratana voalohany' } },
    { id: 102, name: 'Marc Legrand', avatar: '/images/avatar2.jpg', stars: 5,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "La Fenêtre de l'Isalo au coucher du soleil restera un des plus beaux souvenirs de ma vie. Guide au top.", en: "Isalo Window at sunset will remain one of the most beautiful memories of my life. Top-notch guide.", mg: 'Ny Varavarankelin\'i Isalo amin\'ny filentehan\'ny masoandro dia hijanona ho iray amin\'ireo fahatsiarovana tsara indrindra amin\'ny fiainako. Mpitarika mendrika.' },
      tag: { fr: 'Photographe amateur', en: 'Amateur photographer', mg: 'Mpaka sary tia zavakanto' } },
    { id: 103, name: 'Sophie Nguyen', avatar: null, stars: 4,
      date: { fr: 'Avril 2026', en: 'April 2026', mg: 'Aprily 2026' },
      text: { fr: "Très beau parcours, accessible même en famille. Juste un peu chaud en milieu de journée, prévoir beaucoup d'eau.", en: 'Beautiful route, accessible even with family. Just a bit hot at midday, bring plenty of water.', mg: 'Lalana tsara be, mety na dia ho an\'ny fianakaviana aza. Mafana kely amin\'ny mitataovovonana, mila mitondra rano be.' },
      tag: { fr: 'Voyage en famille', en: 'Family trip', mg: 'Dia miaraka amin\'ny fianakaviana' } },
  ],
  'immersion-andringitra': [
    { id: 111, name: 'Julien Petit', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Juillet 2026', en: 'July 2026', mg: 'Jolay 2026' },
      text: { fr: "L'ascension du Pic Boby au lever du soleil, c'est indescriptible. Jean nous a poussés sans jamais nous mettre en danger.", en: 'Climbing Pic Boby at sunrise is indescribable. Jean pushed us without ever putting us in danger.', mg: 'Tsy hay lazaina ny fiakarana ny Pic Boby amin\'ny fiposahan\'ny masoandro. Nanosika anay i Jean nefa tsy nanisy loza velively.' },
      tag: { fr: 'Sommet conquis', en: 'Summit conquered', mg: 'Tampony resy' } },
    { id: 112, name: 'Anna Schmidt', avatar: '/images/avatar2.jpg', stars: 5,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: 'Le bivouac en altitude était froid mais le ciel étoilé sans aucune pollution lumineuse valait chaque frisson.', en: 'The high-altitude bivouac was cold but the starry sky with zero light pollution was worth every shiver.', mg: 'Mangatsiaka ilay toby avo be fa tena mendrika ilay lanitra feno kintana tsy misy fanelezan-tara.' },
      tag: { fr: 'Amoureuse de montagne', en: 'Mountain lover', mg: 'Tia tendrombohitra' } },
    { id: 113, name: 'Karim Belkacem', avatar: null, stars: 4,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "Niveau modéré annoncé mais la montée finale est costaud. Prévoyez d'être en forme. Splendide malgré tout.", en: 'Advertised as moderate level but the final climb is tough. Make sure you\'re fit. Splendid nonetheless.', mg: 'Voalaza fa antonony ilay haavony fa mafy ilay fiakarana farany. Mila mahery vaika. Tsara be na izany aza.' },
      tag: { fr: 'Randonneur régulier', en: 'Regular hiker', mg: 'Mpandeha an-tongotra mahazatra' } },
  ],
  'dedale-tsingy': [
    { id: 121, name: 'Laura Moreau', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Juillet 2026', en: 'July 2026', mg: 'Jolay 2026' },
      text: { fr: 'Traverser les Tsingy sur les ponts de singe suspendus, sensations garanties ! Solofo rassure sans jamais infantiliser.', en: 'Crossing the Tsingy on the suspended monkey bridges, guaranteed thrills! Solofo reassures without ever being condescending.', mg: 'Ny fitsenana ny Tsingy amin\'ireo tetezana mihantona, tena mahavelona fihetseham-po! Manome toky i Solofo nefa tsy manambany.' },
      tag: { fr: 'Sensations fortes', en: 'Thrill seeker', mg: 'Tia fihetseham-po mahery' } },
    { id: 122, name: 'David Chen', avatar: '/images/avatar3.jpg', stars: 5,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: "La descente en pirogue sur la Manambolo après trois jours de calcaire acéré, un vrai moment de calme bienvenu.", en: 'The dugout canoe descent on the Manambolo after three days of sharp limestone, a truly welcome moment of calm.', mg: 'Ny fidinana an-dakana amin\'ny Manambolo taorian\'ny telo andro tamin\'ny vato lasarosaro, tena fotoana fiadanana nilaina.' },
      tag: { fr: 'Voyage nature', en: 'Nature trip', mg: 'Dia natiora' } },
    { id: 123, name: 'Elise Rousseau', avatar: null, stars: 4,
      date: { fr: 'Avril 2026', en: 'April 2026', mg: 'Aprily 2026' },
      text: { fr: 'Attention si vous avez le vertige, certains passages sont impressionnants. Guide très pédagogue sur la sécurité.', en: 'Careful if you\'re afraid of heights, some passages are impressive. Guide very thorough on safety.', mg: 'Mitandrema raha matahotra ny haavo ianao, misy toerana sasany mampatahotra. Tena mampianatra tsara momba ny fiarovana ilay mpitarika.' },
      tag: { fr: 'Aventurière prudente', en: 'Careful adventurer', mg: 'Mpitety malina' } },
  ],
  'makay-traversee': [
    { id: 131, name: 'Vincent Caron', avatar: '/images/avatar2.jpg', stars: 5,
      date: { fr: 'Août 2026', en: 'August 2026', mg: 'Aogositra 2026' },
      text: { fr: "L'expédition la plus exigeante que j'ai faite à Madagascar, et de loin la plus belle. Le Makay ne ressemble à rien d'autre.", en: 'The most demanding expedition I\'ve done in Madagascar, and by far the most beautiful. The Makay is unlike anything else.', mg: 'Ny dia sarotra indrindra vitako tany Madagasikara, ary tena tsara tarehy indrindra. Tsy misy mitovy amin\'ny Makay.' },
      tag: { fr: 'Expédition extrême', en: 'Extreme expedition', mg: 'Dia sarotra' } },
    { id: 132, name: 'Natasha Petrov', avatar: '/images/avatar3.jpg', stars: 5,
      date: { fr: 'Juillet 2026', en: 'July 2026', mg: 'Jolay 2026' },
      text: { fr: "Dix jours sans réseau, juste le canyon, la rivière et l'équipe. Jean et les porteurs ont rendu l'impossible confortable.", en: 'Ten days with no signal, just the canyon, the river and the team. Jean and the porters made the impossible comfortable.', mg: 'Folo andro tsy nisy réseau, ny hantsana, ny renirano ary ny ekipa fotsiny. Nataon\'i Jean sy ireo mpitondra entana ho mora ny zavatra sarotra.' },
      tag: { fr: 'Territoire vierge', en: 'Untouched territory', mg: 'Faritany mbola virjiny' } },
    { id: 133, name: 'Diane Mbeki', avatar: null, stars: 4,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: "Très physique, ce n'est pas un trek pour débuter. Mais la forêt fossile vaut à elle seule le déplacement.", en: 'Very physical, not a trek for beginners. But the fossil forest alone is worth the trip.', mg: 'Mila hery be, tsy fisandratana ho an\'ny mpiantomboka. Fa ny ala fôsily irery ihany dia mendrika ny dia.' },
      tag: { fr: 'Grande aventurière', en: 'Seasoned adventurer', mg: 'Mpitety mavitrika' } },
  ],
  'zafimaniry-culture': [
    { id: 141, name: 'Isabelle Laurent', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "Rencontrer les sculpteurs Zafimaniry dans leur village, un moment d'humanité rare. Nirina traduisait avec beaucoup de tact.", en: 'Meeting the Zafimaniry carvers in their village, a rare moment of humanity. Nirina translated with great tact.', mg: 'Ny fihaonana amin\'ireo mpandrafitra Zafimaniry ao an-tanànany, tena fotoana miavaka. Nandika tamin-kitsimpo be i Nirina.' },
      tag: { fr: 'Immersion culturelle', en: 'Cultural immersion', mg: 'Fidirana lalina amin\'ny kolontsaina' } },
    { id: 142, name: 'Thomas Weber', avatar: '/images/avatar2.jpg', stars: 4,
      date: { fr: 'Avril 2026', en: 'April 2026', mg: 'Aprily 2026' },
      text: { fr: 'Artisanat incroyable, on repart avec des trésors. Les chemins entre villages sont un peu longs pour les moins sportifs.', en: 'Incredible craftsmanship, you leave with treasures. The paths between villages are a bit long for the less athletic.', mg: 'Mahagaga ny asa tanana, mitondra harena mianao rehefa miala. Lava kely ny lalana eo anelanelan\'ireo tanàna ho an\'izay tsy dia mahery.' },
      tag: { fr: "Amateur d'artisanat", en: 'Craft enthusiast', mg: 'Tia asa tanana' } },
    { id: 143, name: 'Nadia Haddad', avatar: null, stars: 5,
      date: { fr: 'Mars 2026', en: 'March 2026', mg: 'Martsa 2026' },
      text: { fr: "L'atelier sculpture avec les maîtres artisans restera un souvenir fort. Merci Solofo pour cette rencontre.", en: 'The carving workshop with the master craftsmen will remain a powerful memory. Thank you Solofo for this encounter.', mg: 'Hijanona ho fahatsiarovana lehibe ny atelie fandrafetana niaraka tamin\'ireo mpampianatra. Misaotra i Solofo tamin\'ity fihaonana ity.' },
      tag: { fr: 'Curieuse de traditions', en: 'Curious about traditions', mg: 'Liana amin\'ny fomban-drazana' } },
  ],
  'parfums-epices': [
    { id: 151, name: 'Claire Fontaine', avatar: '/images/avatar3.jpg', stars: 5,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: "Un trek qui se hume autant qu'il se marche. La plantation de vanille SAVA est un enchantement pour les sens.", en: 'A trek you smell as much as you walk. The SAVA vanilla plantation is a delight for the senses.', mg: 'Fisandratana tsofina fofona toy izay dieana. Mahafinaritra ny fanentsana ho an\'ny fahatsiarovana ilay fambolena voanila SAVA.' },
      tag: { fr: 'Épicurienne', en: 'Epicurean', mg: 'Tia zava-tsoa' } },
    { id: 152, name: 'Marco Rossi', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "La distillerie d'ylang-ylang était fascinante, et je suis reparti avec des huiles essentielles incroyables.", en: 'The ylang-ylang distillery was fascinating, and I left with incredible essential oils.', mg: 'Nahavariana ilay toeram-panamboarana ylang-ylang, ary nitondra menaka tena tsara be aho rehefa niala.' },
      tag: { fr: 'Passionné de gastronomie', en: 'Food enthusiast', mg: 'Tia sakafo' } },
    { id: 153, name: 'Aminata Diallo', avatar: null, stars: 4,
      date: { fr: 'Avril 2026', en: 'April 2026', mg: 'Aprily 2026' },
      text: { fr: "Très riche en découvertes, un peu court à mon goût. J'aurais aimé une journée de plus en plantation.", en: 'Very rich in discoveries, a bit short for my taste. I would have liked one more day at the plantation.', mg: 'Be zavatra hita, fohy kely tamiko. Tiako raha nisy andro iray fanampiny tao amin\'ny fambolena.' },
      tag: { fr: 'Gourmande voyageuse', en: 'Foodie traveler', mg: 'Mpandeha tia sakafo' } },
  ],
  'biodiversite-andasibe': [
    { id: 161, name: 'Paul Girard', avatar: '/images/avatar2.jpg', stars: 5,
      date: { fr: 'Juillet 2026', en: 'July 2026', mg: 'Jolay 2026' },
      text: { fr: "Le chant des Indris au lever du jour m'a donné des frissons. Accessible en un week-end depuis Tana, aucune excuse pour rater ça.", en: 'The Indris\' song at dawn gave me chills. Reachable in a weekend from Tana, no excuse to miss it.', mg: 'Nampiendrika ahy ny hiran\'ny Indry amin\'ny fahazavan\'ny andro. Azo tratrarina amin\'ny herinandro faran\'i Tana, tsy misy antony hahatsy hitsidika azy.' },
      tag: { fr: 'Amoureux des lémuriens', en: 'Lemur lover', mg: 'Tia gidro' } },
    { id: 162, name: 'Yuki Tanaka', avatar: '/images/avatar3.jpg', stars: 5,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: 'Sortie nocturne incroyable, on a vu des caméléons partout. Jean a un œil hors du commun pour repérer la faune.', en: 'Incredible night walk, we saw chameleons everywhere. Jean has an extraordinary eye for spotting wildlife.', mg: 'Mahagaga be ilay fivoahana amin\'ny alina, nahita tanalahy be dia be izahay. Manana maso miavaka i Jean amin\'ny fikarohana biby.' },
      tag: { fr: 'Photographe naturaliste', en: 'Wildlife photographer', mg: 'Mpaka sary natiora' } },
    { id: 163, name: 'Léa Bernard', avatar: null, stars: 4,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "Très beau parc, un peu fréquenté en haute saison. Idéal pour s'initier à la forêt primaire malgache.", en: 'Beautiful park, a bit crowded in high season. Ideal introduction to Malagasy primary forest.', mg: 'Tena tsara ilay valanjavaboary, be mpitsidika kely amin\'ny vanim-potoana be mpizahatany. Mendrika ho fanombohana ny ala voajanahary malagasy.' },
      tag: { fr: 'Découverte nature', en: 'Nature discovery', mg: 'Fikarohana natiora' } },
  ],
  'histoire-ambohimanga': [
    { id: 171, name: 'Pierre Lefebvre', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "La colline royale d'Ambohimanga porte une charge historique impressionnante. Nirina raconte l'histoire merina avec passion.", en: 'The royal hill of Ambohimanga carries an impressive historical weight. Nirina tells the Merina history with passion.', mg: 'Mitondra tantara lehibe ny havoana mpanjakan\'i Ambohimanga. Milaza ny tantaran\'ny Merina amin-kafanam-po i Nirina.' },
      tag: { fr: "Passionné d'histoire", en: 'History enthusiast', mg: 'Tia tantara' } },
    { id: 172, name: 'Sarah Cohen', avatar: '/images/avatar2.jpg', stars: 4,
      date: { fr: 'Avril 2026', en: 'April 2026', mg: 'Aprily 2026' },
      text: { fr: 'Belle immersion patrimoniale, la Haute-Ville de Fianarantsoa est magnifique au coucher du soleil.', en: 'Beautiful heritage immersion, the Upper Town of Fianarantsoa is magnificent at sunset.', mg: 'Tsara ilay fidirana amin\'ny lova ara-kolontsaina, tena tsara tarehy ny Tanàna Ambony ao Fianarantsoa amin\'ny filentehan\'ny masoandro.' },
      tag: { fr: 'Amatrice de patrimoine', en: 'Heritage enthusiast', mg: 'Tia lova ara-kolontsaina' } },
    { id: 173, name: 'Rania Amrani', avatar: null, stars: 5,
      date: { fr: 'Mars 2026', en: 'March 2026', mg: 'Martsa 2026' },
      text: { fr: "Un trek culturel loin des clichés touristiques, on ressort avec une vraie compréhension de l'histoire malgache.", en: 'A cultural trek far from tourist clichés, you leave with a real understanding of Malagasy history.', mg: 'Fisandratana ara-kolontsaina lavitry ny fahazarana mahazatra ny mpizahatany, mahazo fahatakarana tena marina ny tantara malagasy rehefa miala.' },
      tag: { fr: 'Curieuse du monde', en: 'World explorer', mg: 'Liana amin\'izao tontolo izao' } },
  ],
  'sainte-marie-pirates-baleines': [
    { id: 181, name: 'Nicolas Roy', avatar: '/images/avatar3.jpg', stars: 5,
      date: { fr: 'Août 2026', en: 'August 2026', mg: 'Aogositra 2026' },
      text: { fr: 'Voir des baleines à bosse depuis le bateau, un moment suspendu. Toute la famille était bouche bée.', en: 'Seeing humpback whales from the boat, a suspended moment. The whole family was speechless.', mg: 'Ny fahitana trozona avy amin\'ny sambo, tena fotoana tsy hay adino. Talanjona daholo ny fianakaviana manontolo.' },
      tag: { fr: 'Papa voyageur', en: 'Traveling dad', mg: 'Raiamandreny mpandeha' } },
    { id: 182, name: 'Emma Wilson', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Juillet 2026', en: 'July 2026', mg: 'Jolay 2026' },
      text: { fr: "Le cimetière pirate est fascinant, et les plages du nord de l'île sont d'une beauté sauvage rare.", en: 'The pirate cemetery is fascinating, and the beaches on the north of the island have a rare wild beauty.', mg: 'Mahavariana ilay fasan\'ny jiolahy an-dranomasina, ary tena tsara tarehy be ireo morontsiraka avaratr\'ilay nosy.' },
      tag: { fr: "Amoureuse d'histoire maritime", en: 'Maritime history lover', mg: 'Tia tantara an-dranomasina' } },
    { id: 183, name: 'Fabrice Nguyen', avatar: null, stars: 4,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: "Très belle escapade, parfaite pour se reposer après un trek plus physique ailleurs sur l'île principale.", en: 'Beautiful getaway, perfect to rest after a more physical trek elsewhere on the main island.', mg: 'Tena tsara ilay dia, mendrika hialan-tsasatra aorian\'ny fisandratana mafy tao amin\'ny nosy lehibe.' },
      tag: { fr: 'Voyageur détente', en: 'Relaxed traveler', mg: 'Mpandeha mitady fiadanana' } },
  ],
  'rizieres-betsileo': [
    { id: 191, name: 'Charlotte Simon', avatar: '/images/avatar2.jpg', stars: 5,
      date: { fr: 'Mai 2026', en: 'May 2026', mg: 'Mey 2026' },
      text: { fr: "Dormir chez l'habitant au milieu des rizières en terrasses, une immersion Betsileo authentique et généreuse.", en: 'Staying with locals amid the terraced rice fields, an authentic and generous Betsileo immersion.', mg: 'Ny fandriana any amin\'ny mponina eo afovoan\'ny tanimbary an-tehezana, fidirana marina sy malala-tanana amin\'ny kolontsaina Betsileo.' },
      tag: { fr: "Amoureuse d'authenticité", en: 'Authenticity seeker', mg: 'Tia zavatra marina' } },
    { id: 192, name: 'Hassan Youssef', avatar: '/images/avatar3.jpg', stars: 4,
      date: { fr: 'Avril 2026', en: 'April 2026', mg: 'Aprily 2026' },
      text: { fr: "L'atelier tissage était passionnant. Petit bémol sur le confort de l'hébergement, mais l'accueil compense largement.", en: 'The weaving workshop was fascinating. Minor downside on accommodation comfort, but the welcome more than makes up for it.', mg: 'Nahavariana ny atelie fanenomana. Kely ny fahatsapana amin\'ny fandriana fa mihoatra lavitra izany ny fandraisana.' },
      tag: { fr: "Curieux d'artisanat", en: 'Craft enthusiast', mg: 'Liana amin\'ny asa tanana' } },
    { id: 193, name: 'Mireille Traoré', avatar: null, stars: 5,
      date: { fr: 'Mars 2026', en: 'March 2026', mg: 'Martsa 2026' },
      text: { fr: 'Nirina nous a appris tellement sur le cycle du riz et la vie paysanne des Hautes Terres. Un vrai coup de cœur.', en: 'Nirina taught us so much about the rice cycle and farming life in the Highlands. A real favorite.', mg: 'Nampianatra anay be dia be i Nirina momba ny fizotry ny vary sy ny fiainan\'ny tantsaha any amin\'ny Tany Avo. Tena tia be.' },
      tag: { fr: 'Passionnée de culture rurale', en: 'Rural culture enthusiast', mg: 'Tia fomba fiainana ambanivohitra' } },
  ],
  'traversee-nord-sud': [
    { id: 201, name: 'Alexandre Faure', avatar: '/images/avatar1.jpg', stars: 5,
      date: { fr: 'Août 2026', en: 'August 2026', mg: 'Aogositra 2026' },
      text: { fr: '28 jours qui ont changé ma vision du voyage. Traverser Madagascar du nord au sud avec cette équipe, une expérience totale.', en: '28 days that changed my vision of travel. Crossing Madagascar from north to south with this team, a total experience.', mg: 'Andro 28 nanova ny fomba fijeriko ny dia. Ny fitetezana an\'i Madagasikara avy any avaratra ka hatrany atsimo niaraka tamin\'ity ekipa ity, traikefa feno.' },
      tag: { fr: 'Grand voyageur', en: 'Seasoned traveler', mg: 'Mpandeha be traikefa' } },
    { id: 202, name: 'Ingrid Larsen', avatar: '/images/avatar2.jpg', stars: 5,
      date: { fr: 'Juillet 2026', en: 'July 2026', mg: 'Jolay 2026' },
      text: { fr: "Chaque région révèle un Madagascar différent : volcanique au nord, minéral dans l'Isalo, océanique à Tuléar. Inoubliable.", en: 'Each region reveals a different Madagascar: volcanic in the north, mineral in Isalo, oceanic in Tuléar. Unforgettable.', mg: 'Samy manambara an\'i Madagasikara hafa ny faritra tsirairay: volkanika any avaratra, vato any Isalo, ranomasina any Toliara. Tsy hay hadinoina.' },
      tag: { fr: 'Exploratrice', en: 'Explorer', mg: 'Mpikaroka' } },
    { id: 203, name: 'Omar Zidane', avatar: null, stars: 4,
      date: { fr: 'Juin 2026', en: 'June 2026', mg: 'Jona 2026' },
      text: { fr: "Le circuit le plus complet que j'ai fait, mais réservez-le uniquement si vous avez vraiment le temps et l'expérience du trek.", en: 'The most complete circuit I\'ve done, but only book it if you truly have the time and trekking experience.', mg: 'Ny sirkoity feno indrindra vitako, kanefa aoka hotsidihina raha manana fotoana sy traikefa amin\'ny fisandratana marina ianao.' },
      tag: { fr: 'Trekkeur expérimenté', en: 'Experienced trekker', mg: 'Mpisandratra be traikefa' } },
  ],
}

const RATING_BARS = [
  { stars: 5, pct: 72 }, { stars: 4, pct: 18 }, { stars: 3, pct: 7 },
  { stars: 2, pct: 2 },  { stars: 1, pct: 1 },
]

// Les avis pré-remplis stockent date/text/tag en objets {fr,en,mg} ; les avis
// soumis en direct par un visiteur restent de simples chaînes (langue saisie).
function pick(val, locale) {
  return typeof val === 'string' ? val : (val[locale] ?? val.fr)
}

const DRY_SEASON_RANGE = { fr: 'avril à novembre', en: 'April to November', mg: 'Aprily ka hatramin\'ny Novambra' }
const RAIN_MONTHS = { fr: 'janvier et février', en: 'January and February', mg: 'Janoary sy Febroary' }
const WHALE_MONTHS = { fr: 'juillet à septembre', en: 'July to September', mg: 'Jolay ka hatramin\'ny Septambra' }

function infoIcon(text) {
  const t = text.toLowerCase()
  if (t.includes('chaussure') || t.includes('équipement') || t.includes('materiel') || t.includes('shoe') || t.includes('gear') || t.includes('equipment')) return 'boot'
  if (t.includes('saison') || t.includes('période') || t.includes('recommandée') || t.includes('season') || t.includes('period') || t.includes('recommended')) return 'calendar'
  if (t.includes('physique') || t.includes('condition') || t.includes('expérience') || t.includes('physical') || t.includes('experience')) return 'strength'
  if (t.includes('solaire') || t.includes('chapeau') || t.includes('soleil') || t.includes('sun') || t.includes('hat')) return 'sun'
  if (t.includes('groupe') || t.includes('personnes') || t.includes('limité') || t.includes('group') || t.includes('people') || t.includes('limited')) return 'users'
  if (t.includes('accessible') || t.includes('famille') || t.includes('family')) return 'check'
  if (t.includes('eau') || t.includes('hydratation') || t.includes('water') || t.includes('hydration')) return 'droplet'
  if (t.includes('accès') || t.includes('route') || t.includes('piste') || t.includes('vol') || t.includes('access') || t.includes('flight') || t.includes('road') || t.includes('track')) return 'map'
  return 'info'
}

export default function CircuitDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { locale } = useLocale()
  const baseCircuit = getCircuitBySlug(slug)
  const circuit = localizeCircuit(baseCircuit, locale)
  const t = getUI(locale).circuitDetail
  const baseReviews = REVIEWS_BY_SLUG[baseCircuit?.slug] ?? DEFAULT_REVIEWS
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

  const itinerary = adaptItinerary(circuit.steps, selectedDays, locale)
  const price = adaptPrice(circuit.priceAr, circuit.recommendedDays, selectedDays)
  const priceAr = Math.round(circuit.priceAr * selectedDays / circuit.recommendedDays)
  const isCondensed = selectedDays < circuit.recommendedDays
  const isExtended  = selectedDays > circuit.recommendedDays
  const isAdapted   = isCondensed || isExtended
  const photos = circuit.photos?.length >= 1 ? circuit.photos : [circuit.image]

  const fav = isFavorite(circuit.id)
  const levelLabel = niveauLabel(baseCircuit.level, locale)
  const months = getMonths(locale)

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
    showToast(fav ? t.removedFromFavorites : `${t.addedToFavorites} ♥`)
  }

  function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      navigator.share({ title: circuit.name, text: circuit.teaser, url })
    } else {
      navigator.clipboard.writeText(url).then(() => showToast(t.linkCopied))
    }
  }

  function handleCompare() {
    showToast(t.compareSoon)
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
          <button type="button" className="cd__back" onClick={handleBack}>← {t.back}</button>
          <div className="cd__header-row">
            <div className="cd__header-info">
              <h1 className="cd__title">{circuit.name}</h1>
              <div className="cd__meta-row">
                <span className="cd__stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                <span className="cd__rating-val">{circuit.rating}</span>
                <span className="cd__reviews">({circuit.reviews} {t.reviews})</span>
                <span className="cd__safe-badge">✓ {t.safeBadge}</span>
              </div>
            </div>
            <div className="cd__actions">
              <button className={`cd__action-btn${fav ? ' cd__action-btn--active' : ''}`} onClick={handleFav} title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                <Icon name={fav ? 'heart' : 'heartOutline'} size={18} />
                <small>{t.favorites}</small>
              </button>
              <button className="cd__action-btn" onClick={handleShare} title="Partager">
                <Icon name="share" size={18} />
                <small>{t.share}</small>
              </button>
              <button className="cd__action-btn" onClick={handleCompare} title="Comparer">
                <Icon name="compare" size={18} />
                <small>{t.compare}</small>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 · GALERIE ── */}
      <div className="container cd__gallery">
        <div className="cd__gallery-main" onClick={() => openLightbox(0)} style={{ cursor: 'pointer' }}>
          <Image src={photos[0]} alt={circuit.name} fill sizes="(max-width: 900px) 100vw, 60vw" priority className="cd__gallery-big" />
          <button className="cd__gallery-all-btn" onClick={(e) => { e.stopPropagation(); openLightbox(0) }}>
            <Icon name="camera" size={14} /> {t.seeAll}
          </button>
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
            <h2 className="cd__section-title">{t.presentation}</h2>
            <div className={`cd__desc-wrap${descExpanded ? '' : ' cd__desc-wrap--clamped'}`}>
              <p className="cd__desc">{circuit.description}</p>
            </div>
            <button className="cd__expand-btn" onClick={() => setDescExpanded((v) => !v)}>
              {descExpanded ? t.readLess : t.readMore}
            </button>
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">{t.includedTitle}</h2>
            <div className="cd__inc-grid">
              <ul className="cd__inc-list">
                <li className="cd__inc-header">{t.included}</li>
                {circuit.included.map((item) => (
                  <li key={item}><span className="cd__check">✓</span>{item}</li>
                ))}
              </ul>
              <ul className="cd__exc-list">
                <li className="cd__exc-header">{t.notIncluded}</li>
                {circuit.non_inclus.map((item) => (
                  <li key={item}><span className="cd__cross">✗</span>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">{t.planTitle}</h2>
            <div className="cd__tabs">
              <button
                className={`cd__tab${activeTab === 'jour' ? ' cd__tab--active' : ''}`}
                onClick={() => setActiveTab('jour')}
              >
                {t.dayByDay}
              </button>
              <button
                className={`cd__tab${activeTab === 'depart' ? ' cd__tab--active' : ''}`}
                onClick={() => setActiveTab('depart')}
              >
                {t.departureDates}
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
                        <p className="cd__libre-desc">{t.freeDayText}</p>
                      ) : (
                        <>
                          <p>{step.description}</p>

                          {step.lodge && (
                            <div className="cd__step-lodge">
                              <span className="cd__step-lodge-icon">
                                <Icon
                                  name={
                                    step.typeHebergement === 'Bivouac' ? 'tent'
                                      : step.typeHebergement === 'Bungalow' ? 'waves'
                                      : step.typeHebergement === "Chez l'habitant" ? 'user'
                                      : 'building'
                                  }
                                  size={16}
                                />
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
                              <Icon name="map" size={14} />
                              <span>{t.pointOnRoute} {idx + 1} {t.onRoute}</span>
                              {idx === 0 && <span className="cd__step-badge cd__step-badge--start">{t.start}</span>}
                              {idx === itinerary.length - 1 && <span className="cd__step-badge cd__step-badge--end">{t.arrival}</span>}
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
                <p>{t.departureBlockText}</p>
                <Link href="/contact" className="btn-primary cd__depart-btn">
                  {t.requestDates}
                </Link>
              </div>
            )}

            {circuit.waypoints?.length > 0 && (
              <div className="cd__plan-map">
                <div className="cd__plan-map-header">
                  <span className="cd__plan-map-title">{t.routeTitle}</span>
                  <div className="cd__plan-map-legend">
                    <span className="cd__legend-item cd__legend-item--start">① {t.start}</span>
                    <span className="cd__legend-item cd__legend-item--end">② {t.arrival}</span>
                    <span className="cd__legend-item cd__legend-item--route">— {t.routeTitle}</span>
                  </div>
                </div>
                <CircuitMap waypoints={circuit.waypoints} circuitName={circuit.name} />
                <p className="cd__plan-map-hint">{t.routeHint}</p>
              </div>
            )}
          </section>

          <section className="cd__section">
            <h2 className="cd__section-title">{t.practicalInfo}</h2>
            <div className="cd__infos-grid">
              {circuit.infos_pratiques.map((info, i) => (
                <div key={i} className="cd__info-item">
                  <span className="cd__info-icon"><Icon name={infoIcon(info)} size={16} /></span>
                  <span className="cd__info-text">{info}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── CLIMAT & MÉTÉO ── */}
          <section className="cd__section">
            <h2 className="cd__section-title">{t.climateTitle}</h2>
            <div className="cd__climat-grid">
              {months.map((m, i) => {
                const key = getClimatKey(baseCircuit)
                const cond = (CLIMAT_MAP[key] || CLIMAT_MAP.seche)[i]
                return (
                  <div key={m} className="cd__climat-month">
                    <span className="cd__climat-month-label">{m}</span>
                    <div className={`cd__climat-bar cd__climat-bar--${cond}`} title={climatLabel(cond, locale)}>
                      <Icon name={CLIMAT_ICON[cond]} size={14} />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="cd__climat-legend">
              {['ideal', 'ok', 'avoid'].map((c) => (
                <div key={c} className="cd__climat-legend-item">
                  <span className={`cd__climat-legend-dot cd__climat-legend-dot--${c}`} />
                  {climatLabel(c, locale)}
                </div>
              ))}
            </div>
            {baseCircuit.saison === 'seche' && (
              <p className="cd__climat-note">
                <Icon name="calendar" size={15} /> {t.bestPeriod} : <strong>{pick(DRY_SEASON_RANGE, locale)}</strong> {t.dry}
              </p>
            )}
            {baseCircuit.saison === 'toute-saison' && (
              <p className="cd__climat-note">
                <Icon name="calendar" size={15} /> {t.allYear} <strong>{pick(RAIN_MONTHS, locale)}</strong> {t.allYearEnd}
              </p>
            )}
            {baseCircuit.slug === 'sainte-marie-pirates-baleines' && (
              <p className="cd__climat-note">
                <Icon name="waves" size={15} /> {t.whales} <strong>{pick(WHALE_MONTHS, locale)}</strong>. {t.whalesEnd}
              </p>
            )}
            {getClosure(baseCircuit) && (
              <p className="cd__climat-note cd__climat-note--closed">
                <Icon name="lock" size={15} /> <strong>{t.siteClosed} {formatMonthRange(getClosure(baseCircuit).months, locale)}.</strong> {getClosureNote(getClosure(baseCircuit), locale)}
              </p>
            )}
          </section>

          {/* ── AVIS VOYAGEURS ── */}
          <section className="cd__section">
            <h2 className="cd__section-title">{t.reviewsTitle}</h2>

            <div className="cd__reviews-summary">
              <div className="cd__reviews-score">
                <span className="cd__reviews-score-val">{circuit.rating}</span>
                <span className="cd__reviews-score-stars">
                  {'★'.repeat(Math.round(circuit.rating))}{'☆'.repeat(5 - Math.round(circuit.rating))}
                </span>
                <span className="cd__reviews-score-count">{circuit.reviews + reviews.length - baseReviews.length} {t.reviews}</span>
              </div>
              <div className="cd__reviews-bars">
                {RATING_BARS.map(({ stars: barStars, pct }) => (
                  <div key={barStars} className="cd__reviews-bar-row">
                    <span className="cd__reviews-bar-label">{barStars}★</span>
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
                        <div className="cd__review-date">{pick(r.date, locale)}</div>
                      </div>
                    </div>
                    <span className="cd__review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                  </div>
                  <p className="cd__review-text">{pick(r.text, locale)}</p>
                  {r.tag && <span className="cd__review-tag">{pick(r.tag, locale)}</span>}
                </div>
              ))}
            </div>

            <form className="cd__review-form" onSubmit={handleReviewSubmit}>
              <h3 className="cd__review-form-title">{t.leaveReview}</h3>

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
                  <label>{t.yourName}</label>
                  <input
                    type="text"
                    placeholder="Ex. Marie M."
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    required
                  />
                </div>
                <div className="cd__review-form-field">
                  <label>{t.circuitDone}</label>
                  <input type="text" value={circuit.name} readOnly style={{ opacity: 0.6 }} />
                </div>
                <div className="cd__review-form-field cd__review-form-field--full">
                  <label>{t.yourReview}</label>
                  <textarea
                    rows={4}
                    placeholder={t.reviewPlaceholder}
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
                {t.publish}
              </button>

              {reviewSuccess && (
                <div className="cd__review-success">
                  ✓ {t.reviewSuccess}
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
                {isCondensed ? t.priceCondensed : isExtended ? t.priceExtended : t.priceFrom}
              </span>
              <span className="cd__book-price-value">{format(price)}</span>
              {circuit.prix_reduit && (
                <span className="cd__book-price-original">{t.instead} {format(circuit.prix_original)}</span>
              )}
            </div>

            <div className="cd__book-metas">
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">{t.level}</span>
                <span className="cd__book-meta-val">{levelLabel}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">{t.group}</span>
                <span className="cd__book-meta-val">{formatGroupSize(circuit.groupSize, locale)}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">{t.rating}</span>
                <span className="cd__book-meta-val">★ {circuit.rating} · {circuit.reviews} {t.reviews}</span>
              </div>
              <div className="cd__book-meta-item">
                <span className="cd__book-meta-label">{t.region}</span>
                <span className="cd__book-meta-val">{circuit.region}</span>
              </div>
            </div>

            <div className="cd__slider-block">
              <div className="cd__slider-header">
                <span className="cd__slider-label">{t.desiredDuration}</span>
                <div className="cd__slider-val">
                  <strong>{selectedDays} {t.day}{selectedDays > 1 ? 's' : ''}</strong>
                  {isCondensed && <span className="cd__adapted-tag--condensed">{t.condensed}</span>}
                  {isExtended  && <span className="cd__adapted-tag--extended">{t.extended}</span>}
                  {!isAdapted  && <span className="cd__adapted-tag--reco">{t.recommended}</span>}
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
                <span>{circuit.minDays} {t.min}</span>
                <span>{circuit.recommendedDays} {t.reco}</span>
                <span>{circuit.maxDays ?? circuit.recommendedDays} {t.max}</span>
              </div>
              {isCondensed && <p className="cd__adapt-notice">{t.condensedNotice}</p>}
              {isExtended  && <p className="cd__adapt-notice cd__adapt-notice--extended">{t.extendedNotice}</p>}
            </div>

            <button className="btn-primary cd__book-btn" onClick={handleReserve}>
              {t.reserve}
            </button>
            <p className="cd__book-note">{t.paymentNote}</p>
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
            <div className="cd__gate-icon"><Icon name="lock" size={32} /></div>
            <h3 className="cd__gate-title">{t.loginRequired}</h3>
            <p className="cd__gate-text">{t.loginRequiredText}</p>
            <div className="cd__gate-hint">
              <span className="cd__gate-hint-label">{t.demoAccount}</span>
              <code>oceane@treky.mg</code>
              <code>treky2026</code>
            </div>
            <button
              className="btn-primary cd__gate-btn"
              onClick={() => router.push(`/connexion?return=/circuits/${circuit.slug}`)}
            >
              {t.login}
            </button>
            <Link href="/inscription" className="cd__gate-register">
              {t.noAccount}
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
