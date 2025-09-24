"use client"

import React from "react"

type Props = {
  photos: string[]
  selected?: number | null
  onSelect?: (index: number) => void
  max?: number
}

export default function PhotoStrip({ photos, selected = null, onSelect, max = 4 }: Props) {
  return (
    <div className="flex gap-2 mb-3 items-center overflow-x-auto">
      {photos.slice(0, max).map((src, i) => (
        <div
          key={i}
          onClick={() => onSelect?.(i)}
          className={`cursor-pointer rounded-md p-0 w-28 h-20 flex items-center justify-center bg-black ${
            selected === i ? 'ring-2 ring-blue-500' : 'border border-gray-200'
          }`}
        >
          <img src={src} alt={`photo-${i}`} className="max-w-full max-h-full object-cover rounded-sm" />
        </div>
      ))}

      {photos.length === 0 && (
        <div className="text-gray-500 text-sm">Belum ada foto</div>
      )}
    </div>
  )
}
