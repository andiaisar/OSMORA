// import Midtrans from "midtrans-client";
// import { NextResponse } from "next/server";

// let snap = new Midtrans.Snap({
//     isProduction: false,
//     serverKey: process.env.NEXT_PUBLIC_SECRET,
//     clientKey: process.env.NEXT_PUBLIC_CLIENT,
// });

// export async function POST(request) {
//     const { id, productName, amount, price } = await request.json(); 
//     let parameter = {
//         item_details: 
//             {
//                 name: productName,
//                 price: price,
//                 quantity: amount,
//             },
//         transaction_details: {
//             order_id: id,
//             gross_amount: price * amount,
//         }, 
//     }

//     const token = await snap.createTransactionToken(parameter);

//     return NextResponse.json({token})
// }


// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { createPaymentTransaction } from "@/lib/api";
// import { ChevronLeft } from "lucide-react";
// import produk from "../libs/produk";

// export default function DetailPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const [frame, setFrame] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [totalPrice, setTotalPrice] = useState(0);

//     useEffect(() => {
//         const id = searchParams.get("id");
//         if (id) {
//             const selectedFrame = produk.find(p => p.id === parseInt(id));
//             if (selectedFrame) {
//                 setFrame(selectedFrame);
//                 setTotalPrice(selectedFrame.price); // Set initial price
//             }
//         }
//         setLoading(false);
//     }, [searchParams]);

//     useEffect(() => {
//         // Load Midtrans Snap script
//         const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
//         const script = document.createElement("script");
//         script.src = midtransUrl;
//         script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_CLIENT_KEY);
//         script.onload = () => {
//             console.log("Midtrans Snap script loaded.");
//         };
//         document.body.appendChild(script);

//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

//     const handleBackClick = () => {
//         router.back();
//     };

//     const checkout = async () => {
//         if (!frame) return;

//         const data = {
//             order_id: `transaction-${Date.now()}`,
//             totalAmount: totalPrice,
//             username: "testuser", // Ganti dengan username yang sebenarnya
//         };

//         try {
//             const result = await createPaymentTransaction(data);
//             const snapToken = result.snap_token;

//             if (window.snap) {
//                 window.snap.pay(snapToken, {
//                     onSuccess: (result) => {
//                         console.log("Payment successful:", result);
//                         router.push(`/thanks?order_id=${data.order_id}`);
//                     },
//                     onPending: (result) => {
//                         console.log("Payment pending:", result);
//                     },
//                     onError: (result) => {
//                         console.error("Payment error:", result);
//                     },
//                 });
//             } else {
//                 console.error("Midtrans Snap is not loaded.");
//                 alert("Payment gateway is not ready. Please try again later.");
//             }
//         } catch (err) {
//             console.error("Failed to create payment transaction:", err);
//             alert("Failed to initiate payment. " + err.message);
//         }
//     };

//     if (loading) {
//         return <div className="text-center mt-10">Loading...</div>;
//     }

//     if (!frame) {
//         return <div className="text-center mt-10">Frame tidak ditemukan!</div>;
//     }

//     return (
//         <div className="flex flex-col md:flex-row min-h-screen items-center justify-center p-4">
//             <div className="flex-1 w-full md:w-1/2 flex justify-center items-center p-4">
//                 <div className="relative w-full max-w-xl aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
//                     <Image
//                         src={frame.image}
//                         alt={frame.name}
//                         layout="fill"
//                         objectFit="cover"
//                         className="rounded-xl"
//                     />
//                 </div>
//             </div>
//             <div className="flex-1 w-full md:w-1/2 flex flex-col items-start p-8 space-y-4">
//                 <Button variant="ghost" className="self-start mb-4" onClick={handleBackClick}>
//                     <ChevronLeft className="h-4 w-4 mr-2" /> Kembali
//                 </Button>
//                 <h1 className="text-4xl font-bold">{frame.name}</h1>
//                 <p className="text-2xl font-semibold">Rp. {totalPrice.toLocaleString("id-ID")}</p>
//                 <div className="flex items-center space-x-2">
//                     <input
//                         type="number"
//                         min="1"
//                         value={1}
//                         className="w-16 p-2 border rounded text-center"
//                         readOnly
//                     />
//                     <span className="text-lg">pcs</span>
//                 </div>
//                 <Button onClick={checkout} className="w-full mt-4 bg-green-500 text-white hover:bg-green-600">
//                     Beli Sekarang
//                 </Button>
//             </div>
//         </div>
//     );
// }

import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";
// import { frame } from "@/app/libs/produk"; // ✅ Perbaikan ada di sini

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SECRET,
    clientKey: process.env.MIDTRANS_CLIENT,
});

export async function POST(request) {
    const { id, productName, amount, price } = await request.json(); 
    let parameter = {
        item_details: 
            {
                name: productName,
                price: price,
                quantity: amount,
            },
        transaction_details: {
            order_id: id,
            gross_amount: price * amount,
        }, 
    }

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({token})
}