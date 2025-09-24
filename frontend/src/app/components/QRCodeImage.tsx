"use client"

import React, { useEffect, useState } from "react"
import QRCode from "qrcode"

type Props = {
  value: string
  size?: number
  className?: string
}

export default function QRCodeImage({ value, size = 300, className }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    QRCode.toDataURL(value, { width: size })
      .then((url) => {
        if (mounted) setDataUrl(url)
      })
      .catch((err) => {
        if (mounted) setError(String(err))
      })

    return () => {
      mounted = false
    }
  }, [value, size])

  if (error) return <div className="text-red-600">Error membuat QR</div>
  if (!dataUrl) return <div className="text-gray-500">Memuat QR...</div>

  return <img src={dataUrl} alt="qr" width={size} height={size} className={className} />
}
