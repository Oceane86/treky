import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg">
        <img
          src="/images/hero-bg.jpg"
          alt="Paysage de Madagascar"
          className="hero__bg-img"
        />
        <div className="hero__overlay"></div>
      </div>

      <div className="hero__content container">
        <span className="hero__eyebrow">Agence de trekking à Madagascar</span>
        <h1 className="hero__title">
          Le trek qui vous connecte<br />
          à <em>l'essentiel.</em>
        </h1>
        <p className="hero__subtitle">
          Partez à l'aventure avec nos guides experts au cœur des paysages
          sauvages et préservés de Madagascar.
        </p>
        <div className="hero__actions">
          <a href="#circuits" className="btn-primary hero__cta">
            Découvrir nos circuits
          </a>
          <a href="#about" className="btn-outline-white">
            En savoir plus
          </a>
        </div>
      </div>

    </section>
  )
}
