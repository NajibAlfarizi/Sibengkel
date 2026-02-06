import Link from 'next/link'
import { FaChartLine, FaBox, FaUsers, FaTruck, FaFileInvoice, FaMoneyBillWave, FaHome } from 'react-icons/fa'

export default function Home() {
  const menuItems = [
    { title: 'Dashboard', icon: FaHome, href: '/dashboard', color: 'bg-blue-500' },
    { title: 'Transaksi', icon: FaFileInvoice, href: '/transactions', color: 'bg-green-500' },
    { title: 'Produk', icon: FaBox, href: '/products', color: 'bg-purple-500' },
    { title: 'Customer', icon: FaUsers, href: '/customers', color: 'bg-yellow-500' },
    { title: 'Supplier', icon: FaTruck, href: '/suppliers', color: 'bg-red-500' },
    { title: 'Laporan', icon: FaChartLine, href: '/reports', color: 'bg-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Sistem Informasi Bengkel
          </h1>
          <p className="text-xl text-gray-600">
            Manajemen bengkel yang efisien dan terintegrasi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`${item.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  Kelola {item.title.toLowerCase()} dengan mudah
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Fitur Lengkap
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div className="text-gray-700">Transaksi Cash & Credit</div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div className="text-gray-700">Manajemen Stok</div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div className="text-gray-700">Customer Umum & Perusahaan</div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div className="text-gray-700">Hutang Piutang</div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div className="text-gray-700">Laporan Lengkap</div>
              </div>
              <div className="flex items-start">
                <div className="text-green-500 mr-2">✓</div>
                <div className="text-gray-700">History Transaksi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
