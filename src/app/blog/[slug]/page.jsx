import { blogPosts } from '../../../data/circuits'
import BlogPostClient from './BlogPostClient'

export function generateMetadata({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Article introuvable' }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://treky.mg/blog/${post.slug}` },
    openGraph: {
      title: `${post.title} | Treky`,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

function articleJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: `https://treky.mg${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    articleSection: post.category,
    author: { '@type': 'Organization', name: 'Treky' },
    publisher: {
      '@type': 'Organization',
      name: 'Treky',
      logo: { '@type': 'ImageObject', url: 'https://treky.mg/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://treky.mg/blog/${post.slug}` },
  }
}

function breadcrumbJsonLd(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://treky.mg' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://treky.mg/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://treky.mg/blog/${post.slug}` },
    ],
  }
}

export default function BlogPostPage({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  return (
    <>
      {post && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(post)) }}
          />
        </>
      )}
      <BlogPostClient />
    </>
  )
}
