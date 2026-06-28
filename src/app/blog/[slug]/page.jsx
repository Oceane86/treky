import { blogPosts } from '../../../data/circuits'
import BlogPostClient from './BlogPostClient'

export function generateMetadata({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return { title: 'Article introuvable' }
  return {
    title: post.title,
    description: post.excerpt,
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

export default function BlogPostPage() {
  return <BlogPostClient />
}
