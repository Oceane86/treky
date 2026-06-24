import './Page.css'
import './About.css'

export default function About() {
  return (
    <div className="page">
      <header className="page-hero">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Treky</p>
          <h1 className="page-hero__title">À propos</h1>
          <p className="page-hero__subtitle">
            Le trek qui vous connecte à l'essentiel — découvrez Madagascar autrement.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <div className="about-page__intro page-grid-2">
            <div className="page-card">
              <h2>Notre mission</h2>
              <p>
                Treky est né d'une passion pour Madagascar et d'une conviction : le voyage à pied
                est la façon la plus authentique de découvrir cette île unique. Nous créons des
                expériences de trek responsables, guidées par des experts locaux, au service des
                voyageurs et des communautés malgaches.
              </p>
            </div>
            <div className="page-card">
              <h2>Tourisme responsable</h2>
              <p>
                Chaque circuit est conçu pour minimiser l'impact environnemental et maximiser
                les retombées économiques pour les villages traversés. Nous travaillons
                exclusivement avec des guides et porteurs de la région.
              </p>
            </div>
          </div>

          <div className="about-page__stats">
            <div className="about-page__stat">
              <span className="about-page__stat-num">12+</span>
              <span className="about-page__stat-label">Circuits disponibles</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">500+</span>
              <span className="about-page__stat-label">Voyageurs accompagnés</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">90%</span>
              <span className="about-page__stat-label">Faune endémique</span>
            </div>
            <div className="about-page__stat">
              <span className="about-page__stat-num">5</span>
              <span className="about-page__stat-label">Écosystèmes différents</span>
            </div>
          </div>

          <div className="about-page__values page-grid-2">
            <div className="about-page__value">
              <img src="/images/about2.jpg" alt="Madagascar" />
              <div>
                <h3>Des paysages uniques</h3>
                <p>
                  Des baobabs centenaires aux canyons de grès, en passant par les forêts
                  primaires du Nord — Madagascar offre une diversité géologique et biologique
                  sans équivalent.
                </p>
              </div>
            </div>
            <div className="about-page__value">
              <img src="/images/about3.jpg" alt="Culture malgache" />
              <div>
                <h3>Une culture vivante</h3>
                <p>
                  Nos treks incluent des rencontres avec les communautés locales : artisans,
                  agriculteurs, conteurs. Chaque étape est une immersion culturelle authentique.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
