'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [retakingIndex, setRetakingIndex] = useState<number | null>(null)
  const [showWelcomePopup, setShowWelcomePopup] = useState(true)
  const router = useRouter()

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
    }
  }, [])

  const capturePhoto = async () => {
    const video = videoRef.current
    if (!video) {
      setError("Video tidak tersedia untuk mengambil foto")
      return
    }

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
    ctx.drawImage(video, 0, 0, width, height)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9)

    setPhotos((prev) => {
      // if retaking, replace at index
      if (retakingIndex !== null && prev[retakingIndex]) {
        const copy = [...prev]
        copy[retakingIndex] = dataUrl
        return copy
      }

      // otherwise append if not full
      if (prev.length >= frameData.totalFrames) return prev
      return [...prev, dataUrl]
    })

    // clear retake state after capture
    setRetakingIndex(null)
    setSelectedIndex(null)
  }

  const startRetake = () => {
    if (selectedIndex === null) return
    setRetakingIndex(selectedIndex)
  }

  const cancelRetake = () => {
    setRetakingIndex(null)
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
    
    // Functions
    capturePhoto,
    startRetake,
    cancelRetake,
    finish,
    handleTimeFinish,
    getGridColumns,
    setSelectedIndex,
    setShowWelcomePopup
  }
}
