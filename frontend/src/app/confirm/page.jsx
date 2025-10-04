'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import BackgroundPattern from '../components/BackgroundPattern';

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State untuk data transaksi
  const [frame, setFrame] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mengambil data dari query parameters
  useEffect(() => {
    const frameId = searchParams.get('frame');
    const qty = parseInt(searchParams.get('quantity')) || 1;
    
    if (!frameId) {
      router.push('/detail');
      return;
    }

    // Data frame yang sesuai dengan halaman detail
    const frameLayouts = [
      { id: 1, layout: [1, 2, 3, 4], title: "4 Photos", price: 25000 },
      { id: 2, layout: [1, 3, 2, 4], title: "4 Photos Alt", price: 25000 },
      { id: 3, layout: [1, 1, 2, 2], title: "4 Photos Pair", price: 25000 },
      { id: 4, layout: [1, 2, 3, 4, 5, 6], title: "6 Photos", price: 25000 },
      { id: 5, layout: [1, 2, 3, 4, 5, 6], title: "6 Photos Alt", price: 25000 },
      { id: 6, layout: [1, 4, 2, 5, 3, 6], title: "6 Photos Mix", price: 25000 },
    ];

    const selectedFrame = frameLayouts.find(frame => frame.id === parseInt(frameId));
    
    if (!selectedFrame) {
      router.push('/detail');
      return;
    }

    setFrame(selectedFrame);
    setQuantity(qty);
    setTotalAmount(selectedFrame.price * qty);
  }, [searchParams, router]);

  // Fungsi untuk merender grid frame
  const renderFrameGrid = (layout) => {
    if (layout.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          {layout.map((num, idx) => (
            <div key={idx} className="bg-purple-600 text-white flex items-center justify-center text-xs font-bold rounded-sm">
              {num}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 grid-rows-3 gap-1 w-full h-full">
          {layout.map((num, idx) => (
            <div key={idx} className="bg-purple-600 text-white flex items-center justify-center text-xs font-bold rounded-sm">
              {num}
            </div>
          ))}
        </div>
      );
    }
  };

  // Fungsi untuk menerapkan voucher
  const applyVoucher = (code) => {
    const voucherDiscounts = {
      'DISKON10': 0.1,
      'SAVE20': 0.2,
      'PROMO15': 0.15
    };

    const discountRate = voucherDiscounts[code.toUpperCase()] || 0;
    
    if (discountRate > 0) {
      setDiscount(discountRate);
      setVoucherCode(code);
      setShowVoucherInput(false);
      alert(`Voucher berhasil diterapkan! Diskon ${discountRate * 100}%`);
    } else {
      alert('Kode voucher tidak valid');
    }
  };

  // Fungsi checkout
  const checkout = async () => {
    if (!frame) return;

    setIsLoading(true);
    setError(null);

    try {
      const finalAmount = totalAmount - (totalAmount * discount);
      
      // Panggil API tokenizer untuk mendapatkan token Midtrans
      const response = await fetch('/api/tokenizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameId: frame.id,
          quantity: quantity,
          amount: finalAmount,
          productName: frame.title,
          price: frame.price,
          voucherCode: voucherCode
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat token pembayaran');
      }

      const { token } = await response.json();

      // Pastikan Midtrans SNAP sudah dimuat
      if (typeof window.snap === 'undefined') {
        throw new Error('Midtrans SNAP tidak tersedia');
      }

      // Tampilkan modal pembayaran Midtrans
      window.snap.pay(token, {
        onSuccess: function(result) {
          console.log('Payment success:', result);
          router.push('/camera');
        },
        onPending: function(result) {
          console.log('Payment pending:', result);
          router.push('/camera');
        },
        onError: function(result) {
          console.log('Payment error:', result);
          setError('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function() {
          console.log('Payment popup closed');
        }
      });

    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (!frame) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-background">
        <BackgroundPattern />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  const finalAmount = totalAmount - (totalAmount * discount);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      <BackgroundPattern />
      
      {/* Header dengan style seperti halaman detail */}
      <div className="relative z-10 flex justify-center items-center px-8 py-6">
        <button 
          onClick={() => router.back()}
          className="absolute left-8 flex items-center space-x-2 p-3 hover:bg-white/50 rounded-xl transition-all duration-200 group"
        >
          <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">Kembali</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-800">KONFIRMASI PEMBAYARAN</h1>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Logo dan Rincian dalam Layout Horizontal */}
        <div className="flex flex-col lg:flex-row gap-10 mb-10">
          {/* Logo OSMORA - Kiri */}
          <div className="lg:w-2/5 flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 inline-block shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/30">
                <Image
                  src="/image/logofull.png"
                  alt="OSMORA Photo Booth"
                  width={280}
                  height={120}
                  className="max-w-full h-auto drop-shadow-md"
                  priority
                />
              </div>
              <p className="text-base text-gray-600 mt-4 font-medium">Konfirmasi Pesanan Anda</p>
            </div>
          </div>

          {/* Detail Transaksi - Kanan */}
          <div className="lg:w-3/5">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Rincian Pesanan</h2>
              
              <div className="space-y-5">
                {/* Frame Info */}
                <div className="flex items-center space-x-4 bg-gray-50/80 p-4 rounded-xl">
                  <div className="w-20 h-20 bg-black rounded-xl p-2 flex items-center justify-center shadow-md">
                    <div className="w-full h-full">
                      {renderFrameGrid(frame.layout)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg">{frame.title}</p>
                    <p className="text-gray-600">Rp {frame.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Jumlah Cetak</span>
                  <span className="font-semibold text-lg">{quantity} copies</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-semibold text-lg">Rp {totalAmount.toLocaleString('id-ID')}</span>
                </div>

                {/* Discount (jika ada) */}
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600 py-2">
                    <span className="font-medium">Diskon ({voucherCode})</span>
                    <span className="font-semibold text-lg">-Rp {(totalAmount * discount).toLocaleString('id-ID')}</span>
                  </div>
                )}

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total Bayar</span>
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {finalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Voucher Diskon</h3>
              <button
                onClick={() => setShowVoucherInput(!showVoucherInput)}
                className="px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {discount > 0 ? 'Ganti Voucher' : 'Gunakan Voucher'}
              </button>
            </div>

            {showVoucherInput && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Masukkan kode voucher"
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      applyVoucher(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      const input = e.target.parentElement.previousElementSibling;
                      applyVoucher(input.value);
                      input.value = '';
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                  >
                    Terapkan
                  </button>
                  <button
                    onClick={() => setShowVoucherInput(false)}
                    className="flex-1 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors font-semibold shadow-lg"
                  >
                    Batal
                  </button>
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-xl">
                  <p>💡 Coba: DISKON10, SAVE20, atau PROMO15</p>
                </div>
              </div>
            )}

            {discount > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-semibold text-lg">
                  ✓ Voucher {voucherCode} berhasil diterapkan!
                </p>
                <p className="text-green-600">
                  Hemat Rp {(totalAmount * discount).toLocaleString('id-ID')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <p className="text-red-700 font-medium text-lg">{error}</p>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="max-w-3xl mx-auto">
          <button
            onClick={checkout}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Lanjut Pembayaran</span>
              </>
            )}
          </button>

          {/* Payment Methods Info */}
          <div className="mt-6 text-center text-gray-500">
            <p className="font-medium">🔒 Pembayaran aman dengan Midtrans</p>
            <p className="text-sm">Mendukung berbagai metode pembayaran</p>
          </div>
        </div>
      </div>
    </div>
  );
}