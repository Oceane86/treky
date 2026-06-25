import Providers from '../components/Providers'
import '../index.css'

export const metadata = {
  title: "Treky – Le trek qui vous connecte à l'essentiel",
  description: 'Découvrez Madagascar à travers des treks inoubliables avec Treky.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  themeColor: '#c8a96e',
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
