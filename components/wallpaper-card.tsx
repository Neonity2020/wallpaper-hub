'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Wallpaper } from '@/types'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Download, Eye } from 'lucide-react'

interface WallpaperCardProps {
  wallpaper: Wallpaper
}

export function WallpaperCard({ wallpaper }: WallpaperCardProps) {
  const [isLoading, setIsLoading] = useState(true)

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
          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2">
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
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {wallpaper.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {wallpaper.copyright}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}