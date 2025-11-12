'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { Filter, X } from 'lucide-react'
import { useFavorites } from '@/hooks/use-favorites'

export function TagFilter({
  selectedTag,
  onTagChange
}: {
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const { getAllTags } = useFavorites()
  const allTags = getAllTags()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      onTagChange(null) // Clear filter
    } else {
      onTagChange(tag) // Set new filter
    }
  }

  const clearFilter = () => {
    onTagChange(null)
  }

  if (!isClient || allTags.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-medium">标签筛选</h3>
            {selectedTag && (
              <Badge variant="default" className="gap-1">
                {selectedTag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={clearFilter}
                />
              </Badge>
            )}
          </div>
          {allTags.length > 6 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '收起' : '展开'}
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!selectedTag ? (
            <Badge variant="outline" className="cursor-default">
              全部收藏
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-muted"
              onClick={() => onTagChange(null)}
            >
              全部收藏
            </Badge>
          )}

          {(isExpanded ? allTags : allTags.slice(0, 6)).map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer transition-colors"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {selectedTag && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              正在显示包含标签 "{selectedTag}" 的收藏壁纸
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}