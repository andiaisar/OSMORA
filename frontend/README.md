# Osmora App - Panduan Instalasi dan Pengembangan

## Prasyarat Sistem
Sebelum memulai, pastikan sistem Anda memiliki:
- **Node.js** (versi 16 atau lebih baru)
- **npm** (biasanya sudah terinstall bersama Node.js)
- **Git** untuk melakukan clone repository
- **ngrok** untuk membuat tunnel HTTP (akan diinstall pada langkah 3)

## Langkah-langkah Instalasi

### 1. Clone Repository
Clone repository Osmora App ke komputer lokal Anda:
```bash
git clone git@github.com:YusraEr/osmora-desktop-app.git
cd osmora-app
```

### 2. Install Dependencies
Install semua package yang diperlukan menggunakan npm:
```bash
npm install
```
Perintah ini akan membaca file `package.json` dan menginstall semua dependencies yang diperlukan untuk menjalankan aplikasi.

### 3. Setup ngrok
Install ngrok secara global (jika belum terinstall):
```bash
npm install -g ngrok
```

Jalankan ngrok untuk membuat tunnel ke port 3000:
```bash
ngrok http 3000
```
Ngrok akan memberikan URL publik yang dapat digunakan untuk mengakses aplikasi dari internet.

### 4. Menjalankan Aplikasi
Jalankan aplikasi dalam mode development:
```bash
npm run dev
```

## Akses Aplikasi
- **Lokal**: http://localhost:3000
- **Publik**: Gunakan URL yang diberikan oleh ngrok

## Troubleshooting
- Pastikan port 3000 tidak digunakan oleh aplikasi lain
- Jika ngrok error, coba restart dan jalankan ulang
- Untuk masalah dependencies, hapus folder `node_modules` dan jalankan `npm install` kembali

## Catatan
- Aplikasi akan otomatis reload saat ada perubahan kode
- URL ngrok akan berubah setiap kali restart (kecuali menggunakan akun berbayar)