'use client'

interface CameraActionButtonsProps {
  onCapture: () => void
  onStartRetake: () => void
  onCancelRetake: () => void
  onFinish: () => void
  captureDisabled: boolean
  selectedIndex: number | null
  retakingIndex: number | null
  photos: string[]
  totalFrames: number
  isCapturing?: boolean
}

export default function CameraActionButtons({
  onCapture,
  onStartRetake,
  onCancelRetake,
  onFinish,
  captureDisabled,
  selectedIndex,
  retakingIndex,
  photos,
  totalFrames,
  isCapturing = false
}: CameraActionButtonsProps) {
  
  const handleCaptureClick = () => {
    console.log('🎯 Capture button clicked', {
      captureDisabled,
      isCapturing,
      selectedIndex,
      retakingIndex,
      photosCount: photos.length,
      totalFrames
    })
    onCapture()
  }

  return (
    <div className="space-y-4">
      {/* Start Photo Button */}
      <button
        onClick={handleCaptureClick}
        disabled={captureDisabled || isCapturing}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
          disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
          text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200
          text-lg transform hover:scale-105 active:scale-95"
      >
        {isCapturing ? 'Mengambil...' : (retakingIndex !== null ? 'Ambil Ulang' : 'Mulai Foto')}
      </button>

      {/* Retake Controls */}
      {selectedIndex !== null && photos[selectedIndex] && retakingIndex === null && (
        <button
          onClick={onStartRetake}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold 
            py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
        >
          Foto Ulang
        </button>
      )}

      {retakingIndex !== null && (
        <button
          onClick={onCancelRetake}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold 
            py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
        >
          Batal
        </button>
      )}

      {/* Finish Button */}
      {photos.length === totalFrames && (
        <button
          onClick={onFinish}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold 
            py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
        >
          Selesai
        </button>
      )}
    </div>
  )
}
