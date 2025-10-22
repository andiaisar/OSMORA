"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import BackgroundPattern from "../components/BackgroundPattern"
import WelcomePopup from "../components/WelcomePopup"
import CameraPreview from "../components/CameraPreview"
import CameraSidebar from "../components/CameraSidebar"
import { useCamera } from "../../hooks/useCamera"

export default function Page() {
  const searchParams = useSearchParams()
  let frameId = searchParams.get('frameId')
  
  // If no frameId but we have an order_id from Midtrans callback, try to extract frameId from it
  // Order IDs are in the format OSMORA-timestamp-frameId
  if (!frameId && searchParams.get('order_id')) {
    const orderId = searchParams.get('order_id') as string
    console.log('📝 No frameId, but found order_id:', orderId)
    
    // Try to extract frameId from the order_id (format: OSMORA-timestamp-frameId)
    const orderParts = orderId.split('-')
    if (orderParts.length >= 3) {
      frameId = orderParts[2]
      console.log('🔄 Extracted frameId from order_id:', frameId)
    }
  }
  
  // Debug log to verify frameId is received correctly
  console.log('🔍 Camera page received frameId:', frameId)
  
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
    readyToRetake,
    startRetake,
    confirmRetake,
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
  } = useCamera(frameId)

  // Debug state changes
  useEffect(() => {
    console.log('📊 Camera state update:', {
      frameId,
      totalFrames: frameData.totalFrames,
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
  }, [frameId, frameData.totalFrames, photos.length, selectedIndex, retakingIndex, captureTimer, isCountingDown, countdown, isCapturing, previewMode, error])

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
          readyToRetake={readyToRetake}
          onFrameSelect={handlePhotoSelect}
          onCapture={capturePhoto}
          onStartRetake={startRetake}
          onConfirmRetake={confirmRetake}
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