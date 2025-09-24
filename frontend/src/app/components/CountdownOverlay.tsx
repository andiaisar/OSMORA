'use client'

interface CountdownOverlayProps {
  isVisible: boolean
  countdown: number
}

export default function CountdownOverlay({ isVisible, countdown }: CountdownOverlayProps) {
  console.log('🔍 CountdownOverlay render:', { isVisible, countdown })
  
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="text-white text-8xl font-bold animate-pulse">
        {countdown > 0 ? countdown : '📸'}
      </div>
    </div>
  )
}
