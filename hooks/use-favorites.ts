'use client'

import { useState, useCallback } from 'react'
import { Wallpaper, TagStorage } from '@/app/types'

const FAVORITES_KEY = 'wallpaper-favorites'
const TAGS_KEY = 'wallpaper-tags'

export function useFavorites() {
  const [updateTrigger, setUpdateTrigger] = useState(0)

  const triggerUpdate = () => {
    setUpdateTrigger(prev => prev + 1)
  }

  const getFavorites = useCallback((): string[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }, [])

  const getTags = useCallback((): TagStorage => {
    if (typeof window === 'undefined') return {}
    try {
      const stored = localStorage.getItem(TAGS_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }, [])

  const addToFavorites = (wallpaper: Wallpaper) => {
    if (typeof window === 'undefined') return
    try {
      const favorites = getFavorites()
      if (!favorites.includes(wallpaper.id)) {
        favorites.push(wallpaper.id)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      }
      triggerUpdate()
    } catch (error) {
      console.error('Failed to add to favorites:', error)
    }
  }

  const removeFromFavorites = (wallpaperId: string) => {
    if (typeof window === 'undefined') return
    try {
      const favorites = getFavorites()
      const updatedFavorites = favorites.filter(id => id !== wallpaperId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))
      triggerUpdate()
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
    }
  }

  const isFavorited = useCallback((wallpaperId: string): boolean => {
    return getFavorites().includes(wallpaperId)
  }, [getFavorites])

  const getWallpaperTags = useCallback((wallpaperId: string): string[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(TAGS_KEY)
      const tags = stored ? JSON.parse(stored) : {}
      return tags[wallpaperId] || []
    } catch {
      return []
    }
  }, [updateTrigger])

  const addTagToWallpaper = (wallpaperId: string, tag: string) => {
    if (typeof window === 'undefined') return
    try {
      const tags = getTags()
      const currentTags = tags[wallpaperId] || []
      if (!currentTags.includes(tag)) {
        tags[wallpaperId] = [...currentTags, tag]
        localStorage.setItem(TAGS_KEY, JSON.stringify(tags))
        triggerUpdate()
      }
    } catch (error) {
      console.error('Failed to add tag to wallpaper:', error)
    }
  }

  const removeTagFromWallpaper = (wallpaperId: string, tag: string) => {
    if (typeof window === 'undefined') return
    try {
      const tags = getTags()
      const currentTags = tags[wallpaperId] || []
      if (currentTags.includes(tag)) {
        tags[wallpaperId] = currentTags.filter((t: string) => t !== tag)
        localStorage.setItem(TAGS_KEY, JSON.stringify(tags))
        triggerUpdate()
      }
    } catch (error) {
      console.error('Failed to remove tag from wallpaper:', error)
    }
  }

  const updateWallpaperTags = (wallpaperId: string, newTags: string[]) => {
    if (typeof window === 'undefined') return
    try {
      const tags = getTags()
      if (newTags.length === 0) {
        delete tags[wallpaperId]
      } else {
        tags[wallpaperId] = newTags
      }
      localStorage.setItem(TAGS_KEY, JSON.stringify(tags))
      triggerUpdate()
    } catch (error) {
      console.error('Failed to update wallpaper tags:', error)
    }
  }

  const getAllTags = useCallback((): string[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(TAGS_KEY)
      const tags = stored ? JSON.parse(stored) : {}
      const allTags = new Set<string>()
      Object.values(tags).forEach((wallpaperTags) => {
        if (Array.isArray(wallpaperTags)) {
          wallpaperTags.forEach((tag: string) => allTags.add(tag))
        }
      })
      return Array.from(allTags).sort()
    } catch {
      return []
    }
  }, [updateTrigger])

  const getFavoritesByTag = useCallback((tag: string): string[] => {
    const tags = getTags()
    const favorites = getFavorites()
    return favorites.filter(wallpaperId =>
      tags[wallpaperId]?.includes(tag) || false
    )
  }, [getTags, getFavorites])

  const toggleFavorite = (wallpaper: Wallpaper) => {
    if (isFavorited(wallpaper.id)) {
      removeFromFavorites(wallpaper.id)
    } else {
      addToFavorites(wallpaper)
    }
  }

  return {
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    toggleFavorite,
    updateTrigger: updateTrigger as number,
    // Tag management functions
    getTags,
    getWallpaperTags,
    addTagToWallpaper,
    removeTagFromWallpaper,
    updateWallpaperTags,
    getAllTags,
    getFavoritesByTag
  }
}