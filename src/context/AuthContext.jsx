'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const DEMO_USER = {
  name: 'Océane Rakotomalala',
  email: 'oceane@treky.mg',
  avatar: '/images/avatar2.jpg',
  role: 'voyageur',
}

const DEMO_CREDENTIALS = { email: 'oceane@treky.mg', password: 'treky2026' }

// Connexion guide : email + mot de passe, puis vérification SMS (spec §1)
const DEMO_GUIDE = {
  name: 'Rakoto Jean',
  email: 'rakoto.guide@treky.mg',
  avatar: '/images/avatar1.jpg',
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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {}
    setAuthReady(true)
  }, [])

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
    setUser(null)
    localStorage.removeItem(LS_KEY)
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
