export interface Wallpaper {
  id: string
  title: string
  copyright: string
  fullUrl: string
  thumbUrl: string
  imageUrl: string
  pageUrl: string
  isFavored?: boolean
  tags?: string[]
}

export interface ApiResponse {
  data: Wallpaper[]
  loading: boolean
  error: string | null
}

export type Country =
  | 'au' | 'br' | 'ca' | 'cn' | 'de'
  | 'fr' | 'in' | 'it' | 'jp' | 'es'
  | 'gb' | 'us'

export interface WallpaperFilters {
  country: Country
  count: number
}

export interface WallpaperTag {
  wallpaperId: string
  tags: string[]
}

export interface TagStorage {
  [wallpaperId: string]: string[]
}