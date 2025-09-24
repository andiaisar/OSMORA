"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BackgroundPattern from "./components/BackgroundPattern";

export default function Home() {
  const router = useRouter();

  const toDetail = () => {
    router.push("/detail");
  }

  return (
    <>
      <div className="font-sans relative w-screen h-screen overflow-hidden bg-background">
        <BackgroundPattern/>
        
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
          
          <Image
            src="/icon/hand.svg"
            alt="Hand icon"
            width={500}
            height={500}
            className="absolute bottom-0 -z-1"
          />
          
          <div className="flex flex-col items-center justify-center gap-4 mb-12">
            <span className="text-6xl font-thin text-shadow-md tracking-wider">OSMORA</span>
            <span className="text-9xl font-bold text-shadow-cyan-300 text-shadow-md tracking-wide">PHOTOBOX</span>
            <span className="text-2xl font-medium text-shadow-lg tracking-wide mt-2">EVERY MOMENT, BEAUTIFULLY CAPTURED</span>
          </div>
          
          <Button 
            size="lg" 
            className="z-10 rounded-full text-2xl px-16 py-8 shadow-cyan-300 font-semibold tracking-wide"
            onClick={toDetail}
          >
            START
          </Button>
        </div>
      </div>
    </>
  );
}
