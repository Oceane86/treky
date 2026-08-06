'use client'
import { usePathname } from 'next/navigation'
import { AuthProvider } from '../context/AuthContext'
import { CurrencyProvider } from '../context/CurrencyContext'
import { BookingProvider } from '../context/BookingContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import Navbar from './Navbar'
import Footer from './Footer'
import InstallPWA from './InstallPWA'

const AUTH_ROUTES = ['/inscription', '/connexion']

// Le chat guide est une vue plein écran autonome (son propre header, sa propre
// navigation retour) : la navbar/footer du site casseraient son layout en 100vh.
function hidesChrome(pathname) {
  return AUTH_ROUTES.includes(pathname) || pathname.startsWith('/chat/')
}

export default function Providers({ children }) {
  const pathname = usePathname()
  const hideChrome = hidesChrome(pathname)

  return (
    <AuthProvider>
      <CurrencyProvider>
        <FavoritesProvider>
        <BookingProvider>
          {!hideChrome && <Navbar />}
          <main>{children}</main>
          {!hideChrome && <Footer />}
          <InstallPWA />
        </BookingProvider>
        </FavoritesProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}
