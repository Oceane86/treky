'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useLocale } from '../context/LocaleContext'
import { getUI } from '../utils/i18n'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    name: 'Jean Dupont',
    role: { fr: 'Randonneur passionné', en: 'Passionate hiker', mg: 'Tia mandeha an-tongotra' },
    avatar: '/images/avatar1.webp',
    rating: 5,
    text: {
      fr: "Une expérience absolument inoubliable. Le guide était exceptionnel, les paysages à couper le souffle. Je recommande Treky à tous ceux qui veulent vivre une vraie aventure à Madagascar.",
      en: "An absolutely unforgettable experience. The guide was exceptional, the scenery breathtaking. I recommend Treky to anyone who wants a real adventure in Madagascar.",
      mg: "Traikefa tsy hay hadinoina mihitsy. Nahavariana ilay mpitarika, ary nahatalanjona ny toe-tany. Manoro hevitra an'i Treky aho ho an'izay rehetra te-hiaina fitsangatsanganana marina any Madagasikara.",
    },
  },
  {
    id: 2,
    name: 'Marie Martin',
    role: { fr: 'Voyageuse solo', en: 'Solo traveler', mg: 'Mpandeha irery' },
    avatar: '/images/avatar2.webp',
    rating: 5,
    text: {
      fr: "Mon premier trek à Madagascar avec Treky et certainement pas le dernier ! Organisation parfaite, équipe bienveillante, et des souvenirs plein la tête. Un grand merci à toute l'équipe.",
      en: "My first trek in Madagascar with Treky, and definitely not the last! Perfect organization, a caring team, and a head full of memories. A huge thank you to the whole team.",
      mg: "Ny fisandratana voalohako tany Madagasikara niaraka tamin'i Treky, ary tsy izao farany izao! Tena nikarakara tsara ny fandaminana, be fitiavana ny ekipa, ary feno fahatsiarovana ny sain'ako. Misaotra betsaka ny ekipa manontolo.",
    },
  },
  {
    id: 3,
    name: 'Thomas Bernard',
    role: { fr: 'Photographe nature', en: 'Nature photographer', mg: 'Mpaka sary natiora' },
    avatar: '/images/avatar3.webp',
    rating: 5,
    text: {
      fr: "En tant que photographe, je cherchais des paysages uniques. Treky m'a emmené dans des endroits que je n'aurais jamais trouvés seul. La biodiversité de Madagascar est époustouflante.",
      en: "As a photographer, I was looking for unique landscapes. Treky took me to places I would never have found on my own. Madagascar's biodiversity is breathtaking.",
      mg: "Amin'ny maha-mpaka sary ahy, dia nitady toe-tany miavaka aho. Nentin'i Treky tany amin'ny toerana tsy ho hitako irery mihitsy aho. Mahatalanjona ny harena biolojika any Madagasikara.",
    },
  },
]

function pick(val, locale) {
  return typeof val === 'string' ? val : (val[locale] ?? val.fr)
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const { locale } = useLocale()
  const t = getUI(locale).home

  return (
    <section className="testimonials section-padding" id="avis">
      <div className="container">
        {/* Rangée principale : titre gauche / card droite */}
        <div className="testimonials__main" data-reveal>
          <div className="testimonials__left">
            <h2 className="section-title testimonials__title">
              {t.testimonialsTitle}<br />{t.testimonialsTitle2}
            </h2>
            <a href="#avis" className="btn-primary testimonials__btn">{t.testimonialsCta}</a>
          </div>

          <div className="testimonials__right">
            <div className="testimonials__card" key={active}>
              <span className="testimonials__quote-icon">"</span>
              <div className="testimonials__card-header">
                <Image
                  src={testimonials[active].avatar}
                  alt={testimonials[active].name}
                  width={52}
                  height={52}
                  className="testimonials__card-avatar"
                />
                <div className="testimonials__card-info">
                  <p className="testimonials__card-name">{testimonials[active].name}</p>
                  <div className="testimonials__card-stars">
                    {'★'.repeat(testimonials[active].rating)}
                  </div>
                </div>
              </div>
              <p className="testimonials__card-text">{pick(testimonials[active].text, locale)}</p>
            </div>
          </div>
        </div>

        {/* Rangée inférieure : liste des avatars */}
        <div className="testimonials__avatars-row">
          {testimonials.map((tm, i) => (
            <button
              key={tm.id}
              className={`testimonials__avatar-item ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              <Image src={tm.avatar} alt={tm.name} width={44} height={44} className="testimonials__avatar-img" />
              <div className="testimonials__avatar-info">
                <span className="testimonials__avatar-name">{tm.name}</span>
                <span className="testimonials__avatar-role">{pick(tm.role, locale)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
