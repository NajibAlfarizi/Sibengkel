// @ts-ignore - Prisma Client is generated at runtime
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with COMPLETE data...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.payment.deleteMany()
  await prisma.transactionItem.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.receivable.deleteMany()
  await prisma.payable.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()

  // Create categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Oli & Pelumas', description: 'Produk oli dan pelumas kendaraan' } }),
    prisma.category.create({ data: { name: 'Spare Part', description: 'Suku cadang kendaraan' } }),
    prisma.category.create({ data: { name: 'Ban & Velg', description: 'Ban dan velg kendaraan' } }),
    prisma.category.create({ data: { name: 'Aki & Baterai', description: 'Aki dan baterai kendaraan' } }),
    prisma.category.create({ data: { name: 'Aksesoris', description: 'Aksesoris kendaraan' } }),
    prisma.category.create({ data: { name: 'Jasa Service', description: 'Layanan service dan perbaikan' } }),
  ])
  console.log('✅ Created 6 categories')

  // Create products
  console.log('📦 Creating products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        code: 'PRD001',
        name: 'Oli Mesin Synthetic 1L',
        description: 'Oli mesin full synthetic untuk performa maksimal',
        categoryId: categories[0].id,
        stock: 45,
        minStock: 10,
        purchasePrice: 80000,
        sellingPrice: 120000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD002',
        name: 'Filter Oli',
        description: 'Filter oli universal untuk berbagai jenis motor',
        categoryId: categories[1].id,
        stock: 28,
        minStock: 5,
        purchasePrice: 25000,
        sellingPrice: 45000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD003',
        name: 'Ban Tubeless 80/90-14',
        description: 'Ban tubeless untuk motor matic',
        categoryId: categories[2].id,
        stock: 18,
        minStock: 5,
        purchasePrice: 180000,
        sellingPrice: 280000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD004',
        name: 'Aki Kering 12V 5Ah',
        description: 'Aki maintenance free untuk motor',
        categoryId: categories[3].id,
        stock: 13,
        minStock: 3,
        purchasePrice: 280000,
        sellingPrice: 400000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD005',
        name: 'Spion Motor Set',
        description: 'Spion sepasang kanan kiri',
        categoryId: categories[4].id,
        stock: 23,
        minStock: 5,
        purchasePrice: 35000,
        sellingPrice: 65000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD006',
        name: 'Kampas Rem Depan',
        description: 'Kampas rem depan motor matic',
        categoryId: categories[1].id,
        stock: 40,
        minStock: 8,
        purchasePrice: 45000,
        sellingPrice: 75000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD007',
        name: 'Rantai Motor',
        description: 'Rantai motor racing kualitas premium',
        categoryId: categories[1].id,
        stock: 22,
        minStock: 5,
        purchasePrice: 120000,
        sellingPrice: 180000,
      },
    }),
    prisma.product.create({
      data: {
        code: 'PRD008',
        name: 'Service Tune Up',
        description: 'Service tune up komprehensif',
        categoryId: categories[5].id,
        stock: 9999,
        minStock: 1,
        purchasePrice: 50000,
        sellingPrice: 150000,
      },
    }),
  ])
  console.log('✅ Created 8 products')

  // Create customers
  console.log('👥 Creating customers...')
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        code: 'CUST001',
        name: 'Budi Santoso',
        type: 'UMUM',
        phone: '081234567890',
        email: 'budi@email.com',
        address: 'Jl. Merdeka No. 123, Jakarta Pusat',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST002',
        name: 'PT. Transportasi Jaya',
        type: 'PERUSAHAAN',
        phone: '021-12345678',
        email: 'purchasing@transportjaya.com',
        address: 'Jl. Sudirman No. 456, Jakarta Selatan',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST003',
        name: 'Siti Rahayu',
        type: 'UMUM',
        phone: '081298765432',
        email: 'siti@email.com',
        address: 'Jl. Gatot Subroto No. 789, Jakarta Timur',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST004',
        name: 'Ahmad Hidayat',
        type: 'UMUM',
        phone: '081312345678',
        email: 'ahmad@email.com',
        address: 'Jl. Asia Afrika No. 45, Bandung',
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST005',
        name: 'CV. Logistik Cepat',
        type: 'PERUSAHAAN',
        phone: '022-87654321',
        email: 'admin@logistikcepat.com',
        address: 'Jl. Industri No. 99, Bandung',
      },
    }),
  ])
  console.log('✅ Created 5 customers')

  // Create suppliers
  console.log('🏭 Creating suppliers...')
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        code: 'SUP001',
        name: 'PT. Astra Motor Parts',
        phone: '021-87654321',
        email: 'sales@astraparts.com',
        address: 'Jl. Industri Raya No. 1, Jakarta Utara',
      },
    }),
    prisma.supplier.create({
      data: {
        code: 'SUP002',
        name: 'CV. Maju Motor',
        phone: '021-11223344',
        email: 'order@majumotor.com',
        address: 'Jl. Raya Motor No. 88, Bekasi',
      },
    }),
    prisma.supplier.create({
      data: {
        code: 'SUP003',
        name: 'PT. Federal Parts Indonesia',
        phone: '021-55667788',
        email: 'sales@federalparts.co.id',
        address: 'Jl. Gatot Subroto Km. 5, Jakarta',
      },
    }),
  ])
  console.log('✅ Created 3 suppliers')

  // Create purchase transactions (Pembelian dari supplier)
  console.log('🛒 Creating purchase transactions...')
  const purchase1 = await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-PUR-001',
      type: 'PEMBELIAN',
      date: new Date('2026-01-10'),
      supplierId: suppliers[0].id,
      subtotal: 2400000,
      discount: 0,
      tax: 0,
      total: 2400000,
      paymentMethod: 'CASH',
      paymentStatus: 'LUNAS',
      paidAmount: 2400000,
      items: {
        create: [
          {
            productId: products[0].id, // Oli
            quantity: 10,
            price: 80000,
            discount: 0,
            subtotal: 800000,
          },
          {
            productId: products[3].id, // Aki
            quantity: 5,
            price: 280000,
            discount: 0,
            subtotal: 1400000,
          },
          {
            productId: products[6].id, // Rantai
            quantity: 5,
            price: 120000,
            discount: 0,
            subtotal: 600000,
          },
        ],
      },
    },
  })

  const purchase2 = await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-PUR-002',
      type: 'PEMBELIAN',
      date: new Date('2026-01-12'),
      supplierId: suppliers[1].id,
      subtotal: 1500000,
      discount: 50000,
      tax: 0,
      total: 1450000,
      paymentMethod: 'CREDIT',
      paymentStatus: 'BELUM_LUNAS',
      paidAmount: 0,
    },
  })

  // Create payable for purchase2
  await prisma.payable.create({
    data: {
      supplierId: suppliers[1].id,
      amount: 1450000,
      paidAmount: 0,
      remaining: 1450000,
      dueDate: new Date('2026-02-12'),
      status: 'BELUM_LUNAS',
      description: `Hutang untuk ${purchase2.invoiceNumber}`,
    },
  })

  await prisma.transactionItem.createMany({
    data: [
      {
        transactionId: purchase2.id,
        productId: products[2].id, // Ban
        quantity: 5,
        price: 180000,
        discount: 0,
        subtotal: 900000,
      },
      {
        transactionId: purchase2.id,
        productId: products[1].id, // Filter Oli
        quantity: 10,
        price: 25000,
        discount: 0,
        subtotal: 250000,
      },
      {
        transactionId: purchase2.id,
        productId: products[4].id, // Spion
        quantity: 10,
        price: 35000,
        discount: 0,
        subtotal: 350000,
      },
    ],
  })

  console.log('✅ Created 2 purchase transactions')

  // Create sales transactions (Penjualan ke customer)
  console.log('💰 Creating sales transactions...')
  
  // Sales 1 - LUNAS (Cash)
  await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-SAL-001',
      type: 'PENJUALAN',
      date: new Date('2026-01-13'),
      customerId: customers[0].id,
      subtotal: 530000,
      discount: 30000,
      tax: 0,
      total: 500000,
      paymentMethod: 'CASH',
      paymentStatus: 'LUNAS',
      paidAmount: 500000,
      items: {
        create: [
          {
            productId: products[0].id, // Oli
            quantity: 3,
            price: 120000,
            discount: 10000,
            subtotal: 350000,
          },
          {
            productId: products[7].id, // Service
            quantity: 1,
            price: 150000,
            discount: 0,
            subtotal: 150000,
          },
        ],
      },
    },
  })

  // Sales 2 - BELUM LUNAS (Credit)
  const sales2 = await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-SAL-002',
      type: 'PENJUALAN',
      date: new Date('2026-01-14'),
      customerId: customers[1].id, // PT Transportasi Jaya
      subtotal: 1600000,
      discount: 0,
      tax: 160000,
      total: 1760000,
      paymentMethod: 'CREDIT',
      paymentStatus: 'BELUM_LUNAS',
      paidAmount: 0,
    },
  })

  await prisma.receivable.create({
    data: {
      customerId: customers[1].id,
      amount: 1760000,
      paidAmount: 0,
      remaining: 1760000,
      dueDate: new Date('2026-02-14'),
      status: 'BELUM_LUNAS',
      description: `Piutang untuk ${sales2.invoiceNumber}`,
    },
  })

  await prisma.transactionItem.createMany({
    data: [
      {
        transactionId: sales2.id,
        productId: products[3].id, // Aki
        quantity: 4,
        price: 400000,
        discount: 0,
        subtotal: 1600000,
      },
    ],
  })

  // Sales 3 - CICILAN
  const sales3 = await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-SAL-003',
      type: 'PENJUALAN',
      date: new Date('2026-01-15'),
      customerId: customers[2].id, // Siti Rahayu
      subtotal: 650000,
      discount: 50000,
      tax: 0,
      total: 600000,
      paymentMethod: 'CREDIT',
      paymentStatus: 'CICILAN',
      paidAmount: 300000,
    },
  })

  await prisma.receivable.create({
    data: {
      customerId: customers[2].id,
      amount: 600000,
      paidAmount: 300000,
      remaining: 300000,
      dueDate: new Date('2026-02-15'),
      status: 'CICILAN',
      description: `Piutang untuk ${sales3.invoiceNumber}`,
    },
  })

  await prisma.payment.create({
    data: {
      transactionId: sales3.id,
      amount: 300000,
      paymentDate: new Date('2026-01-15'),
      paymentMethod: 'CASH',
      notes: 'Pembayaran DP 50%',
    },
  })

  await prisma.transactionItem.createMany({
    data: [
      {
        transactionId: sales3.id,
        productId: products[2].id, // Ban
        quantity: 2,
        price: 280000,
        discount: 40000,
        subtotal: 520000,
      },
      {
        transactionId: sales3.id,
        productId: products[4].id, // Spion
        quantity: 2,
        price: 65000,
        discount: 10000,
        subtotal: 120000,
      },
    ],
  })

  // Sales 4 - LUNAS
  await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-SAL-004',
      type: 'PENJUALAN',
      date: new Date('2026-01-15'),
      customerId: customers[3].id, // Ahmad
      subtotal: 360000,
      discount: 10000,
      tax: 0,
      total: 350000,
      paymentMethod: 'CASH',
      paymentStatus: 'LUNAS',
      paidAmount: 350000,
      items: {
        create: [
          {
            productId: products[1].id, // Filter Oli
            quantity: 2,
            price: 45000,
            discount: 5000,
            subtotal: 85000,
          },
          {
            productId: products[5].id, // Kampas Rem
            quantity: 2,
            price: 75000,
            discount: 5000,
            subtotal: 145000,
          },
          {
            productId: products[0].id, // Oli
            quantity: 1,
            price: 120000,
            discount: 0,
            subtotal: 120000,
          },
        ],
      },
    },
  })

  // Sales 5 - LUNAS (Recent)
  await prisma.transaction.create({
    data: {
      invoiceNumber: 'INV-SAL-005',
      type: 'PENJUALAN',
      date: new Date('2026-01-16'),
      customerId: customers[4].id, // CV Logistik
      subtotal: 960000,
      discount: 60000,
      tax: 90000,
      total: 990000,
      paymentMethod: 'CASH',
      paymentStatus: 'LUNAS',
      paidAmount: 990000,
      items: {
        create: [
          {
            productId: products[6].id, // Rantai
            quantity: 3,
            price: 180000,
            discount: 30000,
            subtotal: 510000,
          },
          {
            productId: products[7].id, // Service
            quantity: 3,
            price: 150000,
            discount: 30000,
            subtotal: 420000,
          },
        ],
      },
    },
  })

  console.log('✅ Created 5 sales transactions')

  // Create expenses (Pengeluaran operasional)
  console.log('💸 Creating expenses...')
  await prisma.expense.createMany({
    data: [
      {
        date: new Date('2026-01-10'),
        category: 'Sewa Tempat',
        amount: 5000000,
        description: 'Sewa bengkel bulan Januari 2026',
      },
      {
        date: new Date('2026-01-11'),
        category: 'Gaji Karyawan',
        amount: 8000000,
        description: 'Gaji 2 mekanik dan 1 kasir',
      },
      {
        date: new Date('2026-01-12'),
        category: 'Listrik & Air',
        amount: 1200000,
        description: 'Pembayaran listrik dan air bulan Januari',
      },
      {
        date: new Date('2026-01-13'),
        category: 'Alat & Perlengkapan',
        amount: 2500000,
        description: 'Pembelian kunci dan peralatan service',
      },
      {
        date: new Date('2026-01-14'),
        category: 'Marketing',
        amount: 800000,
        description: 'Promosi Facebook & Instagram Ads',
      },
      {
        date: new Date('2026-01-15'),
        category: 'Transportasi',
        amount: 500000,
        description: 'Biaya pengiriman spare part ke customer',
      },
      {
        date: new Date('2026-01-16'),
        category: 'Konsumsi',
        amount: 300000,
        description: 'Konsumsi karyawan 1 minggu',
      },
    ],
  })
  console.log('✅ Created 7 expenses')

  // Summary
  console.log('\n📊 SEEDING SUMMARY:')
  console.log('='.repeat(50))
  console.log('✅ Categories: 6')
  console.log('✅ Products: 8')
  console.log('✅ Customers: 5 (3 UMUM, 2 PERUSAHAAN)')
  console.log('✅ Suppliers: 3')
  console.log('✅ Purchase Transactions: 2 (1 LUNAS, 1 BELUM LUNAS)')
  console.log('✅ Sales Transactions: 5 (3 LUNAS, 1 BELUM LUNAS, 1 CICILAN)')
  console.log('✅ Expenses: 7')
  console.log('✅ Receivables: 2')
  console.log('✅ Payables: 1')
  console.log('✅ Payments: 1 (cicilan)')
  console.log('='.repeat(50))
  console.log('\n🎉 Database seeded successfully with COMPLETE data!')
  console.log('\n💡 Data tersedia untuk testing:')
  console.log('   - Transaksi penjualan dengan status LUNAS, BELUM LUNAS, dan CICILAN')
  console.log('   - Transaksi pembelian dengan hutang ke supplier')
  console.log('   - Piutang dari customer perusahaan & umum')
  console.log('   - Pengeluaran operasional berbagai kategori')
  console.log('   - Dashboard akan menampilkan statistik lengkap')
  console.log('   - Semua laporan dapat di-test dengan data riil\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
