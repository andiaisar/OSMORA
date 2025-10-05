# Admin Interface Documentation

## Overview
Antarmuka admin telah berhasil dibangun dengan struktur lengkap sesuai dengan desain yang diminta. Berikut adalah fitur-fitur yang telah diimplementasikan:

## Struktur File
```
src/app/admin/
├── layout.tsx          # Layout utama dengan sidebar navigasi
├── page.tsx           # Dashboard utama
├── analytics/
│   └── page.tsx       # Halaman Analytics (placeholder)
├── booths/
│   └── page.tsx       # Halaman Manajemen Booth
├── frames/
│   └── page.tsx       # Halaman Frame Management (placeholder)
└── vouchers/
    └── page.tsx       # Halaman Voucher Management (placeholder)
```

## Fitur yang Telah Diimplementasikan

### 1. Admin Layout (`/admin/layout.tsx`)
- **Sidebar Navigasi**: Navigasi tetap di sebelah kiri dengan menu:
  - Dashboard
  - Analytics  
  - Projects (Booth Management)
  - Frames
  - Voucher
  - Log Out
- **Otentikasi**: Memeriksa `localStorage.getItem('authToken')` dan redirect ke `/login` jika tidak ada token
- **Responsive Design**: Sidebar dapat collapse di mobile dengan hamburger menu
- **Active State**: Menampilkan state aktif untuk menu yang sedang dipilih

### 2. Dashboard Utama (`/admin/page.tsx`)
- **Header Personalisasi**: "Hello, Osmin! 😊" dengan tanggal hari ini
- **Metrik Cards**: 4 kartu statistik utama:
  - Total Revenue: Rp 45,231,890 (+20.1%)
  - New Customers: 2,350 (+180.1%)
  - Active Booth: 12 (+19%)
  - Growth Rate: 573.1% (+201)
- **Filter Waktu**: Tombol filter interaktif (Last 3 months, Last 30 days, Last 7 days)
- **Chart Placeholder**: Area untuk grafik "Total Visitors" dengan styling yang menarik
- **Recent Activities**: Panel aktivitas terbaru dengan status indicators
- **Quick Statistics**: Statistik tambahan (Uptime, Customer Rating, Photos Taken)

### 3. Manajemen Booth (`/admin/booths/page.tsx`)
#### Data Management:
- **API Integration**: Menggunakan `getBooths`, `createBooth`, `updateBooth`, `deleteBooth` dari `src/lib/api.ts`
- **Authentication**: Mengirim token JWT melalui header Authorization
- **Data Types**: Menggunakan interface `Booth` dari `src/types/booth.ts`

#### UI Features:
- **Statistics Cards**: 4 kartu overview (Total Booths, Active Booths, Total Customers, This Month)
- **Search Functionality**: Search bar untuk mencari booth berdasarkan nama atau lokasi
- **Data Table**: Tabel responsif dengan kolom:
  - Booth Information (Name + ID)
  - Location
  - Date Added
  - Total Customers (dummy data)
  - Status (Active/Deactivated)
  - Actions (dropdown menu)

#### CRUD Operations:
- **Add Booth**: Modal form dengan fields:
  - Booth Name (required)
  - Location (required)
  - User ID (dummy, required)
  - Status (Active/Deactivated dropdown)
- **Edit Booth**: Mengisi form dengan data existing untuk edit
- **Delete Booth**: Konfirmasi sebelum menghapus
- **Dropdown Actions**: Per-row actions dengan Edit dan Delete

#### Advanced Features:
- **Loading States**: Spinner saat fetching data
- **Error Handling**: Try-catch untuk semua API calls
- **Responsive Design**: Mobile-friendly table dengan horizontal scroll
- **Modal Management**: Proper modal open/close dengan backdrop click
- **Form Validation**: Required fields dan proper form handling

## Teknologi yang Digunakan
- **Next.js 14**: App Router dengan TypeScript
- **Tailwind CSS**: Untuk styling responsif
- **Lucide React**: Icon library
- **API Integration**: Fetch calls ke FastAPI backend
- **TypeScript**: Type safety dengan interfaces

## Navigasi dan Routing
- `/admin` - Dashboard utama
- `/admin/booths` - Manajemen Booth
- `/admin/analytics` - Analytics (placeholder)
- `/admin/frames` - Frame Management (placeholder)
- `/admin/vouchers` - Voucher Management (placeholder)

## Authentication Flow
1. Layout memeriksa `localStorage.getItem('authToken')`
2. Jika tidak ada token → redirect ke `/login`
3. Jika ada token → simulasi otorisasi admin
4. Token dikirim ke semua API calls melalui Authorization header

## Data Flow
1. **Fetch Data**: `useEffect` memanggil API saat component mount
2. **Display Data**: Data ditampilkan dalam tabel dengan pagination support
3. **CRUD Operations**: Create, Read, Update, Delete melalui modal forms
4. **Real-time Updates**: Re-fetch data setelah operasi CRUD

## UI/UX Features
- **Consistent Design**: Menggunakan design system yang konsisten
- **Interactive Elements**: Hover states, focus states, dan transitions
- **Loading States**: Proper loading indicators
- **Empty States**: Pesan ketika tidak ada data
- **Error States**: Error handling dengan user feedback
- **Mobile Responsive**: Semua komponen responsive di berbagai ukuran layar

## Customization
Untuk customization lebih lanjut:
1. **Colors**: Ubah di Tailwind config atau langsung di class
2. **Icons**: Ganti icon dari Lucide React sesuai kebutuhan
3. **Layout**: Modifikasi sidebar width, positioning, dll di layout.tsx
4. **API Endpoints**: Sesuaikan dengan backend API yang sebenarnya
5. **Data Fields**: Tambah/kurangi field sesuai kebutuhan bisnis

## Testing
Untuk testing interface:
1. Pastikan backend FastAPI berjalan
2. Set environment variable `NEXT_PUBLIC_API` ke URL backend
3. Login untuk mendapatkan auth token
4. Akses `/admin` untuk mulai menggunakan interface

Interface admin ini siap untuk production dengan sedikit customization sesuai kebutuhan spesifik project.