import { useState } from 'react'
import './Testimonials.css'

const testimonials = [
  {
    id: 1,
    name: 'Jean Dupont',
    role: 'Randonneur passionné',
    avatar: '/images/avatar1.jpg',
    rating: 5,
    text: "Une expérience absolument inoubliable. Le guide était exceptionnel, les paysages à couper le souffle. Je recommande Treky à tous ceux qui veulent vivre une vraie aventure à Madagascar.",
  },
  {
    id: 2,
    name: 'Marie Martin',
    role: 'Voyageuse solo',
    avatar: '/images/avatar2.jpg',
    rating: 5,
    text: "Mon premier trek à Madagascar avec Treky et certainement pas le dernier ! Organisation parfaite, équipe bienveillante, et des souvenirs plein la tête. Un grand merci à toute l'équipe.",
  },
  {
    id: 3,
    name: 'Thomas Bernard',
    role: 'Photographe nature',
    avatar: '/images/avatar3.jpg',
    rating: 5,
    text: "En tant que photographe, je cherchais des paysages uniques. Treky m'a emmené dans des endroits que je n'aurais jamais trouvés seul. La biodiversité de Madagascar est époustouflante.",
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section className="testimonials section-padding" id="avis">
      <div className="container">
        {/* Rangée principale : titre gauche / card droite */}
        <div className="testimonials__main" data-reveal>
          <div className="testimonials__left">
            <h2 className="section-title testimonials__title">
              Leurs pas,<br />leurs mots
            </h2>
            <a href="#avis" className="btn-primary testimonials__btn">Voir plus</a>
          </div>

          <div className="testimonials__right">
            <div className="testimonials__card" key={active}>
              <span className="testimonials__quote-icon">"</span>
              <div className="testimonials__card-header">
                <img
                  src={testimonials[active].avatar}
                  alt={testimonials[active].name}
                  className="testimonials__card-avatar"
                />
                <div className="testimonials__card-info">
                  <p className="testimonials__card-name">{testimonials[active].name}</p>
                  <div className="testimonials__card-stars">
                    {'★'.repeat(testimonials[active].rating)}
                  </div>
                </div>
              </div>
              <p className="testimonials__card-text">{testimonials[active].text}</p>
            </div>
          </div>
        </div>

        {/* Rangée inférieure : liste des avatars */}
        <div className="testimonials__avatars-row">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              className={`testimonials__avatar-item ${active === i ? 'active' : ''}`}
              onClick={() => setActive(i)}
            >
              <img src={t.avatar} alt={t.name} className="testimonials__avatar-img" />
              <div className="testimonials__avatar-info">
                <span className="testimonials__avatar-name">{t.name}</span>
                <span className="testimonials__avatar-role">{t.role}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
