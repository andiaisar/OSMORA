# Alur Pembayaran OSMORA Photo Booth

## Overview
Implementasi alur pembayaran baru dengan langkah tambahan: Detail → Konfirmasi Pembayaran → Midtrans SNAP.

## Alur Pembayaran

### 1. Halaman Detail (`/detail`)
- **Fungsi**: Pilih frame dan tentukan jumlah cetak
- **Navigasi**: Button "Selanjutnya" → `/confirm?frame={frameId}&quantity={quantity}`
- **Data Frame**: 6 pilihan frame dengan layout berbeda (4 Photos, 6 Photos)
- **Harga**: Rp 25.000 per frame

### 2. Halaman Konfirmasi (`/confirm`) ✅ BARU
- **Fungsi**: Konfirmasi pesanan dan aplikasi voucher
- **URL Parameters**:
  - `frame`: ID frame yang dipilih (1-6)
  - `quantity`: Jumlah cetak
- **Fitur**:
  - Preview frame yang dipilih dengan layout visual
  - Rincian transaksi (subtotal, diskon, total)
  - Sistem voucher dengan kode diskon
  - Button pembayaran Midtrans

#### Sistem Voucher
- **DISKON10**: Diskon 10%
- **SAVE20**: Diskon 20%
- **PROMO15**: Diskon 15%

### 3. Pembayaran Midtrans
- **Trigger**: Button "Lanjut Pembayaran" di halaman konfirmasi
- **API**: `/api/tokenizer` (mendukung data lama dan baru)
- **Callback Success/Pending**: Redirect ke `/camera`

## File Structure

```
src/app/
├── detail/
│   └── page.jsx                 # Pilih frame & quantity
├── confirm/                     # ✅ BARU
│   ├── page.jsx                # Konfirmasi pembayaran
│   └── layout.jsx              # Midtrans SNAP script
├── camera/
│   └── page.tsx                # Photo booth
└── api/
    └── tokenizer/
        └── route.js            # Updated: support new data structure
```

## Data Flow

### Detail → Confirm
```javascript
// URL: /confirm?frame=1&quantity=2
const params = {
  frame: selectedFrame,     // 1-6
  quantity: printQuantity   // >= 1
}
```

### Confirm → API Tokenizer
```javascript
const requestData = {
  frameId: frame.id,           // 1-6
  quantity: quantity,          // jumlah cetak
  amount: finalAmount,         // total setelah diskon
  productName: frame.title,    // "4 Photos", "6 Photos Alt", etc
  price: frame.price,          // 25000
  voucherCode: voucherCode     // optional
}
```

### API Response
```javascript
{
  token: "midtrans-snap-token",
  order_id: "OSMORA-{timestamp}-{frameId}"
}
```

## Key Features

### ✅ Halaman Konfirmasi
- Responsive design dengan gradient background
- Preview frame dengan layout visual yang akurat
- Sistem voucher dengan UI interaktif
- Rincian pembayaran yang jelas
- Error handling untuk pembayaran

### ✅ API Tokenizer (Updated)
- Backward compatibility dengan struktur data lama
- Support untuk data voucher
- Generate unique order ID
- Enhanced error handling
- Custom fields untuk metadata

### ✅ Integration
- Seamless navigation dari detail ke konfirmasi
- Midtrans SNAP integration yang robust
- State management yang proper

## Testing

### Test Cases
1. **Normal Flow**: Detail → Confirm → Payment → Camera
2. **With Voucher**: Apply valid voucher codes
3. **Invalid Voucher**: Test error handling
4. **Payment Success**: Verify redirect to camera
5. **Payment Error**: Verify error messages
6. **Browser Back**: Ensure proper navigation

### Test Data
- Frame IDs: 1, 2, 3, 4, 5, 6
- Quantities: 1, 2, 3, 5, 10
- Voucher Codes: DISKON10, SAVE20, PROMO15, INVALID

## Environment Variables
```
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-E-Q5p49F6YexvEAj
MIDTRANS_SERVER_KEY=Mid-server-7lOiISllLV5QtFcRhBY_DVkg
```

## Future Enhancements
- Dynamic voucher validation via API
- Real-time inventory checking
- Multiple payment methods
- Email receipt functionality
- Transaction history