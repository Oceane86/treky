'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('treky_favorites')
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
  }, [])

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try { localStorage.setItem('treky_favorites', JSON.stringify(next)) } catch {}
      return next
    })
  }

  function isFavorite(id) {
    return favorites.includes(id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
