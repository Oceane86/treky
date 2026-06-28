import Providers from '../components/Providers'
import '../index.css'

export const metadata = {
  metadataBase: new URL('https://treky.mg'),
  title: {
    default: 'Treky – Trek Madagascar avec guides locaux certifiés',
    template: '%s | Treky',
  },
  description:
    "Treky organise des circuits de trekking à Madagascar avec des guides locaux certifiés. Isalo, Tsingy de Bemaraha, Tsaratanana — vivez l'aventure malgache en toute sécurité.",
  keywords: [
    'trek Madagascar',
    'trekking Madagascar',
    'circuits Madagascar',
    'guides locaux Madagascar',
    'Isalo',
    'Tsingy de Bemaraha',
    'Tsaratanana',
    'randonnée Madagascar',
    'voyage Madagascar',
  ],
  manifest: '/manifest.webmanifest',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  themeColor: '#5b8c1a',
  openGraph: {
    siteName: 'Treky',
    locale: 'fr_FR',
    type: 'website',
    url: 'https://treky.mg',
    title: "Treky – Trek Madagascar avec guides locaux certifiés",
    description:
      "Circuits de trekking à Madagascar avec des guides locaux certifiés. Isalo, Tsingy, Tsaratanana.",
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Trek Madagascar – Treky',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Treky – Trek Madagascar',
    description: "Circuits de trekking avec guides locaux à Madagascar.",
    images: ['/images/hero-bg.jpg'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#c8a96e" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400;12..96,75..100,600;12..96,75..100,700&family=Questrial&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
