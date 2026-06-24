import { useParams, Link, Navigate } from 'react-router-dom'
import { blogPosts } from '../data/circuits'
import './Page.css'
import './Blog.css'

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <Link to="/blog" className="blog-post__back">← Retour au blog</Link>
          <span className="blog-post__category">{post.category}</span>
          <h1 className="page-hero__title">{post.title}</h1>
          <p className="page-hero__subtitle">
            {new Date(post.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })} · {post.readTime}
          </p>
        </div>
      </header>

      <article className="page-content">
        <div className="container blog-post__content">
          <img src={post.image} alt={post.title} className="blog-post__cover" />
          <p>{post.excerpt}</p>
          <p>
            Cet article sera bientôt disponible en intégralité. En attendant,
            contactez-nous pour en savoir plus sur nos treks à Madagascar.
          </p>
          <Link to="/contact" className="btn-primary">Nous contacter</Link>
        </div>
      </article>
    </div>
  )
}
