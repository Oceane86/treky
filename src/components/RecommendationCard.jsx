'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getGuideById } from '../data/circuits'
import { THEMES, getMatchedThemes } from '../utils/matching'
import { MONTHS, getClosure } from '../utils/climate'
import { applyGuideOverrides } from '../utils/guideProfile'
import './RecommendationCard.css'

const SEASON_COPY = {
  closed: { icon: '🚫', tone: 'closed', label: 'Fermé à cette période' },
  avoid: { icon: '🌧️', tone: 'avoid', label: 'Période déconseillée' },
  ok: { icon: '⛅', tone: 'ok', label: 'Bonne période' },
  ideal: { icon: '☀️', tone: 'ideal', label: 'Période idéale' },
}

function formatMonthsFr(monthIndexes) {
  const labels = monthIndexes.map((m) => MONTHS[m])
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} et ${labels[labels.length - 1]}`
}

export default function RecommendationCard({ circuit, score, seasonStatus, idealMonths, themeIds, maxScore = 150 }) {
  const pct = Math.max(8, Math.round((score / maxScore) * 100))
  const baseGuides = (circuit.guideIds ?? []).map(getGuideById).filter(Boolean).slice(0, 2)
  const [guides, setGuides] = useState(baseGuides)

  useEffect(() => {
    setGuides(applyGuideOverrides(baseGuides))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuit.id])

  const season = seasonStatus ? SEASON_COPY[seasonStatus] : null
  const closure = getClosure(circuit)
  const matchedThemes = getMatchedThemes(circuit, themeIds)

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
            <span className="resultats__match-label">compatible</span>
          </div>
        </div>

        <div className="resultats__tags">
          <span className={`resultats__tag ${matchedThemes.length ? 'resultats__tag--match' : ''}`}>
            {matchedThemes.length
              ? `✓ ${THEMES.filter((t) => matchedThemes.includes(t.id)).map((t) => t.label).join(', ')}`
              : 'Thématique proche'}
          </span>
          <span className="resultats__tag">{circuit.level}</span>
          <span className="resultats__tag">{circuit.minDays}–{circuit.maxDays ?? circuit.recommendedDays} jours</span>
        </div>

        {season && (
          <div className={`resultats__season resultats__season--${season.tone}`}>
            <span>{season.icon}</span>
            <span>
              <strong>{season.label}</strong>
              {seasonStatus === 'closed' && closure && ` — ${closure.note}`}
              {seasonStatus !== 'closed' && idealMonths.length > 0 && (
                <> · Meilleure période : {formatMonthsFr(idealMonths)}</>
              )}
            </span>
          </div>
        )}
        {!season && idealMonths.length > 0 && (
          <div className="resultats__season resultats__season--ideal">
            <span>☀️</span>
            <span><strong>Meilleure période :</strong> {formatMonthsFr(idealMonths)}</span>
          </div>
        )}

        {guides.length > 0 && (
          <div className="resultats__guides">
            <span className="resultats__guides-label">Guides compatibles</span>
            <div className="resultats__guides-list">
              {guides.map((g) => (
                <div key={g.id} className="resultats__guide">
                  <Image
                    src={g.photo}
                    alt={g.nom}
                    width={28}
                    height={28}
                    unoptimized={g.photo?.startsWith('data:')}
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <span className="resultats__guide-name">{g.nom}</span>
                    <span className="resultats__guide-meta">★ {g.note} · {g.langues.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link href={`/circuits/${circuit.slug}`} className="btn-primary resultats__cta">
          Voir le circuit complet →
        </Link>
      </div>
    </div>
  )
}
