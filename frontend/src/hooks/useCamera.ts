'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [retakingIndex, setRetakingIndex] = useState<number | null>(null)
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)
  const [captureTimer, setCaptureTimer] = useState(3) // Default 3 seconds
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isCapturing, setIsCapturing] = useState(false) // Add this to prevent double capture
  const [previewMode, setPreviewMode] = useState(false) // New state for preview mode
  const router = useRouter()

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const captureInProgressRef = useRef<boolean>(false)

  // Dummy frame data - akan diganti dengan data real nantinya
  const frameData = {
    totalFrames: 4, // bisa diubah menjadi 6, 8, dll
    frames: [
      { id: 1, name: "Frame 1" },
      { id: 2, name: "Frame 2" },
      { id: 3, name: "Frame 3" },
      { id: 4, name: "Frame 4" }
    ]
  }

  // Function untuk menentukan grid columns berdasarkan jumlah frame
  const getGridColumns = (totalFrames: number) => {
    if (totalFrames <= 2) return "grid-cols-1"
    if (totalFrames <= 4) return "grid-cols-2"
    if (totalFrames <= 6) return "grid-cols-3"
    return "grid-cols-4"
  }

  useEffect(() => {
    let mounted = true

    async function startCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Browser Anda tidak mendukung kamera (getUserMedia tidak tersedia)")
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        if (!mounted) {
          // if component unmounted while asking permission, stop the stream
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.playsInline = true
          await videoRef.current.play().catch(() => {
            /* ignore play errors (autoplay policies) */
          })
        }
      } catch (err: any) {
        setError(err?.message || "Gagal mengakses kamera")
      }
    }

    startCamera()

    return () => {
      mounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
      // Clear any running countdown
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
    }
  }, [])

  // Define actualCapturePhoto first
  const actualCapturePhoto = useCallback(async () => {

    // Prevent double capture with both state and ref
    if (isCapturing || captureInProgressRef.current || !videoRef.current) {

      return
    }

    setIsCapturing(true)
    captureInProgressRef.current = true

    try {
      const video = videoRef.current


      const width = video.videoWidth || 640
      const height = video.videoHeight || 480
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setError("Tidak dapat membuat canvas")
        return
      }
      
      
      // Flip the image horizontally to match the mirror effect
      ctx.scale(-1, 1)
      ctx.drawImage(video, -width, 0, width, height)
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)


      // Use functional update to prevent stale closure issues
      setPhotos((prev) => {
        // if retaking, replace at index
        if (retakingIndex !== null && prev[retakingIndex]) {
          const copy = [...prev]
          copy[retakingIndex] = dataUrl
          return copy
        }

        // otherwise append if not full
        if (prev.length >= frameData.totalFrames) {
          return prev
        }
        
        return [...prev, dataUrl]
      })

      setRetakingIndex(null)
      setSelectedIndex(null)
    } catch (err: any) {
      setError("Gagal mengambil foto: " + err.message)
    } finally {
      // Reset capturing state after a brief delay
      setTimeout(() => {
        setIsCapturing(false)
        captureInProgressRef.current = false
      }, 300)
    }
  }, [isCapturing, retakingIndex, frameData.totalFrames])

  const capturePhoto = useCallback(async () => {

    // If timer is set, start countdown
    if (captureTimer > 0) {
      // Prevent starting countdown if already counting down
      if (isCountingDown) return


      // Clear any existing interval
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }

      setIsCountingDown(true)
      setCountdown(captureTimer)
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!)
            countdownIntervalRef.current = null
            setIsCountingDown(false)
            // Actually capture the photo after countdown
            setTimeout(() => {
              actualCapturePhoto()
            }, 100) // Small delay to ensure state is updated
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return
    }
    
    // If no timer, capture immediately
    actualCapturePhoto()
  }, [isCapturing, isCountingDown, captureTimer, actualCapturePhoto])

  const startRetake = () => {
    if (selectedIndex === null) return
    setRetakingIndex(selectedIndex)
    setPreviewMode(false) // Exit preview mode when starting retake
  }

  const cancelRetake = () => {
    setRetakingIndex(null)
    // Re-enable preview mode if there's a selected photo
    if (selectedIndex !== null && photos[selectedIndex]) {
      setPreviewMode(true)
    }
  }

  const finish = () => {
    // stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }

    // generate random code for placeholder QR
    const code = Math.random().toString(36).slice(2, 10)
    router.push(`/thanks?code=${code}`)
  }

  const handleTimeFinish = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setError("Waktu habis")
  }

  // Function to toggle preview mode when photo is selected
  const handlePhotoSelect = (index: number) => {
    setSelectedIndex(index)
    if (photos[index]) {
      // If photo exists, enable preview mode
      setPreviewMode(true)
    } else {
      // If no photo, disable preview mode
      setPreviewMode(false)
    }
  }

  // Function to exit preview mode and return to camera
  const exitPreviewMode = () => {
    setPreviewMode(false)
    setSelectedIndex(null)
  }

  return {
    // Refs
    videoRef,
    streamRef,
    
    // State
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
    
    // Functions
    capturePhoto,
    startRetake,
    cancelRetake,
    finish,
    handleTimeFinish,
    getGridColumns,
    setSelectedIndex,
    setShowWelcomePopup,
    setCaptureTimer,
    handlePhotoSelect,
    exitPreviewMode
  }
}
