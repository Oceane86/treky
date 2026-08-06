'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { readJSON } from '../utils/storage'

function mergeTeamMember(member) {
  const saved = readJSON(`treky_guide_profile_${member.id}`, null)
  if (!saved) return member
  return {
    ...member,
    nom: saved.nom || member.nom,
    photo: saved.photo || member.photo,
    bio: saved.bio ?? member.bio,
    localisation: saved.localisation || member.localisation,
    langues: saved.langues_text
      ? saved.langues_text.split(',').map((s) => s.trim()).filter(Boolean)
      : member.langues,
  }
}

export default function AboutTeamSection({ team }) {
  const [members, setMembers] = useState(team)

  useEffect(() => {
    setMembers(team.map(mergeTeamMember))
  }, [team])

  return (
    <div className="about-team__grid">
      {members.map((g) => (
        <div key={g.id} className="about-guide-card">
          <Image
            src={g.photo}
            alt={g.nom}
            width={100}
            height={100}
            unoptimized={g.photo?.startsWith('data:')}
            className="about-guide-card__photo"
          />
          <div className="about-guide-card__body">
            <div className="about-guide-card__header">
              <div>
                <h3 className="about-guide-card__name">{g.nom}</h3>
                <p className="about-guide-card__role">{g.role}</p>
                {g.localisation && (
                  <span className="about-guide-card__lieu">📍 {g.localisation}</span>
                )}
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
  )
}
