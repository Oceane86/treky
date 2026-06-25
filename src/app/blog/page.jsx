'use client'
import { useState } from 'react'
import Link from 'next/link'
import { blogPosts } from '../../data/circuits'
import '../../pages/Page.css'
import '../../pages/Blog.css'

const ALL_CATEGORIES = ['Tous', ...Array.from(new Set(blogPosts.map((p) => p.category)))]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Tous')

  const visible = activeCategory === 'Tous'
    ? blogPosts
    : blogPosts.filter((p) => p.category === activeCategory)

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <p className="page-hero__eyebrow">Récits & conseils</p>
          <h1 className="page-hero__title">Blog</h1>
          <p className="page-hero__subtitle">
            Conseils pratiques, récits de trek, artisanat et actualités de Treky à Madagascar.
          </p>
        </div>
      </header>

      <section className="page-content">
        <div className="container">

          {/* Filtres catégories */}
          <div className="blog-categories">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`blog-cat-btn${activeCategory === cat ? ' blog-cat-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="blog-count">
            {visible.length} article{visible.length !== 1 ? 's' : ''}
          </p>

          <div className="blog-grid">
            {visible.map((post, i) => (
              <article key={post.id} className={`blog-card${i === 0 && activeCategory === 'Tous' ? ' blog-card--featured' : ''}`}>
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
                  <Link href={`/blog/${post.slug}`} className="blog-card__link">
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
