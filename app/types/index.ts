export interface Wallpaper {
  title: string
  copyright: string
  fullUrl: string
  thumbUrl: string
  imageUrl: string
  pageUrl: string
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