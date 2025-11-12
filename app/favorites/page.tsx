'use client'

import { useState, useEffect } from 'react'
import { Wallpaper } from '@/app/types'
import { fetchBingWallpapers, fetchSpotlightWallpapers } from '@/lib/api'
import { WallpaperCardWithTags } from '@/components/wallpaper-card-with-tags'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { TagFilter } from '@/components/tag-filter'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, Heart, ArrowLeft, Tag as TagIcon } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import Link from 'next/link'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { getFavorites, getWallpaperTags, getAllTags, getFavoritesByTag } = useFavorites()

  const loadFavorites = async () => {
    setLoading(true)
    setError(null)

    try {
      const favoriteIds = selectedTag
        ? getFavoritesByTag(selectedTag)
        : getFavorites()

      if (favoriteIds.length === 0) {
        setFavorites([])
        setLoading(false)
        return
      }

      const [bingData, spotlightData] = await Promise.all([
        fetchBingWallpapers('us', 50), // Fetch more to include favorites
        fetchSpotlightWallpapers(50)
      ])

      const allWallpapers = [...bingData, ...spotlightData]
      const favoriteWallpapers = allWallpapers.filter(wallpaper =>
        favoriteIds.includes(wallpaper.id)
      ).map(wallpaper => ({
        ...wallpaper,
        isFavored: true,
        tags: getWallpaperTags(wallpaper.id)
      }))

      // Sort by when they were favorited (most recent first)
      const sortedFavorites = favoriteIds
        .map(id => favoriteWallpapers.find(w => w.id === id))
        .filter(Boolean) as Wallpaper[]

      setFavorites(sortedFavorites)
    } catch (err) {
      setError('Failed to load favorites. Please try again.')
      console.error('Error loading favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFavorites()
  }, [selectedTag])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">My Favorites</h1>
                <p className="text-muted-foreground">
                  Your favorite wallpapers collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tag Filter */}
        <TagFilter
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
        />

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                {favorites.length > 0
                  ? selectedTag
                    ? `找到 ${favorites.length} 个包含标签 "${selectedTag}" 的收藏`
                    : `You have ${favorites.length} favorite${favorites.length === 1 ? '' : 's'}`
                  : 'No favorites yet'
                }
              </p>
            </div>

            {/* Favorites Grid */}
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((wallpaper) => (
                  <WallpaperCardWithTags
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    showTags={true}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-16 h-16 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle>No favorites yet</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Start adding wallpapers to your favorites by clicking the heart icon on any wallpaper.
                  </p>
                  <Link href="/">
                    <Button>
                      Browse Wallpapers
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            <p>
              Powered by{' '}
              <a
                href="https://peapix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Peapix API
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}