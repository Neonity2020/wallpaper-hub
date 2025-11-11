import { Wallpaper, Country } from '@/types'

const BASE_URL = 'https://peapix.com'

export async function fetchBingWallpapers(
  country: Country = 'us',
  count: number = 12
): Promise<Wallpaper[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/bing/feed?country=${country}&n=${count}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // 处理可能的响应格式：如果返回的是包装对象，提取数组
    // 如果 API 返回 { data: [...] } 格式，则提取 data 字段
    const wallpapers = Array.isArray(data) ? data : (data.data || data.items || [])
    console.log(`Bing API 返回数据: 请求 ${count} 条，实际返回 ${wallpapers.length} 条`)
    return wallpapers
  } catch (error) {
    console.error('Error fetching wallpapers:', error)
    throw error
  }
}

export async function fetchSpotlightWallpapers(
  count: number = 12
): Promise<Wallpaper[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/spotlight/feed?n=${count}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    // 处理可能的响应格式：如果返回的是包装对象，提取数组
    const wallpapers = Array.isArray(data) ? data : (data.data || data.items || [])
    console.log(`Spotlight API 返回数据: 请求 ${count} 条，实际返回 ${wallpapers.length} 条`)
    return wallpapers
  } catch (error) {
    console.error('Error fetching spotlight wallpapers:', error)
    throw error
  }
}