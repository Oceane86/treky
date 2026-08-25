'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'

const DEMO_USER = {
  name: 'Océane Rakotomalala',
  email: 'oceane@treky.mg',
  avatar: '/images/avatar2.webp',
  role: 'voyageur',
}

const DEMO_CREDENTIALS = { email: 'oceane@treky.mg', password: 'treky2026' }

// Connexion guide : email + mot de passe, puis vérification SMS (spec §1)
const DEMO_GUIDE = {
  name: 'Rakoto Jean',
  email: 'rakoto.guide@treky.mg',
  avatar: '/images/avatar1.webp',
  role: 'guide',
  guideId: 1,
}
const DEMO_GUIDE_CREDENTIALS = { email: 'rakoto.guide@treky.mg', password: 'guide2026' }
const DEMO_SMS_CODE = '123456'

const LS_KEY = 'treky_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setAuthReady(true)
  }, [])

  // Un compte Google reel se connecte via next-auth (session JWT), en dehors du
  // flux demo email/mot de passe. On le rejoint au meme `user` pour que le reste
  // du site (navbar, reservation, etc.) n'ait pas besoin de connaitre deux systemes.
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return
    setUser((prev) => {
      if (prev?.email === session.user.email) return prev
      const u = {
        name: session.user.name,
        email: session.user.email,
        avatar: session.user.image ?? null,
        role: 'voyageur',
        provider: 'google',
      }
      localStorage.setItem(LS_KEY, JSON.stringify(u))
      return u
    })
  }, [status, session])

  function loginGoogle(callbackUrl) {
    nextAuthSignIn('google', { callbackUrl })
  }

  function login(email, password) {
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      setUser(DEMO_USER)
      localStorage.setItem(LS_KEY, JSON.stringify(DEMO_USER))
      return true
    }
    return false
  }

  function loginSocial(userData) {
    const u = { role: 'voyageur', ...(userData || DEMO_USER) }
    setUser(u)
    localStorage.setItem(LS_KEY, JSON.stringify(u))
  }

  // Étape 1 : vérification email + mot de passe (ne connecte pas encore).
  function guideLoginRequest(email, password) {
    return (
      email.trim().toLowerCase() === DEMO_GUIDE_CREDENTIALS.email &&
      password === DEMO_GUIDE_CREDENTIALS.password
    )
  }

  // Étape 2 : vérification du code reçu par SMS — connecte si valide.
  function guideLoginVerify(code) {
    if (code.trim() === DEMO_SMS_CODE) {
      setUser(DEMO_GUIDE)
      localStorage.setItem(LS_KEY, JSON.stringify(DEMO_GUIDE))
      return true
    }
    return false
  }

  function logout() {
    const wasGoogle = user?.provider === 'google'
    setUser(null)
    localStorage.removeItem(LS_KEY)
    // Le formulaire d'envies est personnel : on ne le laisse pas fuiter au prochain visiteur.
    localStorage.removeItem('treky_wishes')
    if (wasGoogle) nextAuthSignOut({ redirect: false })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        isLoggedIn: !!user,
        isGuide: user?.role === 'guide',
        login,
        loginSocial,
        loginGoogle,
        guideLoginRequest,
        guideLoginVerify,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
