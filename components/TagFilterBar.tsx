'use client'

interface TagFilterBarProps {
  tags: string[]
  selectedTag: string | null
  onSelect: (tag: string | null) => void
}

export default function TagFilterBar({ tags, selectedTag, onSelect }: TagFilterBarProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
          selectedTag === null
            ? 'border-primary-600 bg-primary-600 text-white shadow'
            : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700'
        }`}
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
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-700'
            }`}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}



