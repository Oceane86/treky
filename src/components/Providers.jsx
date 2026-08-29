'use client'
import { usePathname } from 'next/navigation'
import NextAuthProvider from './NextAuthProvider'
import { AuthProvider } from '../context/AuthContext'
import { CurrencyProvider } from '../context/CurrencyContext'
import { BookingProvider } from '../context/BookingContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import { LocaleProvider } from '../context/LocaleContext'
import Navbar from './Navbar'
import Footer from './Footer'
import InstallPWA from './InstallPWA'
import CookieConsent from './CookieConsent'

const AUTH_ROUTES = ['/inscription', '/connexion']

// Le chat guide et les apercus reseaux sociaux sont des vues autonomes avec
// leur propre entete stylisee : la navbar/footer du site casseraient l'illusion.
function hidesChrome(pathname) {
  return AUTH_ROUTES.includes(pathname) || pathname.startsWith('/chat/') || pathname.startsWith('/social/')
}

export default function Providers({ children }) {
  const pathname = usePathname()
  const hideChrome = hidesChrome(pathname)

  return (
    <NextAuthProvider>
    <AuthProvider>
      <LocaleProvider>
      <CurrencyProvider>
        <FavoritesProvider>
        <BookingProvider>
          {!hideChrome && <Navbar />}
          <main>{children}</main>
          {!hideChrome && <Footer />}
          <InstallPWA />
          {!pathname.startsWith('/social/') && <CookieConsent />}
        </BookingProvider>
        </FavoritesProvider>
      </CurrencyProvider>
      </LocaleProvider>
    </AuthProvider>
    </NextAuthProvider>
  )
}
