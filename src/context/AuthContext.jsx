'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const DEMO_USER = {
  name: 'Océane Rakotomalala',
  email: 'oceane@treky.mg',
  avatar: '/images/avatar2.jpg',
}

const DEMO_CREDENTIALS = { email: 'oceane@treky.mg', password: 'treky2026' }
const LS_KEY = 'treky_user'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {}
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

  function loginSocial() {
    setUser(DEMO_USER)
    localStorage.setItem(LS_KEY, JSON.stringify(DEMO_USER))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(LS_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, loginSocial, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
