import { Link } from 'react-router-dom'
import { blogPosts } from '../data/circuits'
import './Page.css'
import './Blog.css'

export default function Blog() {
  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Récits & conseils</p>
          <h1 className="page-hero__title">Blog</h1>
          <p className="page-hero__subtitle">
            Conseils pratiques, récits de trek et actualités de Treky à Madagascar.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-card__image-wrap">
                  <img src={post.image} alt={post.title} />
                  <span className="blog-card__category">{post.category}</span>
                </div>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span>· {post.readTime}</span>
                  </div>
                  <h2 className="blog-card__title">{post.title}</h2>
                  <p className="blog-card__excerpt">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="blog-card__link">
                    Lire l'article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
