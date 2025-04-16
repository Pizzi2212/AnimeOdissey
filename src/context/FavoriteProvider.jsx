import React, { createContext, useContext, useState, useEffect } from 'react'

// Crea il contesto
const FavoriteContext = createContext()

// Hook personalizzato per usare il contesto
export const useFavorites = () => useContext(FavoriteContext)

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const storedFavorites = localStorage.getItem('favorites')
    return storedFavorites ? JSON.parse(storedFavorites) : []
  })

  const addFavorite = (anime) => {
    setFavorites((prev) => {
      if (!prev.some((fav) => fav.mal_id === anime.mal_id)) {
        const newFavorites = [...prev, anime]
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
        return newFavorites
      }
      return prev
    })
  }

  const removeFavorite = (anime) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((fav) => fav.mal_id !== anime.mal_id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  return (
    <FavoriteContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  )
}
