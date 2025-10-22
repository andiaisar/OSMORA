'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getFrame } from '../lib/api'

type FrameData = {
  totalFrames: number
  frames: { id: number; name: string }[]
}

export function useCamera(frameId: string | null = null) {
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
  const [readyToRetake, setReadyToRetake] = useState(false) // New state for retake ready mode
  const [frameData, setFrameData] = useState<FrameData>({
    totalFrames: 4, // Default to 4 frames
    frames: [
      { id: 1, name: "Frame 1" },
      { id: 2, name: "Frame 2" },
      { id: 3, name: "Frame 3" },
      { id: 4, name: "Frame 4" }
    ]
  })
  const router = useRouter()

  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const captureInProgressRef = useRef<boolean>(false)

  // Fetch frame data if frameId is provided
  useEffect(() => {
    // Default to 4-frame if no frameId provided
    if (!frameId) {
      console.log('⚠️ No frameId provided, defaulting to 4-frame layout')
      
      // Ensure we have the default 4 frames
      const defaultFrames = Array.from(
        { length: 4 },
        (_, idx) => ({ id: idx + 1, name: `Frame ${idx + 1}` })
      )
      
      setFrameData({
        totalFrames: 4,
        frames: defaultFrames
      })
      return
    }

    console.log('🖼️ Fetching frame data for frameId:', frameId)
    
    // Local function to update frame data based on count
    const updateFrameData = (count: number) => {
      console.log(`🔄 Creating ${count} frame slots`)
      
      const framesArray = Array.from(
        { length: count },
        (_, idx) => ({ id: idx + 1, name: `Frame ${idx + 1}` })
      )
      
      console.log(`� Setting frameData with totalFrames: ${count}, frames array length: ${framesArray.length}`)
      
      // Use setTimeout to ensure state update happens outside current execution context
      setTimeout(() => {
        setFrameData({
          totalFrames: count,
          frames: framesArray
        })
      }, 0)
    }
    
    // Simplified direct approach - don't even try the API for now
    const frameIdNumber = parseInt(frameId)
    // Check if it's one of our 6-photo frames (IDs 4, 5, 6)
    const isSixPhotoFrame = [4, 5, 6].includes(frameIdNumber)
    const totalPhotos = isSixPhotoFrame ? 6 : 4
    
    console.log(`📱 Frame ID ${frameId} corresponds to a ${totalPhotos}-photo frame`)
    updateFrameData(totalPhotos)
    
    /* Uncomment this when API is ready
    async function fetchFrameData() {
      try {
        // Only call API if frameId is not null
        const frameResponse: any = await getFrame(frameId as string)
        console.log('✅ Frame data received:', frameResponse)
        
        // The backend API response contains photo_in_frame property
        if (frameResponse && frameResponse.photo_in_frame) {
          // Create frames array based on photo_in_frame count
          const photoCount = frameResponse.photo_in_frame as number
          updateFrameData(photoCount)
        } else {
          // Fallback to basic layout info from confirm page
          const frameIdNumber = parseInt(frameId as string)
          const isSixPhotoFrame = [4, 5, 6].includes(frameIdNumber)
          const totalPhotos = isSixPhotoFrame ? 6 : 4
          updateFrameData(totalPhotos)
        }
      } catch (err) {
        console.error('❌ Error fetching frame data:', err)
        // On error, use the fallback approach
        const frameIdNumber = parseInt(frameId as string)
        const isSixPhotoFrame = [4, 5, 6].includes(frameIdNumber)
        const totalPhotos = isSixPhotoFrame ? 6 : 4
        updateFrameData(totalPhotos)
      }
    }

    fetchFrameData()
    */
  }, [frameId])

  // Function untuk menentukan grid columns berdasarkan jumlah frame
  const getGridColumns = (totalFrames: number) => {
    console.log(`🧮 Getting grid columns for ${totalFrames} total frames`)
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

  // Effect to ensure video stays connected to stream when not in preview mode
  useEffect(() => {
    if (!previewMode && videoRef.current && streamRef.current) {
      const video = videoRef.current
      
      // Only reconnect if video is not already connected to the current stream
      if (video.srcObject !== streamRef.current) {
        console.log('🔄 Reconnecting video to stream (not in preview mode)')
        video.srcObject = streamRef.current
        video.playsInline = true
        video.play().catch(() => {
          console.warn('Failed to play video after reconnection')
        })
      }
      
      // Clear any previous errors when returning to camera mode
      setError(null)
    }
  }, [previewMode]) // Re-run when previewMode changes

  // Log the current state of frameData whenever it changes
  useEffect(() => {
    console.log('📊 Current frameData state:', {
      frameId,
      totalFrames: frameData.totalFrames,
      framesLength: frameData.frames.length,
      frameDetails: frameData.frames.map(f => ({ id: f.id, name: f.name }))
    })
  }, [frameData, frameId])

  // Function to ensure video is connected to stream and ready
  const ensureVideoReady = useCallback(async () => {
    const video = videoRef.current
    if (!video || !streamRef.current) {
      console.error('❌ No video element or stream available')
      return false
    }

    // Check if video is already connected to stream
    if (video.srcObject !== streamRef.current) {
      console.log('🔧 Reconnecting video to stream...')
      video.srcObject = streamRef.current
      video.playsInline = true
    }

    // Ensure video is playing
    try {
      if (video.paused) {
        await video.play()
      }
    } catch (err) {
      console.warn('⚠️ Failed to play video:', err)
    }

    // Wait for video to be ready
    return new Promise<boolean>((resolve) => {
      const checkReady = () => {
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          console.log('✅ Video is ready')
          resolve(true)
        } else {
          console.log('⏳ Video not ready yet, retrying...', {
            readyState: video.readyState,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          })
          setTimeout(checkReady, 100)
        }
      }
      
      // Start checking immediately, but timeout after 5 seconds
      checkReady()
      setTimeout(() => resolve(false), 5000)
    })
  }, [])

  // Define actualCapturePhoto first
  const actualCapturePhoto = useCallback(async () => {
    console.log('📸 actualCapturePhoto called', {
      isCapturing,
      captureInProgress: captureInProgressRef.current,
      hasVideo: !!videoRef.current,
      retakingIndex
    })

    // Prevent double capture with both state and ref
    if (isCapturing || captureInProgressRef.current || !videoRef.current) {
      console.log('⏸️ Capture prevented - already capturing or no video')
      return
    }

    setIsCapturing(true)
    captureInProgressRef.current = true

    try {
      // Ensure video is ready before capture
      const videoReady = await ensureVideoReady()
      if (!videoReady) {
        setError("Kamera tidak siap. Silakan coba lagi.")
        return
      }

      const video = videoRef.current!
      console.log('✅ Video ready, starting capture...')

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
        console.log('💾 Saving photo...', {
          retakingIndex,
          currentPhotosCount: prev.length,
          totalFrames: frameData.totalFrames,
          prevPhotos: prev.map((photo, idx) => ({ idx, hasPhoto: !!photo, preview: photo?.substring(0, 20) + '...' }))
        })
        
        // if retaking, replace at index
        if (retakingIndex !== null && retakingIndex >= 0 && retakingIndex < prev.length) {
          console.log(`🔄 Replacing photo at index ${retakingIndex}`)
          const copy = [...prev]
          copy[retakingIndex] = dataUrl
          console.log(`✅ Photo replaced at index ${retakingIndex}`)
          
          // Reset retaking state after successful replacement
          setTimeout(() => {
            setRetakingIndex(null)
            setSelectedIndex(null)
          }, 0)
          
          return copy
        }

        // If retaking but index is invalid or no photo exists
        if (retakingIndex !== null) {
          console.warn(`⚠️ Invalid retake: index ${retakingIndex}, array length ${prev.length}`)
          // Reset on invalid retake
          setTimeout(() => {
            setRetakingIndex(null)
            setSelectedIndex(null)
          }, 0)
        }

        // otherwise append if not full
        if (prev.length >= frameData.totalFrames) {
          console.log('🚫 Cannot add more photos, limit reached')
          return prev
        }
        
        console.log(`✅ Adding new photo at index ${prev.length}`)
        
        // Reset states for new photo (not retake)
        if (retakingIndex === null) {
          setTimeout(() => {
            setSelectedIndex(null)
          }, 0)
        }
        
        return [...prev, dataUrl]
      })

      console.log('🎯 Photo capture completed')
      // Don't reset states here - they're reset in setPhotos callback
    } catch (err: any) {
      setError("Gagal mengambil foto: " + err.message)
    } finally {
      // Reset capturing state after a brief delay
      setTimeout(() => {
        setIsCapturing(false)
        captureInProgressRef.current = false
      }, 300)
    }
  }, [isCapturing, retakingIndex, frameData.totalFrames, ensureVideoReady])

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
    
    console.log('🔄 Starting retake for photo index:', selectedIndex, 'Current photos:', photos.length)
    
    // Store the index to retake before resetting selectedIndex
    const indexToRetake = selectedIndex
    setRetakingIndex(indexToRetake)
    
    console.log('📝 Set retakingIndex to:', indexToRetake)
    
    // Exit preview mode and return to live camera
    setPreviewMode(false)
    setSelectedIndex(null)
    
    console.log('🎬 Switched to camera mode, preparing video...')
    
    // Give UI time to update, then ensure video is ready but DON'T start capture yet
    setTimeout(async () => {
      console.log('📹 Ensuring video is ready for retake...')
      
      // Use the new ensureVideoReady function
      const videoReady = await ensureVideoReady()
      
      if (videoReady) {
        console.log('✅ Video ready! Waiting for user to confirm retake...')
        setReadyToRetake(true) // Set ready to retake state instead of capturing immediately
      } else {
        console.error('❌ Video failed to become ready for retake')
        setError("Kamera tidak dapat digunakan untuk retake. Silakan coba lagi.")
        // Reset retaking state on error
        setRetakingIndex(null)
      }
    }, 800) // Increased delay further to ensure UI and stream reconnection completes
  }

  // New function for user to confirm retake capture
  const confirmRetake = () => {
    if (!readyToRetake || retakingIndex === null) return
    
    console.log('✅ User confirmed retake, starting capture...')
    setReadyToRetake(false) // Reset ready state
    capturePhoto() // Now start the capture process with timer
  }

  const cancelRetake = () => {
    // Restore the selected index from retaking index
    if (retakingIndex !== null && photos[retakingIndex]) {
      setSelectedIndex(retakingIndex)
      setPreviewMode(true)
    }
    setRetakingIndex(null)
    setReadyToRetake(false) // Reset ready to retake state
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
    console.log('🖼️ Photo selected:', index, 'Has photo:', !!photos[index])
    setSelectedIndex(index)
    if (photos[index]) {
      // If photo exists, enable preview mode
      setPreviewMode(true)
      console.log('👁️ Preview mode enabled for photo', index)
    } else {
      // If no photo, disable preview mode
      setPreviewMode(false)
      console.log('❌ No photo at index', index, ', preview mode disabled')
    }
  }

  // Function to exit preview mode and return to camera
  const exitPreviewMode = () => {
    console.log('🚪 Exiting preview mode, returning to camera...')
    setPreviewMode(false)
    setSelectedIndex(null)
    
    // Ensure video reconnects to stream when returning to camera mode
    setTimeout(async () => {
      if (videoRef.current && streamRef.current) {
        console.log('🔧 Reconnecting video after exiting preview...')
        await ensureVideoReady()
      }
    }, 100)
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
    readyToRetake,
    
    // Functions
    capturePhoto,
    startRetake,
    confirmRetake,
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
