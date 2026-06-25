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

export default function Providers({ children }) {
  const pathname = usePathname()
  const isAuth = AUTH_ROUTES.includes(pathname)

  return (
    <AuthProvider>
      <CurrencyProvider>
        <FavoritesProvider>
        <BookingProvider>
          {!isAuth && <Navbar />}
          <main>{children}</main>
          {!isAuth && <Footer />}
          <InstallPWA />
        </BookingProvider>
        </FavoritesProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}
