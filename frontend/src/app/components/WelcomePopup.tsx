'use client'

interface WelcomePopupProps {
  isVisible: boolean
  onClose: () => void
}

export default function WelcomePopup({ isVisible, onClose }: WelcomePopupProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 mx-8 max-w-md w-full shadow-2xl">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Satu sesi itu berdurasi 10 menit yaa..
          </h2>
          <p className="text-gray-600">
            Kamu bisa lihat waktu yang tersisa di pojok kanan atas layar
          </p>
          <p className="text-gray-600 font-medium">
            Okeyy enjoy your time!!
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
              text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200
              text-lg transform hover:scale-105 active:scale-95 mt-6"
          >
            Oke sipp!
          </button>
        </div>
      </div>
    </div>
  )
}
