'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Wallpaper } from '@/app/types'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Download, Eye, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'
import { TagManager } from './tag-manager'

interface WallpaperCardWithTagsProps {
  wallpaper: Wallpaper
  showTags?: boolean
}

export function WallpaperCardWithTags({ wallpaper, showTags = false }: WallpaperCardWithTagsProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showTagManager, setShowTagManager] = useState(showTags)
  const { isFavorited: checkFavorited, toggleFavorite, getWallpaperTags, updateTrigger } = useFavorites()
  const isFavorited = checkFavorited(wallpaper.id) || wallpaper.isFavored
  const currentTags = getWallpaperTags(wallpaper.id)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = wallpaper.fullUrl
    link.download = `${wallpaper.title}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = () => {
    window.open(wallpaper.fullUrl, '_blank')
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(wallpaper)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={wallpaper.thumbUrl}
            alt={wallpaper.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              isLoading ? 'blur-sm' : ''
            }`}
            onLoadingComplete={() => setIsLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={handlePreview}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg line-clamp-2 flex-1 pr-2">
              {wallpaper.title}
            </h3>
            <Button
              size="sm"
              variant={isFavorited ? "default" : "outline"}
              onClick={handleToggleFavorite}
              className={`p-2 h-8 w-8 shrink-0 transition-colors ${
                isFavorited
                  ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                  : 'hover:bg-red-50 hover:text-red-500 hover:border-red-200'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-white' : ''}`} />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {wallpaper.copyright}
          </p>

          {/* Tags */}
          {isFavorited && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {currentTags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {currentTags.length === 0 && (
                    <span className="text-xs text-muted-foreground">暂无标签</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTagManager(!showTagManager)}
                  className="p-1 h-6 w-6"
                >
                  {showTagManager ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>

              {/* Tag Manager */}
              {showTagManager && (
                <div className="pt-2 border-t">
                  <TagManager wallpaperId={wallpaper.id} />
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}