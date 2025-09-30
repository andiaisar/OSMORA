"use client"

import React, { Suspense } from "react"
import QRCodeImage from "../components/QRCodeImage"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import BackgroundPattern from "../components/BackgroundPattern"
import Image from "next/image"
import { Home, Copy } from "lucide-react"
import { useSearchParams } from 'next/navigation'

function ThanksContent() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code') || Math.random().toString(36).slice(2, 10)
  const targetUrl = `https://example.com/photos/${code}`
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <BackgroundPattern />
      
      {/* Success Stars Animation */}
      <div className="absolute inset-0 z-5">
        <Image
          src="/icon/stars.png"
          alt="Success stars"
          width={150}
          height={150}
          className="absolute top-16 left-16 animate-pulse opacity-50"
        />
        <Image
          src="/icon/stars.png"
          alt="Success stars"
          width={120}
          height={120}
          className="absolute top-20 right-20 animate-pulse opacity-30 animation-delay-1000"
        />
        <Image
          src="/icon/camera.png"
          alt="Camera decoration"
          width={80}
          height={80}
          className="absolute bottom-16 right-16 opacity-25 animate-float"
        />
        <Image
          src="/icon/film1.png"
          alt="Film decoration"
          width={60}
          height={60}
          className="absolute top-1/3 left-12 opacity-20 animate-float animation-delay-1000"
        />
        <Image
          src="/icon/film2.png"
          alt="Film decoration"
          width={70}
          height={70}
          className="absolute bottom-1/3 right-12 opacity-20 animate-float animation-delay-2000"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full px-8">
        
        {/* Single Row Layout */}
        <div className="flex gap-12 items-center justify-center max-w-5xl w-full">
          
          {/* Left Side - Success Message */}
          <div className="flex-1 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Image
                  src="/icon/succes.png"
                  alt="Success"
                  width={100}
                  height={100}
                  className="animate-bounce"
                />
                <div className="absolute inset-0 w-25 h-25 rounded-full bg-green-500/20 animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4 text-shadow-md tracking-wide">
              TERIMA KASIH!
            </h1>
            <p className="text-xl font-medium text-gray-600 text-shadow-md mb-8">
              Foto Anda telah berhasil diambil
            </p>
            
            {/* Back Button */}
            <Button 
              className="py-6 px-12 text-xl font-semibold bg-primary rounded-2xl shadow-lg transform transition-all duration-200"
              asChild
            >
              <Link href="/">
                <Home className="w-6 h-6 mr-3" />
                Kembali ke Beranda
              </Link>
            </Button>
          </div>
          
          {/* Right Side - QR Code */}
          <div className="flex-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 transform transition-all duration-300">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">
                  Scan QR Code
                </h3>
                
                <div className="bg-background p-6 rounded-2xl mb-6 relative overflow-hidden justify-center flex">
                  <div className="relative z-10">
                    <QRCodeImage value={targetUrl} size={250} />
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 text-lg">
                  Scan untuk mengakses foto Anda
                </p>
                
                <div className="bg-gray-100 px-4 py-3 rounded-lg relative">
                  <div className="flex items-center justify-center">
                    <p className="text-3xl font-bold text-primary tracking-wider">{code}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-lg text-gray-500 font-medium tracking-wide">
          OSMORA PHOTOBOX - EVERY MOMENT, BEAUTIFULLY CAPTURED
        </p>
      </div>
    </div>
  )
}

export default function ThanksPage() {
  return (
    <Suspense fallback={
      <div className="relative w-screen h-screen overflow-hidden bg-background">
        <BackgroundPattern />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ThanksContent />
    </Suspense>
  )
}
