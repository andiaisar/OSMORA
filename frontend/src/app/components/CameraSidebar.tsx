'use client'

import CountdownTimer from './CountdownTimer'
import PhotoStripGrid from './PhotoStripGrid'
import CameraActionButtons from './CameraActionButtons'
import TimerSetting from './TimerSetting'

interface Frame {
  id: number
  name: string
}

interface CameraSidebarProps {
  frameData: {
    totalFrames: number
    frames: Frame[]
  }
  photos: string[]
  selectedIndex: number | null
  retakingIndex: number | null
  readyToRetake: boolean
  onFrameSelect: (index: number) => void
  onCapture: () => void
  onStartRetake: () => void
  onConfirmRetake: () => void
  onCancelRetake: () => void
  onFinish: () => void
  onTimeFinish: () => void
  getGridColumns: (totalFrames: number) => string
  captureTimer: number
  onCaptureTimerChange: (seconds: number) => void
  isCapturing?: boolean
}

export default function CameraSidebar({
  frameData,
  photos,
  selectedIndex,
  retakingIndex,
  readyToRetake,
  onFrameSelect,
  onCapture,
  onStartRetake,
  onConfirmRetake,
  onCancelRetake,
  onFinish,
  onTimeFinish,
  getGridColumns,
  captureTimer,
  onCaptureTimerChange,
  isCapturing = false
}: CameraSidebarProps) {
  return (
    <div className="w-80 flex flex-col justify-between py-4">
      {/* Timer */}
      <div className="flex justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
          <CountdownTimer
            initialSeconds={10 * 60} 
            onFinish={onTimeFinish}
          />
        </div>
      </div>

      {/* Timer Setting */}
      <TimerSetting 
        currentTimer={captureTimer} 
        onTimerChange={onCaptureTimerChange}
      />

      {/* Photo Strip Grid */}
      <PhotoStripGrid
        frames={frameData.frames}
        photos={photos}
        selectedIndex={selectedIndex}
        onFrameSelect={onFrameSelect}
        getGridColumns={getGridColumns}
      />

      {/* Action Buttons */}
      <CameraActionButtons
        onCapture={onCapture}
        onStartRetake={onStartRetake}
        onConfirmRetake={onConfirmRetake}
        onCancelRetake={onCancelRetake}
        onFinish={onFinish}
        captureDisabled={photos.length >= frameData.totalFrames && retakingIndex === null}
        selectedIndex={selectedIndex}
        retakingIndex={retakingIndex}
        readyToRetake={readyToRetake}
        photos={photos}
        totalFrames={frameData.totalFrames}
        isCapturing={isCapturing}
      />
    </div>
  )
}
