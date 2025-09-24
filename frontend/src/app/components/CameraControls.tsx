"use client"

import React from "react"

type Props = {
  onCapture: () => void
  captureDisabled?: boolean
  onStartRetake?: () => void
  onCancelRetake?: () => void
  isRetaking?: boolean
  hasSelection?: boolean
  onFinish?: () => void
}

export default function CameraControls({
  onCapture,
  captureDisabled,
  onStartRetake,
  onCancelRetake,
  isRetaking,
  hasSelection,
  onFinish,
}: Props) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={onCapture}
        disabled={!!captureDisabled}
        className={`px-4 py-2 rounded ${captureDisabled ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
      >
        {isRetaking ? 'Retake & Save' : 'Ambil Foto'}
      </button>

      {hasSelection && !isRetaking && (
        <button onClick={onStartRetake} className="px-3 py-2 rounded border">
          Retake
        </button>
      )}

      {isRetaking && (
        <button onClick={onCancelRetake} className="px-3 py-2 rounded border">
          Batal
        </button>
      )}

      <div className="ml-auto">
        <button onClick={onFinish} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
          Selesai
        </button>
      </div>
    </div>
  )
}
