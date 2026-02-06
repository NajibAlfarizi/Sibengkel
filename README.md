# Sistem Informasi Bengkel

Sistem informasi manajemen bengkel yang lengkap dengan fitur transaksi, master data, laporan, dan tracking hutang piutang.

## Fitur Utama

### 1. Master Data
- **Kategori Produk**: Manajemen kategori untuk mengorganisir produk
- **Produk**: Manajemen produk dengan tracking stok otomatis
- **Customer**: Manajemen customer (Umum & Perusahaan)
- **Supplier**: Manajemen data supplier

### 2. Transaksi
- **Penjualan**: 
  - Transaksi cash & credit
  - Multi-item per transaksi
  - Diskon & pajak
  - Status pembayaran (Lunas, Belum Lunas, Cicilan)
  - Auto update stok
- **Pembelian**: 
  - Pembelian dari supplier
  - Auto update stok
- **Pengeluaran**: 
  - Tracking pengeluaran operasional

### 3. Hutang Piutang
- **Piutang**: Tracking piutang customer
- **Hutang**: Tracking hutang ke supplier
- **Pembayaran Cicilan**: Sistem pembayaran bertahap

### 4. Laporan
- **Laporan Penjualan**: 
  - Summary penjualan
  - Penjualan per kategori
  - Produk terlaris
- **Laporan Pembelian**: Analisis pembelian dari supplier
- **Laporan Pengeluaran**: Tracking biaya operasional
- **Laporan Stok**: Monitoring stok & stok menipis
- **Laporan Hutang Piutang**: Status keuangan
- **Laporan Laba Rugi**: Analisis profitabilitas

### 5. Dashboard
- Ringkasan statistik bisnis
- Transaksi terbaru
- Alert stok menipis

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite dengan Prisma ORM
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
npm run db:push
```

3. Seed database dengan data contoh:
```bash
npm run db:seed
```

4. Jalankan development server:
```bash
npm run dev
```

5. Buka browser: [http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build production
- `npm run start` - Jalankan production server
- `npm run db:push` - Push schema ke database
- `npm run db:studio` - Buka Prisma Studio
- `npm run db:seed` - Seed database dengan data contoh

## Struktur Database

### Tabel Utama:
- `Category` - Kategori produk
- `Product` - Data produk & stok
- `Customer` - Data customer
- `Supplier` - Data supplier
- `Transaction` - Transaksi penjualan/pembelian
- `TransactionItem` - Detail item transaksi
- `Payment` - Riwayat pembayaran cicilan
- `Receivable` - Piutang
- `Payable` - Hutang
- `Expense` - Pengeluaran

## Panduan Penggunaan

### 1. Setup Awal
1. Buat kategori produk di menu **Kategori**
2. Tambahkan produk di menu **Produk**
3. Tambahkan customer di menu **Customer**
4. Tambahkan supplier di menu **Supplier**

### 2. Transaksi Penjualan
1. Klik menu **Transaksi > Penjualan**
2. Klik tombol **Transaksi Baru**
3. Pilih customer (opsional)
4. Tambahkan produk dengan klik produk dan qty
5. Atur pembayaran (Cash/Credit, Status)
6. Simpan transaksi

### 3. Monitoring
- Cek **Dashboard** untuk overview bisnis
- Lihat **Laporan** untuk analisis mendalam
- Monitor **Hutang Piutang** untuk cash flow

## Fitur Unggulan

✅ **Auto Stock Management** - Stok otomatis update saat transaksi  
✅ **Multi Payment Status** - Lunas, Belum Lunas, Cicilan  
✅ **Customer Type** - Support customer umum & perusahaan  
✅ **Comprehensive Reports** - 6 jenis laporan lengkap  
✅ **Transaction History** - Track semua transaksi  
✅ **Low Stock Alert** - Notifikasi stok menipis  
✅ **Debt Management** - Manajemen hutang piutang  

## Development

Database SQLite tersimpan di `prisma/dev.db`. Gunakan Prisma Studio untuk melihat data:

```bash
npm run db:studio
```

## License

MIT License
