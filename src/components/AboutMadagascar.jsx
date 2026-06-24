import { Link } from 'react-router-dom'
import './AboutMadagascar.css'

export default function AboutMadagascar() {
  return (
    <section className="about section-padding" id="about">
      <div className="container">
        <h2 className="section-title about__title" data-reveal>À propos de Madagascar</h2>

        <div className="about__grid" data-reveal data-reveal-delay="1">
          {/* Colonne 1 : bloc valeurs */}
          <div className="about__text-block about__text-block--card">
            <h3 className="about__block-title">Les Valeurs uniques</h3>
            <p className="about__block-text">
              Madagascar est l'une des destinations les plus uniques au monde. Sa biodiversité
              exceptionnelle, ses paysages variés et sa culture riche en font un terrain de
              découverte sans pareil. Chez Treky, nous vous guidons au cœur de cette nature
              préservée.
            </p>
          </div>

          {/* Colonne 2 : bloc texte libre */}
          <div className="about__text-block">
            <p className="about__block-quote">
              "Nous croyons que chaque pas sur cette terre est une connexion avec l'essentiel.
              Madagascar n'est pas seulement une destination, c'est une expérience qui
              transforme."
            </p>
            <p className="about__block-author">— L'équipe Treky</p>
            <p className="about__block-text" style={{ marginTop: '16px' }}>
              Depuis notre création, nous accompagnons des voyageurs passionnés à la découverte
              des merveilles malgaches, avec un engagement fort pour le tourisme responsable
              et le soutien aux communautés locales.
            </p>
          </div>

          {/* Colonne 3 : images empilées */}
          <div className="about__images-col">
            <div className="about__img-wrap">
              <img src="/images/about2.jpg" alt="Coucher de soleil Madagascar" />
            </div>
            <div className="about__img-wrap">
              <img src="/images/about3.jpg" alt="Paysage malgache" />
            </div>
          </div>
        </div>

        <div className="about__cta" data-reveal data-reveal-delay="2">
          <Link to="/a-propos" className="btn-secondary">En savoir plus sur Treky</Link>
        </div>
      </div>
    </section>
  )
}
