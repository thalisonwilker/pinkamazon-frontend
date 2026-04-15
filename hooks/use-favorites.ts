"use client"

import { useCallback, useEffect, useState } from "react"

const FAVORITES_STORAGE_KEY = "pinkamazon-favorites"
const FAVORITES_UPDATED_EVENT = "pinkamazon-favorites-updated"

function readFavoriteIds(): string[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const rawFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!rawFavorites) {
      return []
    }

    const parsed = JSON.parse(rawFavorites)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error("Erro ao recuperar favoritos:", error)
    return []
  }
}

function writeFavoriteIds(favoriteIds: string[]) {
  if (typeof window === "undefined") {
    return
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
  window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT))
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    const syncFavorites = () => setFavoriteIds(readFavoriteIds())

    syncFavorites()
    window.addEventListener("storage", syncFavorites)
    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites)

    return () => {
      window.removeEventListener("storage", syncFavorites)
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites)
    }
  }, [])

  const toggleFavorite = useCallback((productId: string) => {
    const currentFavorites = readFavoriteIds()
    const nextFavorites = currentFavorites.includes(productId)
      ? currentFavorites.filter((id) => id !== productId)
      : [...currentFavorites, productId]

    writeFavoriteIds(nextFavorites)
    setFavoriteIds(nextFavorites)
  }, [])

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  )

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  }
}