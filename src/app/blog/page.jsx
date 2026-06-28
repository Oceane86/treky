import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog – Conseils & récits de trek à Madagascar',
  description:
    'Articles pratiques, récits de randonneurs, conseils terrain et actualités de Madagascar par Treky.',
  openGraph: {
    title: 'Blog Treky – Conseils et récits de trek à Madagascar',
    description:
      'Inspirations de voyage, guides pratiques et histoires du terrain pour préparer votre trek à Madagascar.',
    images: [{ url: '/images/about1.jpg', width: 1200, height: 630 }],
  },
}

export default function BlogPage() {
  return <BlogClient />
}
