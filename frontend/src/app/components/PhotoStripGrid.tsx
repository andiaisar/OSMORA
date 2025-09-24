'use client'

interface Frame {
  id: number
  name: string
}

interface PhotoStripGridProps {
  frames: Frame[]
  photos: string[]
  selectedIndex: number | null
  onFrameSelect: (index: number) => void
  getGridColumns: (totalFrames: number) => string
}

export default function PhotoStripGrid({ 
  frames, 
  photos, 
  selectedIndex, 
  onFrameSelect, 
  getGridColumns 
}: PhotoStripGridProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-black rounded-2xl p-4 shadow-xl">
        <div className={`grid gap-2 ${getGridColumns(frames.length)}`}>
          {frames.map((frame, index) => (
            <div 
              key={frame.id}
              className={`
                aspect-square bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg
                flex items-center justify-center text-white text-2xl font-bold
                cursor-pointer transition-all duration-200 hover:scale-105
                ${selectedIndex === index ? 'ring-4 ring-yellow-400' : ''}
                ${photos[index] ? 'bg-none' : ''}
              `}
              onClick={() => onFrameSelect(index)}
              style={{
                backgroundImage: photos[index] ? `url(${photos[index]})` : '',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!photos[index] && frame.id}
            </div>
          ))}
        </div>
        
        {/* Small text at bottom */}
        <div className="text-xs text-gray-400 text-center mt-3 space-y-1">
          <div>EVERY MOMENT</div>
          <div>BEAUTIFULLY CAPTURED</div>
        </div>
      </div>
    </div>
  )
}
