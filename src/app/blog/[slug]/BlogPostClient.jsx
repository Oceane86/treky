'use client'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { blogPosts } from '../../../data/circuits'
import '../../../pages/Page.css'
import '../../../pages/Blog.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div className="page">
      <header className="page-hero page-hero--compact">
        <div className="container page-hero__inner">
          <Link href="/blog" className="blog-post__back">← Retour au blog</Link>
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
          <div className="blog-post__cover-wrap">
            <Image src={post.image} alt={post.title} fill sizes="(max-width: 800px) 100vw, 800px" priority style={{ objectFit: 'cover' }} />
          </div>
          <p className="blog-post__lead">{post.excerpt}</p>
          {(post.content ?? []).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <Link href="/contact" className="btn-primary">Nous contacter pour réserver</Link>
        </div>
      </article>
    </div>
  )
}
