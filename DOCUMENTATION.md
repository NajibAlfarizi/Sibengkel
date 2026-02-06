# 🚗 Sistem Informasi Bengkel

Sistem informasi manajemen bengkel yang **LENGKAP** dan **PROFESIONAL** dengan full-stack Next.js dan SQLite database.

## ✨ Fitur Utama

### 📊 Dashboard Interaktif
- Overview statistik bisnis real-time
- Monitoring penjualan harian & bulanan
- Alert stok menipis
- Tracking hutang piutang
- 5 transaksi terbaru

### 🗂️ Master Data Lengkap
1. **Kategori Produk**
   - CRUD kategori
   - Tracking jumlah produk per kategori
   
2. **Produk**
   - Manajemen produk dengan kode unik
   - Harga beli & harga jual
   - Tracking stok otomatis
   - Minimum stok alert
   - Kategori produk
   
3. **Customer**
   - Tipe: Umum atau Perusahaan
   - Data lengkap (nama, telepon, email, alamat)
   - History transaksi
   - Tracking piutang
   
4. **Supplier**
   - Data lengkap supplier
   - History pembelian
   - Tracking hutang

### 💰 Transaksi Komprehensif

#### Penjualan
- ✅ Multi-item per transaksi
- ✅ Customer opsional (untuk umum)
- ✅ Metode: Cash atau Credit
- ✅ Status: Lunas, Belum Lunas, Cicilan
- ✅ Diskon & Pajak
- ✅ Auto update stok (decrement)
- ✅ Auto create piutang jika belum lunas
- ✅ Generate invoice number otomatis

#### Pembelian
- ✅ Multi-item per transaksi
- ✅ Wajib pilih supplier
- ✅ Metode: Cash atau Credit
- ✅ Status: Lunas, Belum Lunas, Cicilan
- ✅ Auto update stok (increment)
- ✅ Auto create hutang jika belum lunas

#### Pengeluaran
- ✅ Tracking biaya operasional
- ✅ Kategori pengeluaran
- ✅ Keterangan detail

### 💳 Hutang Piutang
- **Piutang (Receivables)**
  - List piutang dari customer
  - Status pembayaran
  - Jumlah & sisa
  - Jatuh tempo
  
- **Hutang (Payables)**
  - List hutang ke supplier
  - Status pembayaran
  - Jumlah & sisa
  - Jatuh tempo

- **Sistem Cicilan**
  - Support pembayaran bertahap
  - Auto update status

### 📈 Laporan Lengkap

#### 1. Laporan Penjualan
- Total penjualan & transaksi
- Rata-rata per transaksi
- Penjualan per kategori
- Produk terlaris (Top 10)
- Filter by date range

#### 2. Laporan Pembelian
- Total pembelian & transaksi
- Pembelian per supplier
- Pembelian per kategori
- Filter by date range

#### 3. Laporan Pengeluaran
- Total & rata-rata pengeluaran
- Pengeluaran per kategori
- Persentase per kategori
- History detail
- Filter by date range

#### 4. Laporan Stok
- Total produk & nilai stok
- Produk stok menipis
- Produk stok habis
- Stok per kategori
- Nilai potensi keuntungan

#### 5. Laporan Hutang Piutang
- **Piutang:**
  - Total, dibayar, & sisa
  - Per customer
  - Jumlah transaksi
- **Hutang:**
  - Total, dibayar, & sisa
  - Per supplier
  - Jumlah transaksi

#### 6. Laporan Laba Rugi
- Pendapatan
- HPP (Harga Pokok Penjualan)
- Laba kotor & margin
- Biaya operasional
- Laba bersih & margin
- Filter by date range

## 🛠️ Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 14.2.15 | Framework React untuk SSR & API |
| **TypeScript** | 5.x | Type-safe development |
| **Prisma** | 5.20.0 | ORM untuk database |
| **SQLite** | - | Database relasional |
| **Tailwind CSS** | 3.4.x | Styling & UI |
| **React Icons** | 5.3.0 | Icon library |

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Langkah Instalasi

1. **Clone atau ekstrak project**
```bash
cd d:\Project\sistem-bengkel
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup database**
```bash
npm run db:push
```

4. **Seed data contoh** (opsional)
```bash
npm run db:seed
```

5. **Jalankan development server**
```bash
npm run dev
```

6. **Buka browser**
```
http://localhost:3000
```

## 📜 Available Scripts

```bash
npm run dev          # Development server
npm run build        # Build production
npm run start        # Production server
npm run lint         # ESLint check
npm run db:push      # Push schema ke database
npm run db:studio    # Buka Prisma Studio
npm run db:seed      # Seed database
```

## 📁 Struktur Project

```
sistem-bengkel/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts            # Seed data
│   └── dev.db             # SQLite database
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── api/           # API endpoints
│   │   │   ├── categories/
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── transactions/
│   │   │   ├── receivables/
│   │   │   ├── payables/
│   │   │   ├── expenses/
│   │   │   └── reports/
│   │   ├── dashboard/     # Dashboard page
│   │   ├── categories/    # Kategori pages
│   │   ├── products/      # Produk pages
│   │   ├── customers/     # Customer pages
│   │   ├── suppliers/     # Supplier pages
│   │   ├── transactions/  # Transaksi pages
│   │   │   ├── sales/
│   │   │   └── purchases/
│   │   ├── receivables/   # Piutang page
│   │   ├── payables/      # Hutang page
│   │   ├── expenses/      # Pengeluaran page
│   │   └── reports/       # Laporan pages
│   ├── components/        # Reusable components
│   │   ├── Sidebar.tsx
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Table.tsx
│   │   └── Modal.tsx
│   └── lib/              # Utilities
│       ├── prisma.ts     # Prisma client
│       └── utils.ts      # Helper functions
├── public/               # Static files
├── .env                  # Environment variables
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
└── tailwind.config.ts    # Tailwind config
```

## 📊 Database Schema

### Tabel Utama

1. **Category** - Kategori produk
2. **Product** - Data produk & stok
3. **Customer** - Data customer
4. **Supplier** - Data supplier
5. **Transaction** - Header transaksi
6. **TransactionItem** - Detail item transaksi
7. **Payment** - Riwayat pembayaran cicilan
8. **Receivable** - Piutang customer
9. **Payable** - Hutang supplier
10. **Expense** - Pengeluaran operasional

### Relasi
- Product → Category (Many-to-One)
- Transaction → Customer (Many-to-One)
- Transaction → Supplier (Many-to-One)
- TransactionItem → Transaction (Many-to-One)
- TransactionItem → Product (Many-to-One)
- Payment → Transaction (Many-to-One)
- Receivable → Customer (Many-to-One)
- Payable → Supplier (Many-to-One)

## 🎯 Panduan Penggunaan

### Setup Awal (First Time)
1. Login ke sistem
2. **Buat kategori** di menu Kategori
3. **Tambah produk** di menu Produk
4. **Tambah customer** di menu Customer
5. **Tambah supplier** di menu Supplier

### Transaksi Penjualan
1. Klik **Transaksi > Penjualan**
2. Klik **Transaksi Baru**
3. Pilih customer (opsional untuk umum)
4. Pilih produk & qty dari dropdown
5. Klik tombol **+** untuk menambah ke keranjang
6. Atur quantity di tabel jika perlu
7. Pilih metode pembayaran (Cash/Credit)
8. Pilih status pembayaran:
   - **Lunas**: Bayar penuh
   - **Belum Lunas**: Belum bayar sama sekali
   - **Cicilan**: Bayar sebagian (input jumlah bayar)
9. Tambah diskon/pajak jika ada
10. Klik **Simpan Transaksi**

### Transaksi Pembelian
1. Klik **Transaksi > Pembelian**
2. Klik **Transaksi Baru**
3. **Wajib pilih supplier**
4. Pilih produk & qty
5. Klik **+** untuk menambah
6. Atur pembayaran
7. Klik **Simpan Transaksi**

### Lihat Laporan
1. Klik menu **Laporan**
2. Pilih jenis laporan
3. Atur filter tanggal jika perlu
4. Analisis data & grafik

## 🌟 Fitur Unggulan

✅ **Real-time Stock Management** - Stok terupdate otomatis  
✅ **Multi-Payment Options** - Cash, Credit, Cicilan  
✅ **Dual Customer Types** - Umum & Perusahaan  
✅ **6 Types of Reports** - Analisis bisnis lengkap  
✅ **Transaction History** - Track semua aktivitas  
✅ **Low Stock Alerts** - Notifikasi stok menipis  
✅ **Debt Management** - Kelola hutang piutang  
✅ **Auto Invoice Generation** - Invoice number otomatis  
✅ **Responsive Design** - Mobile friendly  
✅ **Type-Safe** - TypeScript untuk code quality  

## 🔒 Security Features

- Input validation
- Type checking dengan TypeScript
- Database constraints
- Transaction atomicity (Prisma)

## 🎨 UI/UX Features

- Modern & clean interface
- Intuitive navigation
- Color-coded status
- Interactive dashboard
- Responsive tables
- Modal forms
- Loading states
- Empty states

## 📝 Data Seeding

Database sudah include sample data:
- 5 kategori produk
- 5 produk contoh
- 3 customer
- 2 supplier

## 🐛 Troubleshooting

### Port sudah digunakan
```bash
# Ganti port di package.json
"dev": "next dev -p 3001"
```

### Database error
```bash
# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
rm package-lock.json
npm install
```

## 📚 API Endpoints

### Master Data
- `GET/POST /api/categories` - List/Create kategori
- `GET/PUT/DELETE /api/categories/[id]` - Detail/Update/Delete kategori
- `GET/POST /api/products` - List/Create produk
- `GET/PUT/DELETE /api/products/[id]` - Detail/Update/Delete produk
- `GET/POST /api/customers` - List/Create customer
- `GET/PUT/DELETE /api/customers/[id]` - Detail/Update/Delete customer
- `GET/POST /api/suppliers` - List/Create supplier
- `GET/PUT/DELETE /api/suppliers/[id]` - Detail/Update/Delete supplier

### Transaksi
- `GET/POST /api/transactions` - List/Create transaksi
- `GET/DELETE /api/transactions/[id]` - Detail/Delete transaksi
- `POST /api/transactions/[id]/payments` - Bayar cicilan
- `GET/POST /api/receivables` - List/Create piutang
- `GET/POST /api/payables` - List/Create hutang
- `GET/POST /api/expenses` - List/Create pengeluaran

### Laporan
- `GET /api/reports/sales` - Laporan penjualan
- `GET /api/reports/purchases` - Laporan pembelian
- `GET /api/reports/expenses` - Laporan pengeluaran
- `GET /api/reports/stock` - Laporan stok
- `GET /api/reports/debts` - Laporan hutang piutang
- `GET /api/reports/profit` - Laporan laba rugi

## 🎓 Tips & Best Practices

1. **Backup Database** - Copy file `prisma/dev.db` secara berkala
2. **Seed Data** - Gunakan data sample untuk testing
3. **Date Range** - Gunakan filter tanggal untuk laporan yang akurat
4. **Stock Check** - Monitor laporan stok secara berkala
5. **Payment Status** - Update status pembayaran secara teratur

## 📞 Support

Jika ada pertanyaan atau issue:
1. Check dokumentasi ini
2. Check kode di source files
3. Lihat console untuk error messages

## 📄 License

MIT License - Free to use and modify

## 🙏 Credits

Built with ❤️ using:
- Next.js
- Prisma
- Tailwind CSS
- React Icons

---

**Sistem Informasi Bengkel** - Solusi lengkap untuk manajemen bengkel modern! 🚗💼
