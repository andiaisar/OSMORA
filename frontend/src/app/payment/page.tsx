'use client'

import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackgroundPattern from '../components/BackgroundPattern';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/camera');
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <div className="font-sans relative w-screen h-screen overflow-hidden bg-background">
        <BackgroundPattern />

        {/* Decorative Stars */}
        <div className="absolute inset-0 z-5">
          {/* Top right star */}
          <div className="absolute top-16 right-24">
            <Image
              src="/icon/stars.png"
              alt="star"
              width={60}
              height={60}
              className="opacity-80"
            />
          </div>

          {/* Top left star */}
          <div className="absolute top-32 left-32">
            <Image
              src="/icon/stars.png"
              alt="star"
              width={40}
              height={40}
              className="opacity-60"
            />
          </div>

          {/* Bottom left star */}
          <div className="absolute bottom-24 left-20">
            <Image
              src="/icon/stars.png"
              alt="star"
              width={50}
              height={50}
              className="opacity-70"
            />
          </div>

          {/* Bottom right star */}
          <div className="absolute bottom-32 right-16">
            <Image
              src="/icon/stars.png"
              alt="star"
              width={45}
              height={45}
              className="opacity-65"
            />
          </div>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">

          {/* Success Icon with Background Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-8">
              {/* Glassmorphism background */}
              <div className="absolute inset-0 -m-8 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl"></div>
              <div className="relative z-10 p-8 flex flex-col items-center">
                <Image
                  src="/icon/succes.png"
                  alt="success"
                  width={120}
                  height={120}
                  className="filter drop-shadow-lg mb-6"
                />
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
                    Pembayaran Anda
                  </h1>
                  <h2 className="text-4xl font-bold text-gray-800 tracking-wide">
                    Telah Berhasil
                  </h2>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}