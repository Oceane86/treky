'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Icon from './Icon'
import { localizeCircuit } from '../data/circuits'
import { THEMES, getMatchedThemes, themeLabel, niveauLabel } from '../utils/matching'
import { getMonths, getClosure, getClosureNote } from '../utils/climate'
import { applyGuideOverrides } from '../utils/guideProfile'
import { useLocale } from '../context/LocaleContext'
import './RecommendationCard.css'

const SEASON_COPY = {
  fr: {
    closed: { icon: 'lock', tone: 'closed', label: 'Fermé à cette période' },
    avoid: { icon: 'cloudRain', tone: 'avoid', label: 'Période déconseillée' },
    ok: { icon: 'cloud', tone: 'ok', label: 'Bonne période' },
    ideal: { icon: 'sun', tone: 'ideal', label: 'Période idéale' },
  },
  en: {
    closed: { icon: 'lock', tone: 'closed', label: 'Closed during this period' },
    avoid: { icon: 'cloudRain', tone: 'avoid', label: 'Not recommended' },
    ok: { icon: 'cloud', tone: 'ok', label: 'Good period' },
    ideal: { icon: 'sun', tone: 'ideal', label: 'Ideal period' },
  },
  mg: {
    closed: { icon: 'lock', tone: 'closed', label: 'Mikatona amin\'ity vanim-potoana ity' },
    avoid: { icon: 'cloudRain', tone: 'avoid', label: 'Vanim-potoana tsy tokony' },
    ok: { icon: 'cloud', tone: 'ok', label: 'Vanim-potoana mety' },
    ideal: { icon: 'sun', tone: 'ideal', label: 'Vanim-potoana tsara indrindra' },
  },
}

const COPY = {
  fr: { compatible: 'compatible', closeTheme: 'Thématique proche', bestPeriod: 'Meilleure période', matchedGuide: 'Votre guide recommandé', viewCircuit: 'Voir le circuit complet', days: 'jours', and: 'et' },
  en: { compatible: 'compatible', closeTheme: 'Related theme', bestPeriod: 'Best period', matchedGuide: 'Your recommended guide', viewCircuit: 'View full trek', days: 'days', and: 'and' },
  mg: { compatible: 'mifanaraka', closeTheme: 'Lohahevitra mifandraika', bestPeriod: 'Vanim-potoana tsara indrindra', matchedGuide: 'Ny mpitarika nasaina ho anao', viewCircuit: 'Jereo ny sirkoity feno', days: 'andro', and: 'sy' },
}

function formatMonths(monthIndexes, locale) {
  const months = getMonths(locale)
  const labels = monthIndexes.map((m) => months[m])
  if (labels.length <= 1) return labels.join('')
  const and = (COPY[locale] ?? COPY.fr).and
  return `${labels.slice(0, -1).join(', ')} ${and} ${labels[labels.length - 1]}`
}

export default function RecommendationCard({ circuit: baseCircuit, score, seasonStatus, idealMonths, bestGuide, themeIds, maxScore = 150 }) {
  const { locale } = useLocale()
  const circuit = localizeCircuit(baseCircuit, locale)
  const pct = Math.max(8, Math.round((score / maxScore) * 100))
  const [guide, setGuide] = useState(bestGuide)

  useEffect(() => {
    if (!bestGuide) { setGuide(null); return }
    setGuide(applyGuideOverrides([bestGuide])[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bestGuide?.id])

  const season = seasonStatus ? (SEASON_COPY[locale] ?? SEASON_COPY.fr)[seasonStatus] : null
  const closure = getClosure(baseCircuit)
  const matchedThemes = getMatchedThemes(baseCircuit, themeIds)
  const levelLabel = niveauLabel(circuit.level, locale)
  const copy = COPY[locale] ?? COPY.fr

  return (
    <div className="resultats__card">
      <div className="resultats__img">
        <Image
          src={circuit.image}
          alt={circuit.name}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="resultats__body">
        <div className="resultats__top">
          <div>
            <h3 className="resultats__name">{circuit.name}</h3>
            <p className="resultats__teaser">{circuit.teaser}</p>
          </div>
          <div className="resultats__match">
            <span className="resultats__match-val">{pct}%</span>
            <span className="resultats__match-label">{copy.compatible}</span>
          </div>
        </div>

        <div className="resultats__tags">
          <span className={`resultats__tag ${matchedThemes.length ? 'resultats__tag--match' : ''}`}>
            {matchedThemes.length
              ? `✓ ${THEMES.filter((t) => matchedThemes.includes(t.id)).map((t) => themeLabel(t, locale)).join(', ')}`
              : copy.closeTheme}
          </span>
          <span className="resultats__tag">{levelLabel}</span>
          <span className="resultats__tag">{circuit.minDays}–{circuit.maxDays ?? circuit.recommendedDays} {copy.days}</span>
        </div>

        {season && (
          <div className={`resultats__season resultats__season--${season.tone}`}>
            <Icon name={season.icon} size={16} />
            <span>
              <strong>{season.label}</strong>
              {seasonStatus === 'closed' && closure && ` — ${getClosureNote(closure, locale)}`}
              {seasonStatus !== 'closed' && idealMonths.length > 0 && (
                <> · {copy.bestPeriod} : {formatMonths(idealMonths, locale)}</>
              )}
            </span>
          </div>
        )}
        {!season && idealMonths.length > 0 && (
          <div className="resultats__season resultats__season--ideal">
            <Icon name="sun" size={16} />
            <span><strong>{copy.bestPeriod} :</strong> {formatMonths(idealMonths, locale)}</span>
          </div>
        )}

        {guide && (
          <div className="resultats__guides">
            <span className="resultats__guides-label">{copy.matchedGuide}</span>
            <div className="resultats__guides-list">
              <div className="resultats__guide resultats__guide--matched">
                <Image
                  src={guide.photo}
                  alt={guide.nom}
                  width={28}
                  height={28}
                  unoptimized={guide.photo?.startsWith('data:')}
                  style={{ objectFit: 'cover' }}
                />
                <div>
                  <span className="resultats__guide-name">{guide.nom}</span>
                  <span className="resultats__guide-meta">★ {guide.note} · {guide.langues.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Link href={`/circuits/${circuit.slug}`} className="btn-primary resultats__cta">
          {copy.viewCircuit} →
        </Link>
      </div>
    </div>
  )
}
