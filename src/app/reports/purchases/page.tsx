'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FaShoppingCart, FaFileInvoice, FaTruck, FaCalendarAlt, FaPrint, FaDownload, FaChartBar, FaBox } from 'react-icons/fa'

export default function PurchasesReportPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchReport()
  }, [dateRange])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/reports/purchases?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      )
      const data = await res.json()
      setReport(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat laporan pembelian...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaShoppingCart className="text-orange-600" />
              Laporan Pembelian
            </h1>
            <p className="text-gray-600">Analisis lengkap transaksi pembelian dari supplier</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors shadow-md flex items-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendarAlt className="text-orange-600" />
          <h2 className="text-lg font-bold text-gray-900">Filter Periode</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Akhir
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaShoppingCart className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Total Pembelian</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(report?.summary?.totalPurchases || 0)}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaFileInvoice className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Total Transaksi</p>
              <p className="text-3xl font-bold mt-1">{report?.summary?.totalTransactions || 0}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaChartBar className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Rata-rata Transaksi</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(report?.summary?.averageTransaction || 0)}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>
      </div>

      {/* Purchases by Supplier */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-orange-100">
        <div className="flex items-center gap-2 mb-6">
          <FaTruck className="text-orange-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Pembelian per Supplier</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Jumlah Transaksi
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Total Pembelian
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.purchasesBySupplier?.length > 0 ? (
                report.purchasesBySupplier.map((item: any, index: number) => (
                  <tr 
                    key={index} 
                    className="hover:bg-orange-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-orange-600" />
                        <span className="text-sm font-bold text-gray-900">{item.supplier?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {item.count} transaksi
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-orange-600">{formatCurrency(item.total)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data pembelian per supplier
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purchases by Category */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-100">
        <div className="flex items-center gap-2 mb-6">
          <FaBox className="text-purple-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Pembelian per Kategori</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Jumlah Item
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Total Pembelian
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.purchasesByCategory?.length > 0 ? (
                report.purchasesByCategory.map((item: any, index: number) => (
                  <tr 
                    key={index} 
                    className="hover:bg-purple-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">{item.quantity} unit</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-purple-600">{formatCurrency(item.total)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data pembelian per kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
