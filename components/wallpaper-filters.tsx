'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Country } from '@/types'

interface WallpaperFiltersProps {
  country: Country
  count: number
  onCountryChange: (country: Country) => void
  onCountChange: (count: number) => void
}

const countries: { value: Country; label: string }[] = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'cn', label: 'China' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'in', label: 'India' },
  { value: 'it', label: 'Italy' },
  { value: 'jp', label: 'Japan' },
  { value: 'es', label: 'Spain' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
]

const countOptions = [8, 12, 16, 20, 24]

export function WallpaperFilters({
  country,
  count,
  onCountryChange,
  onCountChange,
}: WallpaperFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">
          Region
        </label>
        <Select value={country} onValueChange={(value: Country) => onCountryChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="sm:w-32">
        <label className="block text-sm font-medium mb-2">
          Count
        </label>
        <Select value={count.toString()} onValueChange={(value) => onCountChange(parseInt(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countOptions.map((count) => (
              <SelectItem key={count} value={count.toString()}>
                {count}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}