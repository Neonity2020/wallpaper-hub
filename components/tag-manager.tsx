'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { X, Plus, Tag } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'

interface TagManagerProps {
  wallpaperId: string
  className?: string
}

export function TagManager({ wallpaperId, className = '' }: TagManagerProps) {
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')
  const {
    getWallpaperTags,
    addTagToWallpaper,
    removeTagFromWallpaper,
    getAllTags
  } = useFavorites()

  const tags = getWallpaperTags(wallpaperId)
  const allTags = getAllTags()

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      addTagToWallpaper(wallpaperId, newTag.trim())
      setNewTag('')
      setIsAddingTag(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
    } else if (e.key === 'Escape') {
      setNewTag('')
      setIsAddingTag(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">标签</span>
      </div>

      {/* Existing Tags */}
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
            onClick={() => removeTagFromWallpaper(wallpaperId, tag)}
          >
            {tag}
            <X className="h-3 w-3" />
          </Badge>
        ))}

        {/* Add Tag Button */}
        {!isAddingTag ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingTag(true)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加标签
          </Button>
        ) : (
          <div className="flex gap-1">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={() => setIsAddingTag(false)}
              placeholder="输入标签名称"
              className="h-6 text-xs"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddTag}
              className="h-6 px-2"
              disabled={!newTag.trim() || tags.includes(newTag.trim())}
            >
              确定
            </Button>
          </div>
        )}
      </div>

      {/* Popular Tags Suggestions */}
      {isAddingTag && allTags.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">常用标签:</p>
          <div className="flex flex-wrap gap-1">
            {allTags.slice(0, 8).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  if (!tags.includes(tag)) {
                    addTagToWallpaper(wallpaperId, tag)
                  }
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}