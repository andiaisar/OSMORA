'use client'

import { RefObject } from 'react'
import CountdownOverlay from './CountdownOverlay'

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>
  error: string | null
  isCountingDown: boolean
  countdown: number
  previewMode?: boolean
  selectedPhoto?: string | null
  onExitPreview?: () => void
}

export default function CameraPreview({ 
  videoRef, 
  error, 
  isCountingDown, 
  countdown, 
  previewMode = false, 
  selectedPhoto = null, 
  onExitPreview 
}: CameraPreviewProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-red-500 text-xl">
            Error: {error}
          </div>
        ) : previewMode && selectedPhoto ? (
          <>
            {/* Preview Mode - Show Selected Photo */}
            <img 
              src={selectedPhoto} 
              alt="Selected photo preview" 
              className="w-full h-full object-cover" 
            />
            {/* Exit Preview Button */}
            <button
              onClick={onExitPreview}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg transition-colors duration-200 backdrop-blur-sm"
            >
              Back to Camera
            </button>
            {/* Preview Label */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
              Photo Preview
            </div>
          </>
        ) : (
          <>
            {/* Camera Mode - Show Live Video */}
            <video 
              ref={videoRef} 
              className="w-full h-full object-cover transform scale-x-[-1]" 
              autoPlay 
              muted 
            />
          </>
        )}
        <CountdownOverlay isVisible={isCountingDown} countdown={countdown} />
      </div>
    </div>
  )
}
