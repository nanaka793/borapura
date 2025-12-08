'use client'

interface TagFilterBarProps {
  tags: string[]
  selectedTag: string | null
  onSelect: (tag: string | null) => void
  themeColor?: string
}

export default function TagFilterBar({ tags, selectedTag, onSelect, themeColor }: TagFilterBarProps) {
  const defaultThemeColor = themeColor || '#57AABC' // Fallback for posts page
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition drop-shadow-md ${
          selectedTag === null
            ? 'text-white'
            : 'border-gray-200 bg-white/85 text-gray-600 hover:border-gray-300'
        }`}
        style={selectedTag === null ? { borderColor: defaultThemeColor, backgroundColor: `${defaultThemeColor}D9` } : {}}
      >
        すべてのカテゴリー
      </button>
      {tags.map((tag) => {
        const isActive = selectedTag === tag
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onSelect(tag)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition drop-shadow-md ${
              isActive
                ? ''
                : 'border-gray-200 bg-white/85 text-gray-600 hover:border-gray-300'
            }`}
            style={isActive ? { borderColor: defaultThemeColor, backgroundColor: `${defaultThemeColor}15`, color: defaultThemeColor } : {}}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}



