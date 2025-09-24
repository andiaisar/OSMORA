"use client"

import React, { useEffect } from "react"
import BackgroundPattern from "../components/BackgroundPattern"
import WelcomePopup from "../components/WelcomePopup"
import CameraPreview from "../components/CameraPreview"
import CameraSidebar from "../components/CameraSidebar"
import { useCamera } from "../../hooks/useCamera"

export default function Page() {
  const {
    videoRef,
    error,
    photos,
    selectedIndex,
    retakingIndex,
    showWelcomePopup,
    frameData,
    captureTimer,
    isCountingDown,
    countdown,
    isCapturing,
    previewMode,
    startRetake,
    capturePhoto,
    cancelRetake,
    finish,
    handleTimeFinish,
    getGridColumns,
    setSelectedIndex,
    setShowWelcomePopup,
    setCaptureTimer,
    handlePhotoSelect,
    exitPreviewMode
  } = useCamera()

  // Debug state changes
  useEffect(() => {
    console.log('📊 Camera state update:', {
      photosCount: photos.length,
      selectedIndex,
      retakingIndex,
      captureTimer,
      isCountingDown,
      countdown,
      isCapturing,
      previewMode,
      hasError: !!error
    })
  }, [photos.length, selectedIndex, retakingIndex, captureTimer, isCountingDown, countdown, isCapturing, previewMode, error])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
      <div className="absolute inset-0 z-0">
        <BackgroundPattern />
      </div>
      
      {/* Main Layout Container */}
      <div className="relative z-10 flex h-full p-8 gap-8">
        
        {/* Left Side - Camera Preview */}
        <CameraPreview 
          videoRef={videoRef} 
          error={error} 
          isCountingDown={isCountingDown}
          countdown={countdown}
          previewMode={previewMode}
          selectedPhoto={selectedIndex !== null ? photos[selectedIndex] : null}
          onExitPreview={exitPreviewMode}
        />

        {/* Right Side - Controls */}
        <CameraSidebar
          frameData={frameData}
          photos={photos}
          selectedIndex={selectedIndex}
          retakingIndex={retakingIndex}
          onFrameSelect={handlePhotoSelect}
          onCapture={capturePhoto}
          onStartRetake={startRetake}
          onCancelRetake={cancelRetake}
          onFinish={finish}
          onTimeFinish={handleTimeFinish}
          getGridColumns={getGridColumns}
          captureTimer={captureTimer}
          onCaptureTimerChange={setCaptureTimer}
          isCapturing={isCapturing}
        />
      </div>

      {/* Welcome Popup */}
      <WelcomePopup 
        isVisible={showWelcomePopup} 
        onClose={() => setShowWelcomePopup(false)} 
      />
    </div>
  )
}