'use client'

import { useState, useEffect } from 'react'
import { Wallpaper, Country } from '@/app/types'
import { fetchBingWallpapers, fetchSpotlightWallpapers } from '@/lib/api'
import { WallpaperCard } from '@/components/wallpaper-card'
import { WallpaperFilters } from '@/components/wallpaper-filters'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Image as ImageIcon, RefreshCw, Heart } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import Link from 'next/link'

export default function HomePage() {
  const [bingWallpapers, setBingWallpapers] = useState<Wallpaper[]>([])
  const [spotlightWallpapers, setSpotlightWallpapers] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [country, setCountry] = useState<Country>('us')
  const [count, setCount] = useState(12)
  const [activeTab, setActiveTab] = useState<'bing' | 'spotlight'>('bing')
  const { getFavorites, updateTrigger } = useFavorites()
  const [favoritesCount, setFavoritesCount] = useState(0)

  const loadWallpapers = async () => {
    setLoading(true)
    setError(null)

    try {
      const [bingData, spotlightData] = await Promise.all([
        fetchBingWallpapers(country, count),
        fetchSpotlightWallpapers(count)
      ])

      const favoriteIds = getFavorites()

      const bingsWithFavorites = bingData.map(wallpaper => ({
        ...wallpaper,
        isFavored: favoriteIds.includes(wallpaper.id)
      }))

      const spotlightsWithFavorites = spotlightData.map(wallpaper => ({
        ...wallpaper,
        isFavored: favoriteIds.includes(wallpaper.id)
      }))

      console.log('加载的壁纸数据:', {
        bing: bingData.length,
        spotlight: spotlightData.length,
        requestedCount: count,
        favorites: favoriteIds.length
      })
      setBingWallpapers(bingsWithFavorites)
      setSpotlightWallpapers(spotlightsWithFavorites)
    } catch (err) {
      setError('Failed to load wallpapers. Please try again.')
      console.error('Error loading wallpapers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWallpapers()
    setFavoritesCount(getFavorites().length)
  }, [country, count])

  // Listen for storage changes to update favorites count
  useEffect(() => {
    setFavoritesCount(getFavorites().length)
  }, [getFavorites, updateTrigger])

  const currentWallpapers = activeTab === 'bing' ? bingWallpapers : spotlightWallpapers

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Bing Wallpaper Hub</h1>
                <p className="text-muted-foreground">
                  Beautiful wallpapers from around the world
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/favorites">
                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <Heart className="h-4 w-4" />
                  My Favorites
                  {favoritesCount > 0 && (
                    <span className="ml-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">
                      {favoritesCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button
                onClick={loadWallpapers}
                disabled={loading}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === 'bing' ? 'default' : 'outline'}
            onClick={() => setActiveTab('bing')}
          >
            Bing Daily Wallpapers
          </Button>
          <Button
            variant={activeTab === 'spotlight' ? 'default' : 'outline'}
            onClick={() => setActiveTab('spotlight')}
          >
            Windows Spotlight
          </Button>
        </div>

        {/* Filters - Only show for Bing wallpapers */}
        {activeTab === 'bing' && (
          <WallpaperFilters
            country={country}
            count={count}
            onCountryChange={setCountry}
            onCountChange={setCount}
          />
        )}

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
                Showing {currentWallpapers.length} wallpapers
              </p>
            </div>

            {/* Wallpaper Grid */}
            {currentWallpapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentWallpapers.map((wallpaper) => (
                  <WallpaperCard
                    key={wallpaper.pageUrl}
                    wallpaper={wallpaper}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No wallpapers found</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Try changing your filters or refreshing the page.
                  </p>
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