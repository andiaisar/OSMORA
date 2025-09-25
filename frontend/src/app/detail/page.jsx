"use client";

import { frame } from "../libs/produk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import BackgroundPattern from "../components/BackgroundPattern";
import { Minus, Plus, Clock } from "lucide-react";
import { on } from "events";

export default function Page() {
  const router = useRouter();
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [printQuantity, setPrintQuantity] = useState(0);

  const goBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (selectedFrame !== null && printQuantity > 0) {
      checkout();
      // router.push("/camera")
    }
  };

  const checkout = async () => {
    const totalPrice = frame.price * printQuantity;
    // const booth = JSON.parse(localStorage.getItem("booth"));
    const data = {
      id: frame.id,
      productName: frame.name,
      amount: printQuantity, // Mengirim jumlah cetak
      price: frame.price,    // Mengirim harga per item
    }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API;
  const response = await fetch("/api/tokenizer",  {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
          },
          body: JSON.stringify({
              order_id: data.id,
              totalAmount: data.price,
              username: data.username
          }),
      });

    const result = await response.json();
    window.snap.pay(result.token, {
      onSuccess: (result) => {
        console.log("Payment successful:", result);
      },
      onPending: (result) => {
        console.log("Payment pending:", result);
      },
      onError: (result) => {
        console.error("Payment error:", result);
      },
    });
  };

  const frameLayouts = [
    { id: 1, layout: [1, 2, 3, 4], title: "4 Photos" },
    { id: 2, layout: [1, 3, 2, 4], title: "4 Photos Alt" },
    { id: 3, layout: [1, 1, 2, 2], title: "4 Photos Pair" },
    { id: 4, layout: [1, 2, 3, 4, 5, 6], title: "6 Photos" },
    { id: 5, layout: [1, 2, 3, 4, 5, 6], title: "6 Photos Alt" },
    { id: 6, layout: [1, 4, 2, 5, 3, 6], title: "6 Photos Mix" },
  ];

  const renderFrameGrid = (layout) => {
    if (layout.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          {layout.map((num, idx) => (
            <div key={idx} className="bg-purple-600 text-white flex items-center justify-center text-lg font-bold rounded-sm">
              {num}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 grid-rows-3 gap-1 w-full h-full">
          {layout.map((num, idx) => (
            <div key={idx} className="bg-purple-600 text-white flex items-center justify-center text-lg font-bold rounded-sm">
              {num}
            </div>
          ))}
        </div>
      );
    }
  };

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js"
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    const script = document.createElement("script");
    script.src = snapScript
    script.setAttribute("data-client-key", clientKey || "");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <BackgroundPattern />

      {/* Header with title and timer */}
      <div className="relative z-10 flex justify-center items-center px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800">PILIH FRAME KAMU</h1>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex h-[calc(100vh-120px)] px-8 gap-8">

        {/* Left side - Frame selection */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-6 h-full">
            {frameLayouts.map((frameData) => (
              <Card
                key={frameData.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 bg-white/90 backdrop-blur-sm h-full ${selectedFrame === frameData.id ? 'ring-4 ring-purple-500 shadow-lg' : ''
                  }`}
                onClick={() => setSelectedFrame(frameData.id)}
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex-1 bg-black rounded-lg p-2 mb-3">
                    {renderFrameGrid(frameData.layout)}
                  </div>
                  <p className="text-center text-sm font-medium text-gray-700">{frameData.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right side - Quantity and controls */}
        <div className="w-80 flex flex-col">
          <Card className="bg-white/90 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-center mb-6">Jumlah Cetak</h3>

              <div className="flex items-center justify-center gap-6 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12 border-2"
                  onClick={() => setPrintQuantity(Math.max(0, printQuantity - 1))}
                  disabled={printQuantity <= 0}
                >
                  <Minus size={20} />
                </Button>

                <div className="text-4xl font-bold text-center min-w-[80px]">
                  {printQuantity}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-12 h-12 border-2"
                  onClick={() => setPrintQuantity(printQuantity + 1)}
                >
                  <Plus size={20} />
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 mb-6">
                setiap menambah 1 copies akan mendapatkan 2 strip photo
              </p>
            </CardContent>
          </Card>

          <Button
            className="w-full bg-primary hover:bg-purple-700 text-white py-8 text-lg font-semibold rounded-2xl"
            onClick={handleNext}
            disabled={selectedFrame === null || printQuantity === 0}
          >
            Selanjutnya
          </Button>
        </div>
      </div>
    </div>
  );
}
