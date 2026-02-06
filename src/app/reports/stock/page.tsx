'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FaBox, FaExclamationTriangle, FaChartBar, FaPrint, FaDownload, FaWarehouse, FaBoxes } from 'react-icons/fa'

export default function StockReportPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reports/stock')
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat laporan stok...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaWarehouse className="text-blue-600" />
              Laporan Stok
            </h1>
            <p className="text-gray-600">Monitoring dan analisis inventory produk secara real-time</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md flex items-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaBox className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Total Produk</p>
              <p className="text-3xl font-bold mt-1">{report?.summary?.totalProducts || 0}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Stok Menipis</p>
              <p className="text-3xl font-bold mt-1">{report?.summary?.lowStockProducts || 0}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Stok Habis</p>
              <p className="text-3xl font-bold mt-1">{report?.summary?.outOfStockProducts || 0}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaChartBar className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Nilai Stok</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(report?.summary?.totalStockValue || 0)}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>
      </div>

      {/* Low Stock Products */}
      {report?.lowStockProducts && report.lowStockProducts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-yellow-100">
          <div className="flex items-center gap-2 mb-6">
            <FaExclamationTriangle className="text-yellow-600 text-xl" />
            <h2 className="text-2xl font-bold text-gray-900">Produk Stok Menipis</h2>
            <span className="ml-auto px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
              {report.lowStockProducts.length} item
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                    Produk
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Stok Saat Ini
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                    Min. Stok
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report.lowStockProducts.map((product: any) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-yellow-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{product.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-yellow-600">{product.stock} unit</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">{product.minStock} unit</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock by Category */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
        <div className="flex items-center gap-2 mb-6">
          <FaBoxes className="text-blue-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Stok per Kategori</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Jumlah Produk
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Total Stok
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Nilai Inventory
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.stockByCategory?.length > 0 ? (
                report.stockByCategory.map((item: any, index: number) => (
                  <tr 
                    key={index} 
                    className="hover:bg-blue-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                        {item.totalProducts} produk
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-blue-600">{item.totalStock} unit</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">{formatCurrency(item.totalValue)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data stok per kategori
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
