'use client'
import { useState } from 'react'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_MAP: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
}

export default function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const showFallback = !src || hasError

  return (
    <div
      className={`${SIZE_MAP[size]} relative overflow-hidden rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold ${className}`}
    >
      {src && !hasError && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name}のアイコン`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setHasError(true)}
        />
      )}
      {showFallback && <span>{initials || '??'}</span>}
    </div>
  )
}

