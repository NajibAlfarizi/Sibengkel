'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaFileInvoice, FaBox, FaUsers, FaTruck, FaChartLine, FaMoneyBillWave, FaShoppingCart, FaFolder, FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { title: 'Home', icon: FaHome, href: '/' },
    { title: 'Dashboard', icon: FaChartLine, href: '/dashboard' },
    { 
      title: 'Master Data',
      icon: FaFolder,
      subItems: [
        { title: 'Kategori', icon: FaFolder, href: '/categories' },
        { title: 'Produk', icon: FaBox, href: '/products' },
        { title: 'Customer', icon: FaUsers, href: '/customers' },
        { title: 'Supplier', icon: FaTruck, href: '/suppliers' },
      ]
    },
    { 
      title: 'Transaksi',
      icon: FaFileInvoice,
      subItems: [
        { title: 'Penjualan', icon: FaShoppingCart, href: '/transactions/sales' },
        { title: 'Pembelian', icon: FaShoppingCart, href: '/transactions/purchases' },
        { title: 'Pengeluaran', icon: FaMoneyBillWave, href: '/expenses' },
      ]
    },
    { 
      title: 'Hutang Piutang',
      icon: FaMoneyBillWave,
      subItems: [
        { title: 'Piutang', icon: FaMoneyBillWave, href: '/receivables' },
        { title: 'Hutang', icon: FaMoneyBillWave, href: '/payables' },
      ]
    },
    { 
      title: 'Laporan',
      icon: FaChartLine,
      subItems: [
        { title: 'Laporan Utama', href: '/reports' },
        { title: 'Laporan Penjualan', href: '/reports/sales' },
        { title: 'Laporan Pembelian', href: '/reports/purchases' },
        { title: 'Laporan Pengeluaran', href: '/reports/expenses' },
        { title: 'Laporan Stok', href: '/reports/stock' },
        { title: 'Laporan Hutang Piutang', href: '/reports/debts' },
        { title: 'Laporan Laba Rugi', href: '/reports/profit' },
      ]
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-40
          bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${isMobileOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0'}
        `}
      >
        <div className={`p-6 border-b border-gray-700 flex items-center justify-between ${isCollapsed ? 'lg:flex-col lg:p-4' : ''}`}>
          <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
            <h1 className="text-xl font-bold">Sistem Bengkel</h1>
            <p className="text-xs text-gray-400 mt-1">Management System</p>
          </div>
          {isCollapsed && (
            <div className="hidden lg:block text-center">
              <h1 className="text-2xl font-bold">SB</h1>
            </div>
          )}
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaBars size={16} />
          </button>
        </div>
        
        <nav className="p-4 overflow-y-auto h-[calc(100vh-88px)]">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.title}>
                {item.subItems ? (
                  <details className="group">
                    <summary className={`flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors ${isCollapsed ? 'lg:justify-center' : ''}`}>
                      <item.icon className={`${isCollapsed ? 'lg:mr-0' : 'mr-3'}`} />
                      <span className={`flex-1 ${isCollapsed ? 'lg:hidden' : ''}`}>{item.title}</span>
                      <span className={`transform group-open:rotate-90 transition-transform ${isCollapsed ? 'lg:hidden' : ''}`}>›</span>
                    </summary>
                    <ul className={`ml-4 mt-2 space-y-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                              pathname === subItem.href
                                ? 'bg-blue-600 text-white'
                                : 'hover:bg-gray-700'
                            }`}
                          >
                            {'icon' in subItem && subItem.icon && <subItem.icon className="mr-3 text-sm" />}
                            <span className="text-sm">{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700'
                    } ${isCollapsed ? 'lg:justify-center' : ''}`}
                  >
                    <item.icon className={`${isCollapsed ? 'lg:mr-0' : 'mr-3'}`} />
                    <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>{item.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
