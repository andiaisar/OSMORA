"use client"

import React, { useEffect, useRef, useState } from "react"

type Props = {
  initialSeconds?: number
  onFinish?: () => void
  // when seconds remaining <= warningSeconds, play warning sound
  warningSeconds?: number
}

export default function CountdownTimer({
  initialSeconds = 600,
  onFinish,
  warningSeconds = 10,
}: Props) {
  const [seconds, setSeconds] = useState<number>(initialSeconds)
  const lastBeepRef = useRef<number | null>(null)

  useEffect(() => {
    // reset when prop changes
    setSeconds(initialSeconds)
    lastBeepRef.current = null
  }, [initialSeconds])

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id)
          onFinish?.()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [onFinish])

  // play a short beep when remaining seconds are within warningSeconds
  useEffect(() => {
    if (seconds <= 0) return
    if (seconds <= warningSeconds) {
      // guard to only play one beep per second value
      if (lastBeepRef.current === seconds) return
      lastBeepRef.current = seconds

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = "sine"
        osc.frequency.value = seconds <= 3 ? 880 : 440 // higher pitch near the end
        gain.gain.setValueAtTime(0.0001, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.01)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        // stop shortly after
        const stopAt = ctx.currentTime + 0.15
        gain.gain.exponentialRampToValueAtTime(0.0001, stopAt)
        osc.stop(stopAt)
        // close context after a short delay
        setTimeout(() => {
          try {
            ctx.close()
          } catch (e) {
            /* ignore */
          }
        }, 250)
      } catch (e) {
        // Fallback: do nothing if audio API unavailable
      }
    }
  }, [seconds, warningSeconds])

  const mm = Math.floor(seconds / 60)
  const ss = seconds % 60
  const formatted = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`

  return (
    <div className="m-1 font-mono text-sm">
      <span className="text-gray-600">Waktu tersisa:</span>{' '}
      <span className={`font-semibold ${seconds <= warningSeconds ? 'text-red-600' : 'text-primary'}`}>
        {formatted}
      </span>
    </div>
  )
}
