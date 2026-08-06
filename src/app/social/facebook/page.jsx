import { circuits } from '../../../data/circuits'
import '../../../pages/Social.css'

export const metadata = {
  title: 'Treky sur Facebook',
  robots: { index: false, follow: false },
}

export default function FacebookPreviewPage() {
  const posts = [circuits[0], circuits[2], circuits[4]]

  return (
    <div className="page social-fb">
      <div className="social-fb__cover">
        <img src="/images/hero-bg.jpg" alt="Couverture Treky" className="social-fb__cover-img" />
        <div className="container social-fb__identity">
          <img src="/logo.png" alt="Treky" className="social-fb__avatar" />
          <div>
            <h1 className="social-fb__name">Treky</h1>
            <p className="social-fb__meta">Agence de voyage · Antananarivo, Madagascar</p>
          </div>
        </div>
      </div>

      <div className="container social-fb__body">
        <div className="social-fb__actions">
          <span className="social-fb__like-btn">👍 J'aime</span>
          <span className="social-fb__follow-btn">＋ Suivre</span>
          <span className="social-fb__likes-count">2 940 mentions J'aime · 3 102 abonnés</span>
        </div>

        <div className="social-fb__layout">
          <aside className="social-fb__about">
            <h3>À propos</h3>
            <ul>
              <li>📍 Antananarivo 101, Madagascar</li>
              <li>✉️ contact@treky.mg</li>
              <li>☎️ +261 00 00 000 00</li>
              <li>🔗 treky.mg</li>
            </ul>
          </aside>

          <div className="social-fb__feed">
            {posts.map((c, i) => (
              <div key={c.id} className="social-fb__post">
                <div className="social-fb__post-header">
                  <img src="/logo.png" alt="Treky" />
                  <div>
                    <strong>Treky</strong>
                    <span>Publication</span>
                  </div>
                </div>
                <p className="social-fb__post-text">{c.teaser}</p>
                <img src={c.image} alt={c.name} className="social-fb__post-img" />
                <div className="social-fb__post-stats">
                  👍❤️ {120 + i * 43} · {8 + i * 5} commentaires
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
