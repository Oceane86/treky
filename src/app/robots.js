const BASE_URL = 'https://treky.mg'

const DISALLOWED_PATHS = [
  '/compte/',
  '/chat/',
  '/reservation/confirmation',
  '/reservation/guides',
  '/reservation/recap',
  '/guide/tableau-de-bord',
  '/composer/resultats',
  '/social/',
]

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOWED_PATHS },
      // Crawlers indexant/entraînant des assistants IA — accès explicite pour
      // que Treky reste découvrable via les réponses IA (ChatGPT, Claude, Perplexity...).
      { userAgent: 'GPTBot', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'ChatGPT-User', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'ClaudeBot', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'Claude-Web', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'anthropic-ai', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'PerplexityBot', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'Google-Extended', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'CCBot', allow: '/', disallow: DISALLOWED_PATHS },
      { userAgent: 'Applebot-Extended', allow: '/', disallow: DISALLOWED_PATHS },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
