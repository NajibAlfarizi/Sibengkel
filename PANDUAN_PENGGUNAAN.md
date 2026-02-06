# 📖 Panduan Penggunaan Sistem Informasi Bengkel

## 📑 Daftar Isi
1. [Pengenalan](#-pengenalan)
2. [Memulai Sistem](#-memulai-sistem)
3. [Dashboard](#-dashboard)
4. [Master Data](#-master-data)
   - [Kategori Produk](#41-kategori-produk)
   - [Produk](#42-produk)
   - [Customer](#43-customer)
   - [Supplier](#44-supplier)
5. [Transaksi](#-transaksi)
   - [Penjualan](#51-penjualan)
   - [Pembelian](#52-pembelian)
   - [Pengeluaran](#53-pengeluaran)
6. [Hutang & Piutang](#-hutang--piutang)
   - [Piutang](#61-piutang)
   - [Hutang](#62-hutang)
7. [Laporan](#-laporan)
8. [Tips & Best Practices](#-tips--best-practices)
9. [FAQ](#-faq---pertanyaan-umum)

---

## 🎯 Pengenalan

### Apa itu Sistem Informasi Bengkel?

Sistem Informasi Bengkel adalah aplikasi manajemen bengkel yang lengkap untuk membantu Anda mengelola:
- ✅ Data produk dan stok
- ✅ Transaksi penjualan dan pembelian
- ✅ Data customer dan supplier
- ✅ Hutang dan piutang
- ✅ Pengeluaran operasional
- ✅ Laporan bisnis yang komprehensif

### Siapa yang Menggunakan Sistem Ini?

- **Pemilik Bengkel**: Monitoring bisnis dan laporan keuangan
- **Kasir/Admin**: Input transaksi dan kelola data harian
- **Manager**: Analisis laporan dan pengambilan keputusan

---

## 🚀 Memulai Sistem

### Instalasi dan Setup

#### Langkah 1: Instalasi Dependencies
```bash
npm install
```

#### Langkah 2: Setup Database
```bash
npm run db:push
```

#### Langkah 3: Seed Data Contoh (Opsional)
Untuk mencoba sistem dengan data contoh:
```bash
npm run db:seed:full
```

#### Langkah 4: Jalankan Aplikasi
```bash
npm run dev
```

#### Langkah 5: Akses Aplikasi
Buka browser dan akses:
```
http://localhost:3000
```

### Navigasi Sistem

Sistem ini menggunakan **Sidebar** di sebelah kiri untuk navigasi utama:

| Menu | Fungsi |
|------|--------|
| 🏠 **Dashboard** | Ringkasan statistik bisnis |
| 📦 **Kategori** | Kelola kategori produk |
| 🛠️ **Produk** | Kelola data produk & stok |
| 👥 **Customer** | Kelola data pelanggan |
| 🏢 **Supplier** | Kelola data supplier |
| 💰 **Penjualan** | Transaksi penjualan |
| 🛒 **Pembelian** | Transaksi pembelian |
| 💸 **Pengeluaran** | Catat pengeluaran operasional |
| 📈 **Piutang** | Monitor piutang customer |
| 📉 **Hutang** | Monitor hutang supplier |
| 📊 **Laporan** | Berbagai laporan bisnis |

---

## 📊 Dashboard

### Fitur Dashboard

Dashboard menampilkan ringkasan informasi penting bisnis Anda:

#### 1. Statistik Utama
Menampilkan 4 kartu statistik:
- **Total Penjualan**: Total nilai penjualan hari ini
- **Total Pembelian**: Total nilai pembelian hari ini
- **Total Piutang**: Total piutang yang belum dibayar
- **Total Hutang**: Total hutang yang belum dibayar

#### 2. Grafik Penjualan
- Grafik batang penjualan 7 hari terakhir
- Membantu melihat tren penjualan harian

#### 3. Produk Stok Menipis
- Alert produk dengan stok di bawah minimum
- Klik untuk langsung menuju halaman produk

#### 4. Transaksi Terbaru
- Menampilkan 5 transaksi terakhir
- Info cepat: nomor invoice, customer, total, dan status

### Cara Menggunakan Dashboard

1. **Buka halaman Dashboard** dari menu utama
2. **Review statistik harian** di 4 kartu teratas
3. **Perhatikan alert stok menipis** untuk segera restock
4. **Monitor transaksi terbaru** untuk memastikan kelancaran operasional

---

## 🗂️ Master Data

### 4.1 Kategori Produk

Kategori digunakan untuk mengorganisir produk-produk Anda.

#### Menambah Kategori Baru

1. Klik menu **Kategori** di sidebar
2. Klik tombol **+ Tambah Kategori**
3. Isi form:
   - **Nama Kategori**: Contoh: "Ban", "Oli Motor", "Aki", "Spare Part"
   - **Deskripsi**: (Opsional) Keterangan tambahan
4. Klik **Simpan**

#### Mengedit Kategori

1. Di tabel kategori, klik tombol **✏️ Edit**
2. Ubah data yang diperlukan
3. Klik **Update**

#### Menghapus Kategori

1. Klik tombol **🗑️ Hapus** pada kategori yang ingin dihapus
2. Konfirmasi penghapusan
3. ⚠️ **Perhatian**: Kategori yang memiliki produk tidak dapat dihapus

#### Tips Kategori
- Buat kategori yang spesifik untuk memudahkan pencarian
- Gunakan nama yang konsisten dan mudah dipahami
- Contoh kategori yang baik:
  - Ban Motor
  - Oli Mesin
  - Aki & Battery
  - Spare Part Mesin
  - Aksesoris

---

### 4.2 Produk

Kelola semua produk bengkel Anda di sini.

#### Menambah Produk Baru

1. Klik menu **Produk** di sidebar
2. Klik tombol **+ Tambah Produk**
3. Isi form lengkap:
   
   **Data Produk:**
   - **Kode Produk**: Kode unik produk (contoh: BAN001, OLI-10W40)
   - **Nama Produk**: Nama lengkap produk
   - **Kategori**: Pilih kategori yang sesuai
   
   **Harga:**
   - **Harga Beli**: Harga beli dari supplier
   - **Harga Jual**: Harga jual ke customer
   
   **Stok:**
   - **Stok Awal**: Jumlah stok saat ini
   - **Minimum Stok**: Batas minimum untuk alert
   
   **Info Tambahan:**
   - **Deskripsi**: (Opsional) Keterangan detail produk

4. Klik **Simpan**

#### Mengedit Produk

1. Klik tombol **✏️ Edit** pada produk
2. Ubah data yang diperlukan
3. Klik **Update**

#### Menghapus Produk

1. Klik tombol **🗑️ Hapus**
2. Konfirmasi penghapusan
3. ⚠️ **Perhatian**: Produk yang sudah ada di transaksi tidak dapat dihapus

#### Monitoring Stok

**Sistem Otomatis:**
- ✅ Stok otomatis berkurang saat penjualan
- ✅ Stok otomatis bertambah saat pembelian
- ✅ Alert otomatis jika stok di bawah minimum

**Cara Melihat Stok:**
1. Lihat kolom **Stok** di tabel produk
2. Produk dengan stok menipis ditandai warna merah
3. Cek dashboard untuk list produk stok menipis

#### Tips Produk
- Gunakan kode produk yang konsisten
- Set minimum stok dengan bijak (biasanya stok untuk 1 minggu)
- Update harga secara berkala
- Isi deskripsi untuk produk yang kompleks
- Contoh penamaan yang baik:
  - "Ban Motor Tubeless 80/90-17 IRC"
  - "Oli Mesin 4T SAE 10W-40 1 Liter"
  - "Aki Motor GS Astra 5 Ampere"

---

### 4.3 Customer

Kelola data pelanggan bengkel Anda.

#### Menambah Customer Baru

1. Klik menu **Customer** di sidebar
2. Klik tombol **+ Tambah Customer**
3. Isi form:
   
   **Data Dasar:**
   - **Nama**: Nama customer
   - **Tipe**: 
     - **Umum**: Pelanggan perorangan
     - **Perusahaan**: Pelanggan korporat
   
   **Kontak:**
   - **Telepon**: Nomor telepon
   - **Email**: (Opsional) Email customer
   
   **Alamat:**
   - **Alamat**: Alamat lengkap customer

4. Klik **Simpan**

#### Melihat Detail Customer

1. Klik nama customer atau tombol **👁️ Detail**
2. Anda akan melihat:
   - Data lengkap customer
   - History transaksi
   - Total transaksi
   - Piutang yang belum dibayar

#### Mengedit Customer

1. Di halaman detail, klik **✏️ Edit**
2. Ubah data yang diperlukan
3. Klik **Update**

#### Menghapus Customer

1. Di tabel customer, klik **🗑️ Hapus**
2. Konfirmasi penghapusan
3. ⚠️ **Perhatian**: Customer yang memiliki transaksi tidak dapat dihapus

#### Tips Customer
- Simpan minimal nama dan nomor telepon
- Untuk customer perusahaan, isi alamat lengkap untuk pengiriman
- Catat email untuk kemudahan komunikasi
- Review history customer sebelum memberikan credit

---

### 4.4 Supplier

Kelola data pemasok produk Anda.

#### Menambah Supplier Baru

1. Klik menu **Supplier** di sidebar
2. Klik tombol **+ Tambah Supplier**
3. Isi form:
   
   **Data Supplier:**
   - **Nama Supplier**: Nama perusahaan/supplier
   - **Kontak Person**: (Opsional) Nama kontak
   
   **Kontak:**
   - **Telepon**: Nomor telepon supplier
   - **Email**: (Opsional) Email supplier
   
   **Alamat:**
   - **Alamat**: Alamat lengkap supplier

4. Klik **Simpan**

#### Melihat Detail Supplier

1. Klik nama supplier atau tombol **👁️ Detail**
2. Informasi yang ditampilkan:
   - Data lengkap supplier
   - History pembelian
   - Total pembelian
   - Hutang yang belum dibayar

#### Mengedit Supplier

1. Di halaman detail, klik **✏️ Edit**
2. Ubah data yang diperlukan
3. Klik **Update**

#### Menghapus Supplier

1. Klik **🗑️ Hapus** pada supplier
2. Konfirmasi penghapusan
3. ⚠️ **Perhatian**: Supplier dengan transaksi tidak dapat dihapus

#### Tips Supplier
- Simpan data lengkap untuk memudahkan order
- Catat kontak person untuk komunikasi cepat
- Review history pembelian untuk evaluasi supplier
- Bandingkan harga antar supplier secara berkala

---

## 💰 Transaksi

### 5.1 Penjualan

Catat transaksi penjualan produk ke customer.

#### Membuat Transaksi Penjualan Baru

1. Klik menu **Penjualan** di sidebar
2. Klik tombol **+ Transaksi Baru**
3. Isi form transaksi:

   **Step 1: Info Transaksi**
   - **Nomor Invoice**: Otomatis di-generate (format: INV-YYYYMMDD-XXX)
   - **Tanggal**: Pilih tanggal transaksi
   - **Customer**: 
     - Pilih dari daftar customer, ATAU
     - Kosongkan untuk customer umum (tanpa nama)

   **Step 2: Tambah Produk**
   - Klik **+ Tambah Produk**
   - Pilih produk dari daftar
   - Isi **Jumlah** yang dijual
   - Sistem otomatis mengisi:
     - Harga jual
     - Harga beli (untuk kalkulasi HPP)
     - Subtotal
   - Klik **Tambah ke Transaksi**
   - Ulangi untuk menambah produk lain

   **Step 3: Diskon & Pajak**
   - **Diskon**: (Opsional) Masukkan jumlah diskon dalam rupiah
   - **Pajak**: (Opsional) Masukkan jumlah pajak dalam rupiah
   - **Total Akhir**: Otomatis dihitung

   **Step 4: Pembayaran**
   - **Metode Pembayaran**:
     - **CASH**: Bayar tunai penuh
     - **CREDIT**: Bayar nanti/kredit
   
   - **Status Pembayaran**:
     - **LUNAS**: Dibayar penuh
     - **BELUM_LUNAS**: Belum dibayar sama sekali
     - **CICILAN**: Dibayar sebagian

   **Jika Status = LUNAS:**
   - Tidak ada field tambahan

   **Jika Status = BELUM_LUNAS atau CICILAN:**
   - **Tanggal Jatuh Tempo**: Pilih tanggal deadline pembayaran
   - **Jumlah Dibayar**: (Untuk CICILAN) Masukkan jumlah yang sudah dibayar
   
   **Catatan:**
   - **Catatan**: (Opsional) Keterangan tambahan transaksi

4. Klik **Simpan Transaksi**

#### Proses Otomatis Setelah Penjualan

✅ **Stok produk otomatis berkurang** sesuai jumlah terjual  
✅ **Jika status BELUM_LUNAS atau CICILAN**:
   - Sistem otomatis membuat piutang
   - Piutang muncul di menu Piutang

#### Melihat Detail Transaksi Penjualan

1. Di halaman Penjualan, klik **nomor invoice** atau **👁️ Detail**
2. Informasi yang ditampilkan:
   - Nomor invoice dan tanggal
   - Data customer
   - List produk yang dibeli
   - Diskon, pajak, total
   - Status pembayaran
   - History pembayaran (jika ada cicilan)

#### Menambah Pembayaran Cicilan

Jika transaksi berstatus CICILAN dan customer bayar lagi:

1. Buka **detail transaksi**
2. Scroll ke bagian **Riwayat Pembayaran**
3. Klik **+ Tambah Pembayaran**
4. Isi:
   - **Jumlah Bayar**: Jumlah yang dibayarkan
   - **Tanggal**: Tanggal pembayaran
   - **Keterangan**: (Opsional) Catatan
5. Klik **Simpan**
6. ✅ Sistem otomatis update:
   - Status transaksi (jadi LUNAS jika lunas)
   - Status piutang
   - Sisa piutang

#### Tips Penjualan
- Pastikan stok cukup sebelum transaksi
- Untuk customer perusahaan, gunakan metode CREDIT
- Catat nomor invoice untuk referensi
- Set tanggal jatuh tempo realistis
- Untuk cicilan, catat setiap pembayaran segera
- Print atau screenshot invoice untuk arsip

#### Contoh Skenario Penjualan

**Skenario 1: Penjualan Cash Umum**
- Customer: (Kosongkan)
- Produk: Ban Motor, Oli
- Metode: CASH
- Status: LUNAS
- ✅ Selesai, tidak ada piutang

**Skenario 2: Penjualan Credit ke Perusahaan**
- Customer: PT. ABC Motor
- Produk: Ban Motor (10 unit)
- Metode: CREDIT
- Status: BELUM_LUNAS
- Jatuh Tempo: 30 hari kemudian
- ✅ Sistem buat piutang otomatis

**Skenario 3: Penjualan dengan Cicilan**
- Customer: Budi
- Total: Rp 5.000.000
- Metode: CREDIT
- Status: CICILAN
- Dibayar: Rp 2.000.000 (DP)
- Sisa: Rp 3.000.000
- ✅ Piutang tersisa Rp 3.000.000

---

### 5.2 Pembelian

Catat transaksi pembelian produk dari supplier.

#### Membuat Transaksi Pembelian Baru

1. Klik menu **Pembelian** di sidebar
2. Klik tombol **+ Transaksi Baru**
3. Isi form transaksi:

   **Step 1: Info Transaksi**
   - **Nomor Invoice**: Otomatis (format: PO-YYYYMMDD-XXX)
   - **Tanggal**: Pilih tanggal pembelian
   - **Supplier**: ⚠️ **WAJIB** pilih supplier

   **Step 2: Tambah Produk**
   - Klik **+ Tambah Produk**
   - Pilih produk dari daftar
   - Isi **Jumlah** yang dibeli
   - Isi **Harga Beli** (bisa berbeda dari harga beli default)
   - **Subtotal**: Otomatis dihitung
   - Klik **Tambah ke Transaksi**
   - Ulangi untuk produk lain

   **Step 3: Diskon & Pajak**
   - **Diskon**: (Opsional) Diskon dari supplier
   - **Pajak**: (Opsional) Pajak pembelian
   - **Total Akhir**: Otomatis dihitung

   **Step 4: Pembayaran**
   - **Metode Pembayaran**:
     - **CASH**: Bayar tunai
     - **CREDIT**: Bayar nanti (hutang)
   
   - **Status Pembayaran**:
     - **LUNAS**: Dibayar penuh
     - **BELUM_LUNAS**: Belum dibayar
     - **CICILAN**: Dibayar sebagian

   **Jika Status = BELUM_LUNAS atau CICILAN:**
   - **Tanggal Jatuh Tempo**: Deadline pembayaran ke supplier
   - **Jumlah Dibayar**: (Untuk CICILAN) Jumlah yang sudah dibayar
   
   **Catatan:**
   - **Catatan**: (Opsional) Keterangan pembelian

4. Klik **Simpan Transaksi**

#### Proses Otomatis Setelah Pembelian

✅ **Stok produk otomatis bertambah** sesuai jumlah beli  
✅ **Jika status BELUM_LUNAS atau CICILAN**:
   - Sistem otomatis membuat hutang
   - Hutang muncul di menu Hutang

#### Melihat Detail Transaksi Pembelian

1. Di halaman Pembelian, klik **nomor invoice** atau **👁️ Detail**
2. Informasi:
   - Nomor invoice dan tanggal
   - Data supplier
   - List produk yang dibeli
   - Diskon, pajak, total
   - Status pembayaran
   - History pembayaran

#### Membayar Hutang Pembelian

1. Buka **detail transaksi**
2. Klik **+ Tambah Pembayaran**
3. Isi jumlah dan tanggal pembayaran
4. Klik **Simpan**
5. ✅ Sistem update status hutang

#### Tips Pembelian
- Pastikan supplier sudah terdaftar
- Cek harga beli untuk memastikan margin keuntungan
- Untuk pembelian besar, catat di catatan
- Pantau jatuh tempo hutang
- Update stok minimum jika perlu

---

### 5.3 Pengeluaran

Catat semua pengeluaran operasional bengkel.

#### Menambah Pengeluaran Baru

1. Klik menu **Pengeluaran** di sidebar
2. Klik tombol **+ Tambah Pengeluaran**
3. Isi form:
   
   **Data Pengeluaran:**
   - **Tanggal**: Pilih tanggal pengeluaran
   - **Kategori**: Pilih kategori (contoh: Gaji, Listrik, Sewa, dll)
   - **Jumlah**: Nominal pengeluaran
   - **Keterangan**: Detail pengeluaran
   - **Catatan**: (Opsional) Catatan tambahan

4. Klik **Simpan**

#### Mengedit Pengeluaran

1. Klik **✏️ Edit** pada pengeluaran
2. Ubah data yang diperlukan
3. Klik **Update**

#### Menghapus Pengeluaran

1. Klik **🗑️ Hapus**
2. Konfirmasi penghapusan

#### Kategori Pengeluaran yang Umum

- **Gaji Karyawan**: Pembayaran gaji
- **Listrik**: Tagihan listrik
- **Air**: Tagihan air
- **Sewa Tempat**: Biaya sewa bengkel
- **Transportasi**: Biaya transport
- **Maintenance**: Perawatan peralatan
- **Marketing**: Biaya promosi
- **ATK**: Alat tulis kantor
- **Lain-lain**: Pengeluaran misc

#### Tips Pengeluaran
- Catat semua pengeluaran sekecil apapun
- Kategorisasi dengan baik untuk laporan
- Simpan bukti (nota/struk) sebagai arsip
- Isi keterangan detail untuk audit
- Review pengeluaran bulanan untuk efisiensi

---

## 💳 Hutang & Piutang

### 6.1 Piutang

Monitor dan kelola piutang dari customer.

#### Cara Piutang Terbentuk

Piutang otomatis terbentuk saat:
- Transaksi penjualan dengan status **BELUM_LUNAS** atau **CICILAN**
- Sistem otomatis membuat record piutang

#### Melihat Daftar Piutang

1. Klik menu **Piutang** di sidebar
2. Tabel menampilkan:
   - Nomor invoice
   - Nama customer
   - Total piutang
   - Jumlah dibayar
   - Sisa piutang
   - Tanggal jatuh tempo
   - Status (BELUM_LUNAS / LUNAS)

#### Filter Piutang

- Filter berdasarkan **Status**:
  - Semua
  - Belum Lunas (menampilkan piutang aktif)
  - Lunas (menampilkan piutang sudah dibayar)

#### Menagih Piutang

**Cara 1: Dari Menu Piutang**
1. Di halaman Piutang, klik **nomor invoice**
2. Akan diarahkan ke detail transaksi
3. Klik **+ Tambah Pembayaran**
4. Isi jumlah yang dibayar
5. Klik **Simpan**

**Cara 2: Dari Menu Penjualan**
1. Buka detail transaksi penjualan
2. Tambah pembayaran (lihat cara di bagian Penjualan)

#### Proses Otomatis Pembayaran Piutang

✅ Sisa piutang otomatis diupdate  
✅ Status berubah LUNAS jika sudah dibayar penuh  
✅ Transaksi terkait juga update statusnya

#### Tips Piutang
- Pantau piutang yang mendekati/lewat jatuh tempo
- Tagih secara berkala sebelum jatuh tempo
- Untuk customer bermasalah, catat di notes
- Set jatuh tempo realistis (biasanya 7-30 hari)
- Review piutang mingguan

---

### 6.2 Hutang

Monitor dan kelola hutang ke supplier.

#### Cara Hutang Terbentuk

Hutang otomatis terbentuk saat:
- Transaksi pembelian dengan status **BELUM_LUNAS** atau **CICILAN**
- Sistem otomatis membuat record hutang

#### Melihat Daftar Hutang

1. Klik menu **Hutang** di sidebar
2. Tabel menampilkan:
   - Nomor invoice
   - Nama supplier
   - Total hutang
   - Jumlah dibayar
   - Sisa hutang
   - Tanggal jatuh tempo
   - Status (BELUM_LUNAS / LUNAS)

#### Filter Hutang

- Filter berdasarkan **Status**:
  - Semua
  - Belum Lunas (hutang aktif)
  - Lunas (hutang sudah dibayar)

#### Membayar Hutang

**Cara 1: Dari Menu Hutang**
1. Di halaman Hutang, klik **nomor invoice**
2. Diarahkan ke detail transaksi pembelian
3. Klik **+ Tambah Pembayaran**
4. Isi jumlah yang dibayar
5. Klik **Simpan**

**Cara 2: Dari Menu Pembelian**
1. Buka detail transaksi pembelian
2. Tambah pembayaran (lihat cara di bagian Pembelian)

#### Proses Otomatis Pembayaran Hutang

✅ Sisa hutang otomatis diupdate  
✅ Status berubah LUNAS jika sudah dibayar penuh  
✅ Transaksi terkait juga update statusnya

#### Tips Hutang
- Bayar hutang sebelum jatuh tempo
- Jaga hubungan baik dengan supplier
- Prioritaskan pembayaran berdasarkan jatuh tempo
- Negosiasi jatuh tempo jika perlu
- Catat semua komunikasi dengan supplier

---

## 📊 Laporan

### Mengakses Laporan

1. Klik menu **Laporan** di sidebar
2. Pilih jenis laporan yang ingin dilihat:
   - Laporan Penjualan
   - Laporan Pembelian
   - Laporan Pengeluaran
   - Laporan Stok
   - Laporan Hutang Piutang
   - Laporan Laba Rugi

### 7.1 Laporan Penjualan

#### Informasi yang Ditampilkan

**Ringkasan:**
- Total penjualan (dalam rupiah)
- Jumlah transaksi
- Rata-rata per transaksi
- HPP (Harga Pokok Penjualan)
- Laba kotor
- Margin laba

**Detail:**
- Penjualan per kategori produk
- Top 10 produk terlaris
- Grafik tren penjualan

#### Filter Data

- **Dari Tanggal**: Pilih tanggal awal
- **Sampai Tanggal**: Pilih tanggal akhir
- Klik **Filter** untuk update data

#### Cara Menggunakan

1. Klik **Laporan** > **Laporan Penjualan**
2. Set rentang tanggal yang diinginkan
3. Klik **Filter**
4. Analisis data:
   - Lihat total penjualan
   - Identifikasi produk terlaris
   - Check margin keuntungan
   - Bandingkan dengan periode lain

#### Tips Analisis
- Review penjualan harian untuk monitoring rutin
- Analisis bulanan untuk evaluasi performa
- Identifikasi produk slow-moving untuk promosi
- Fokus stok pada produk terlaris

---

### 7.2 Laporan Pembelian

#### Informasi yang Ditampilkan

**Ringkasan:**
- Total pembelian (dalam rupiah)
- Jumlah transaksi pembelian
- Rata-rata per transaksi

**Detail:**
- Pembelian per supplier
- Pembelian per kategori produk
- History pembelian

#### Filter Data

- Pilih rentang tanggal
- Klik **Filter**

#### Cara Menggunakan

1. Klik **Laporan** > **Laporan Pembelian**
2. Set rentang tanggal
3. Klik **Filter**
4. Analisis:
   - Total pembelian per supplier
   - Kategori dengan pembelian terbanyak
   - Evaluasi supplier

#### Tips Analisis
- Bandingkan harga antar supplier
- Identifikasi supplier terbaik (harga & service)
- Review pembelian untuk forecast stok
- Negosiasi diskon untuk pembelian besar

---

### 7.3 Laporan Pengeluaran

#### Informasi yang Ditampilkan

**Ringkasan:**
- Total pengeluaran
- Rata-rata pengeluaran
- Jumlah transaksi pengeluaran

**Detail:**
- Pengeluaran per kategori
- Persentase per kategori
- History detail pengeluaran

**Grafik:**
- Pie chart komposisi pengeluaran per kategori

#### Filter Data

- Pilih rentang tanggal
- Klik **Filter**

#### Cara Menggunakan

1. Klik **Laporan** > **Laporan Pengeluaran**
2. Set rentang tanggal
3. Klik **Filter**
4. Analisis:
   - Kategori pengeluaran terbesar
   - Trend pengeluaran
   - Identifikasi pemborosan

#### Tips Analisis
- Review bulanan untuk kontrol biaya
- Identifikasi pengeluaran yang bisa dikurangi
- Bandingkan dengan pendapatan
- Set budget per kategori

---

### 7.4 Laporan Stok

#### Informasi yang Ditampilkan

**Ringkasan:**
- Total produk
- Total nilai stok (harga beli)
- Nilai potensi penjualan (harga jual)
- Potensi keuntungan

**Detail:**
- Stok per kategori
- Produk stok menipis
- Produk stok habis

#### Cara Menggunakan

1. Klik **Laporan** > **Laporan Stok**
2. Review informasi:
   - Nilai persediaan
   - Produk yang perlu restock
   - Distribusi stok per kategori

#### Tips Analisis
- Monitor produk stok menipis untuk restock
- Analisis nilai stok untuk cash flow
- Hindari overstocking
- Fokus pada produk fast-moving

---

### 7.5 Laporan Hutang Piutang

#### Informasi yang Ditampilkan

**Piutang:**
- Total piutang
- Jumlah dibayar
- Sisa piutang
- Piutang per customer
- Jumlah transaksi piutang

**Hutang:**
- Total hutang
- Jumlah dibayar
- Sisa hutang
- Hutang per supplier
- Jumlah transaksi hutang

#### Cara Menggunakan

1. Klik **Laporan** > **Laporan Hutang Piutang**
2. Review kedua bagian:
   - **Piutang**: Yang harus ditagih
   - **Hutang**: Yang harus dibayar
3. Identifikasi:
   - Customer dengan piutang terbesar
   - Supplier dengan hutang terbesar

#### Tips Analisis
- Monitor cash flow (piutang vs hutang)
- Prioritaskan penagihan piutang besar
- Jangan sampai hutang lewat jatuh tempo
- Evaluasi kebijakan kredit

---

### 7.6 Laporan Laba Rugi

#### Informasi yang Ditampilkan

**Pendapatan:**
- Total penjualan

**HPP (Harga Pokok Penjualan):**
- Total biaya produk yang terjual

**Laba Kotor:**
- Penjualan - HPP
- Margin laba kotor (%)

**Biaya Operasional:**
- Total pengeluaran

**Laba Bersih:**
- Laba kotor - Biaya operasional
- Margin laba bersih (%)

#### Filter Data

- Pilih rentang tanggal
- Klik **Filter**

#### Cara Menggunakan

1. Klik **Laporan** > **Laporan Laba Rugi**
2. Set periode analisis
3. Klik **Filter**
4. Analisis:
   - Profitabilitas bisnis
   - Margin keuntungan
   - Efisiensi operasional

#### Interpretasi Hasil

**Margin Laba Kotor:**
- < 20%: Rendah (review harga jual/beli)
- 20-40%: Normal
- > 40%: Baik

**Margin Laba Bersih:**
- < 10%: Rendah (kontrol pengeluaran)
- 10-20%: Normal
- > 20%: Sangat baik

#### Tips Analisis
- Review bulanan untuk monitoring kesehatan bisnis
- Bandingkan dengan bulan/tahun sebelumnya
- Jika margin rendah:
  - Tingkatkan harga jual
  - Kurangi pengeluaran
  - Negosiasi harga beli lebih baik
- Jika margin baik: Maintain dan ekspansi

---

## 💡 Tips & Best Practices

### Manajemen Stok

1. **Set Minimum Stok dengan Bijak**
   - Hitung kebutuhan untuk 1-2 minggu
   - Sesuaikan dengan kecepatan penjualan produk

2. **Restock Tepat Waktu**
   - Pesan ulang saat stok mencapai minimum
   - Jangan tunggu sampai habis

3. **Monitoring Rutin**
   - Cek dashboard setiap hari untuk alert stok
   - Review laporan stok mingguan

4. **Hindari Overstocking**
   - Analisis laporan penjualan untuk forecast
   - Prioritas produk fast-moving

### Manajemen Transaksi

1. **Input Transaksi Segera**
   - Catat transaksi real-time
   - Jangan tunda sampai akhir hari

2. **Verifikasi Data**
   - Pastikan jumlah produk benar
   - Cek total sebelum simpan

3. **Catat Keterangan**
   - Isi catatan untuk transaksi penting
   - Akan membantu saat review

4. **Arsip Invoice**
   - Simpan bukti transaksi
   - Screenshot atau print invoice

### Manajemen Hutang Piutang

1. **Kebijakan Kredit yang Jelas**
   - Set jatuh tempo standar (7/14/30 hari)
   - Tentukan limit kredit per customer

2. **Monitoring Aktif**
   - Review piutang setiap minggu
   - Follow-up sebelum jatuh tempo

3. **Reminder Otomatis**
   - Ingatkan customer H-3 sebelum jatuh tempo
   - Follow-up langsung jika lewat tempo

4. **Dokumentasi**
   - Catat semua komunikasi penagihan
   - Simpan bukti pembayaran

### Manajemen Keuangan

1. **Catat Semua Pengeluaran**
   - Sekecil apapun, catat
   - Kategorikan dengan benar

2. **Review Laporan Rutin**
   - Harian: Dashboard & transaksi
   - Mingguan: Stok & piutang
   - Bulanan: Laba rugi & performa

3. **Pisahkan Keuangan**
   - Jangan campur uang bisnis & pribadi
   - Gunakan rekening terpisah

4. **Set Target**
   - Target penjualan bulanan
   - Target margin keuntungan
   - Target pertumbuhan

### Backup Data

1. **Backup Database Rutin**
   - Minimal seminggu sekali
   - Simpan di lokasi aman

2. **Lokasi Backup**
   - File database: `prisma/dev.db`
   - Backup ke cloud storage atau external drive

3. **Cara Backup Manual**
   ```bash
   # Copy file database
   cp prisma/dev.db prisma/backup/dev-2026-02-07.db
   ```

4. **Cara Restore**
   ```bash
   # Restore dari backup
   cp prisma/backup/dev-2026-02-07.db prisma/dev.db
   ```

---

## ❓ FAQ - Pertanyaan Umum

### Umum

**Q: Apakah sistem ini gratis?**  
A: Ya, sistem ini open source dan gratis digunakan.

**Q: Apakah perlu koneksi internet?**  
A: Tidak, sistem berjalan secara lokal di komputer Anda.

**Q: Apakah bisa digunakan multi-user?**  
A: Versi saat ini adalah single-user di satu komputer.

**Q: Apakah aman untuk produksi?**  
A: Ya, namun pastikan backup data rutin.

### Master Data

**Q: Bisa mengubah kode produk setelah transaksi?**  
A: Bisa, namun tidak disarankan untuk menghindari kebingungan.

**Q: Produk tidak bisa dihapus, kenapa?**  
A: Produk yang sudah ada di transaksi tidak bisa dihapus untuk menjaga integritas data.

**Q: Bagaimana cara impor produk dari Excel?**  
A: Fitur impor belum tersedia, harus input manual satu per satu.

**Q: Bisa menambah field custom?**  
A: Perlu modifikasi database schema dan kode.

### Transaksi

**Q: Bisa edit transaksi yang sudah disimpan?**  
A: Tidak bisa mengedit transaksi, hanya bisa tambah pembayaran.

**Q: Bagaimana cara void/batal transaksi?**  
A: Belum ada fitur void, harus delete dari database (advanced).

**Q: Bisa print invoice?**  
A: Fitur print belum ada, bisa screenshot atau print dari browser.

**Q: Stok otomatis update kapan?**  
A: Otomatis langsung setelah transaksi disimpan.

**Q: Bisa diskon per item?**  
A: Saat ini diskon hanya untuk total transaksi.

### Pembayaran

**Q: Customer bayar cicilan ke-2, bagaimana?**  
A: Buka detail transaksi > Tambah Pembayaran > Isi jumlah bayar.

**Q: Bisa ubah jatuh tempo setelah transaksi?**  
A: Tidak bisa lewat UI, harus edit database langsung.

**Q: Otomatis reminder jatuh tempo?**  
A: Belum ada notifikasi otomatis, harus cek manual.

### Laporan

**Q: Bisa export laporan ke Excel/PDF?**  
A: Belum ada fitur export, bisa print atau screenshot.

**Q: Laporan real-time atau delayed?**  
A: Real-time, langsung update setelah transaksi.

**Q: Bisa custom periode laporan?**  
A: Ya, bisa pilih rentang tanggal sesuai kebutuhan.

**Q: Bisa lihat laporan tahun lalu?**  
A: Ya, pilih rentang tanggal tahun lalu di filter.

### Teknis

**Q: Database penuh, bagaimana?**  
A: SQLite tidak ada limit signifikan untuk bisnis kecil-menengah.

**Q: Bagaimana cara backup?**  
A: Copy file `prisma/dev.db` ke lokasi aman.

**Q: Lupa / corrupt database?**  
A: Restore dari backup, atau reset dengan `npm run db:push`.

**Q: Bisa akses dari HP?**  
A: Bisa, akses `http://[IP-KOMPUTER]:3000` dari HP yang satu jaringan.

**Q: Error saat jalankan, solusi?**  
A: Pastikan:
   - Node.js terinstall
   - Dependencies sudah di-install (`npm install`)
   - Database sudah di-push (`npm run db:push`)

**Q: Bagaimana cara update/upgrade sistem?**  
A: Pull code terbaru, lalu jalankan:
   ```bash
   npm install
   npm run db:push
   ```

---

## 🆘 Bantuan & Support

### Dokumentasi Teknis

Untuk developer atau user advanced, lihat:
- [DOCUMENTATION.md](DOCUMENTATION.md) - Dokumentasi teknis lengkap
- [README.md](README.md) - Overview sistem

### Database

Untuk melihat dan edit database langsung:
```bash
npm run db:studio
```

Akan membuka Prisma Studio di browser.

### Logs Error

Jika ada error, cek:
1. Terminal tempat aplikasi berjalan
2. Browser console (F12)
3. File log (jika ada)

### Kontak Developer

Jika ada pertanyaan atau butuh bantuan:
- GitHub Issues: [Project Repository]
- Email: [Your Email]

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Master data lengkap
- ✅ Transaksi penjualan & pembelian
- ✅ Hutang piutang management
- ✅ Sistem cicilan/pembayaran bertahap
- ✅ Laporan komprehensif
- ✅ Dashboard monitoring
- ✅ Auto update stok

### Roadmap (Future)
- ⏳ Print invoice / receipt
- ⏳ Export laporan (Excel/PDF)
- ⏳ Notifikasi & reminder
- ⏳ Multi-user & roles
- ⏳ Barcode scanner
- ⏳ WhatsApp integration
- ⏳ Mobile app

---

## 🎓 Penutup

### Kesimpulan

Sistem Informasi Bengkel adalah solusi lengkap untuk mengelola bisnis bengkel Anda. Dengan mengikuti panduan ini, Anda dapat:

✅ Mengelola produk dan stok dengan efisien  
✅ Mencatat transaksi dengan akurat  
✅ Monitoring hutang dan piutang secara real-time  
✅ Menganalisis bisnis dengan laporan komprehensif  
✅ Membuat keputusan berdasarkan data  

### Saran Penggunaan

1. **Minggu Pertama**: Setup master data (kategori, produk, customer, supplier)
2. **Minggu Kedua**: Mulai catat transaksi dan biasakan workflow
3. **Minggu Ketiga**: Monitoring dan evaluasi menggunakan laporan
4. **Bulan Kedua**: Optimasi berdasarkan insight dari laporan

### Dukungan Berkelanjutan

- Backup data Anda secara rutin
- Update sistem saat ada versi baru
- Lapor bug atau saran melalui GitHub Issues
- Kontribusi untuk pengembangan sistem

---

**Terima kasih telah menggunakan Sistem Informasi Bengkel!** 🚗💨

*Dibuat dengan ❤️ untuk membantu bisnis bengkel di Indonesia*

---

**Last Updated**: 7 Februari 2026  
**Version**: 1.0.0  
**Author**: [Your Name]
