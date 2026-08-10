import { circuits, blogPosts } from '../data/circuits'

const BASE_URL = 'https://treky.mg'

export default function sitemap() {
  const staticPages = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/circuits`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/composer`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/a-propos`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/mentions-legales`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/confidentialite`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/cgv`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/cookies`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const circuitPages = circuits.map((c) => ({
    url: `${BASE_URL}/circuits/${c.slug}`,
    changeFrequency: 'monthly',
    priority: 0.85,
  }))

  const blogPages = blogPosts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...circuitPages, ...blogPages]
}
