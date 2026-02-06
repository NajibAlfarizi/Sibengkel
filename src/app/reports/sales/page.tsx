'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FaChartLine, FaFileInvoice, FaMoneyBillWave, FaCalendarAlt, FaTrophy, FaShoppingCart, FaPrint, FaDownload } from 'react-icons/fa'

export default function SalesReportPage() {
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
        `/api/reports/sales?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat laporan penjualan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaShoppingCart className="text-green-600" />
              Laporan Penjualan
            </h1>
            <p className="text-gray-600">Analisis lengkap transaksi penjualan periode tertentu</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md flex items-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendarAlt className="text-green-600" />
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Total Penjualan</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(report?.summary?.totalSales || 0)}</p>
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
              <FaChartLine className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Rata-rata Transaksi</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(report?.summary?.averageTransaction || 0)}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>
      </div>

      {/* Sales by Category */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-green-100">
        <div className="flex items-center gap-2 mb-6">
          <FaChartLine className="text-green-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Penjualan per Kategori</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Jumlah Item
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Total Penjualan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.salesByCategory?.length > 0 ? (
                report.salesByCategory.map((item: any, index: number) => (
                  <tr 
                    key={index} 
                    className="hover:bg-green-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(item.total)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data penjualan per kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-green-100">
        <div className="flex items-center gap-2 mb-6">
          <FaTrophy className="text-yellow-500 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Produk Terlaris</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Ranking
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Produk
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Jumlah Terjual
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.topProducts?.length > 0 ? (
                report.topProducts.map((item: any, index: number) => (
                  <tr 
                    key={index} 
                    className="hover:bg-yellow-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {index < 3 ? (
                          <FaTrophy className={`${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'}`} />
                        ) : (
                          <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">{item.product.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {item.totalQuantity} unit
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(item.totalRevenue)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data produk terlaris
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
