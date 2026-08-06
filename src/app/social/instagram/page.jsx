import Link from 'next/link'
import { circuits } from '../../../data/circuits'
import '../../../pages/Social.css'

export const metadata = {
  title: 'Treky sur Instagram',
  robots: { index: false, follow: false },
}

export default function InstagramPreviewPage() {
  const posts = circuits.slice(0, 9)

  return (
    <div className="page social-ig">
      <div className="container">
        <div className="social-ig__card">
          <img src="/logo.png" alt="Treky" className="social-ig__avatar" />
          <div className="social-ig__identity">
            <div className="social-ig__handle-row">
              <h1 className="social-ig__handle">treky.mg</h1>
              <span className="social-ig__follow-btn">Suivre</span>
            </div>
            <div className="social-ig__stats">
              <span><strong>{posts.length}</strong> publications</span>
              <span><strong>4 218</strong> abonnés</span>
              <span><strong>186</strong> abonnements</span>
            </div>
            <p className="social-ig__name">Treky · Trek Madagascar</p>
            <p className="social-ig__bio">
              🌿 Circuits de trekking avec guides locaux certifiés{'\n'}
              🏔️ Isalo · Tsingy · Andringitra · Makay{'\n'}
              👇 Composez votre trek sur-mesure
            </p>
            <Link href="/composer" className="social-ig__link">treky.mg/composer</Link>
          </div>
        </div>

        <div className="social-ig__grid">
          {posts.map((c, i) => (
            <Link key={c.id} href={`/circuits/${c.slug}`} className="social-ig__post">
              <img src={c.image} alt={c.name} />
              <div className="social-ig__post-overlay">
                <span>♥ {340 + (i * 57) % 900}</span>
                <span>💬 {12 + (i * 7) % 40}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
