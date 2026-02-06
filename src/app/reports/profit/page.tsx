'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FaChartLine, FaMoneyBillWave, FaCalendarAlt, FaPrint, FaDownload, FaArrowUp, FaArrowDown, FaBalanceScale } from 'react-icons/fa'

export default function ProfitReportPage() {
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
        `/api/reports/profit?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat laporan laba rugi...</p>
        </div>
      </div>
    )
  }

  const isProfit = (report?.profit?.net || 0) >= 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaBalanceScale className="text-emerald-600" />
              Laporan Laba Rugi
            </h1>
            <p className="text-gray-600">Analisis profitabilitas dan performa keuangan bisnis</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors shadow-md flex items-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-emerald-100">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendarAlt className="text-emerald-600" />
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <FaChartLine className="text-4xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Laba Kotor</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(report?.profit?.gross || 0)}</p>
              <p className="text-xs opacity-80 mt-1">Margin: {(report?.profit?.grossMargin || 0).toFixed(2)}%</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className={`bg-gradient-to-br ${isProfit ? 'from-blue-500 to-indigo-600' : 'from-red-500 to-pink-600'} rounded-2xl shadow-xl p-8 text-white transform hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <FaMoneyBillWave className="text-4xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Laba Bersih</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(report?.profit?.net || 0)}</p>
              <p className="text-xs opacity-80 mt-1">Margin: {(report?.profit?.netMargin || 0).toFixed(2)}%</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100">
        <div className="flex items-center gap-2 mb-8">
          <FaBalanceScale className="text-emerald-600 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900">Rincian Laba Rugi</h2>
        </div>
        
        <div className="space-y-6">
          {/* Revenue */}
          <div className="border-b-2 border-emerald-100 pb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <FaArrowUp className="text-green-600 text-xl" />
                <span className="font-bold text-xl text-gray-900">Pendapatan</span>
              </div>
              <span className="font-bold text-2xl text-green-600">
                {formatCurrency(report?.revenue?.total || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 pl-9">
              <span>Jumlah Transaksi Penjualan</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                {report?.revenue?.transactionCount || 0} transaksi
              </span>
            </div>
          </div>

          {/* COGS */}
          <div className="border-b-2 border-red-100 pb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <FaArrowDown className="text-red-600 text-xl" />
                <span className="font-bold text-xl text-gray-900">Harga Pokok Penjualan (HPP)</span>
              </div>
              <span className="font-bold text-2xl text-red-600">
                ({formatCurrency(report?.cogs?.total || 0)})
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 pl-9">
              <span>Jumlah Pembelian</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                {report?.cogs?.transactionCount || 0} transaksi
              </span>
            </div>
          </div>

          {/* Gross Profit */}
          <div className="border-b-2 border-blue-100 pb-6 bg-blue-50/50 -mx-8 px-8 py-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-bold text-2xl text-gray-900">Laba Kotor</span>
              <span className="font-bold text-3xl text-blue-600">
                {formatCurrency(report?.profit?.gross || 0)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Margin Laba Kotor: <span className="font-bold">{(report?.profit?.grossMargin || 0).toFixed(2)}%</span>
            </div>
          </div>

          {/* Operating Expenses */}
          <div className="border-b-2 border-orange-100 pb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <FaArrowDown className="text-orange-600 text-xl" />
                <span className="font-bold text-xl text-gray-900">Biaya Operasional</span>
              </div>
              <span className="font-bold text-2xl text-orange-600">
                ({formatCurrency(report?.expenses?.total || 0)})
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 pl-9">
              <span>Jumlah Pengeluaran</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
                {report?.expenses?.transactionCount || 0} transaksi
              </span>
            </div>
          </div>

          {/* Net Profit */}
          <div className={`${isProfit ? 'bg-green-50/50' : 'bg-red-50/50'} -mx-8 px-8 py-6 rounded-lg`}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-3xl text-gray-900">Laba Bersih</span>
              <span className={`font-bold text-4xl ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(report?.profit?.net || 0)}
              </span>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Margin Laba Bersih: <span className="font-bold">{(report?.profit?.netMargin || 0).toFixed(2)}%</span>
              </div>
              {isProfit ? (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold flex items-center gap-2">
                  <FaArrowUp /> Untung
                </span>
              ) : (
                <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold flex items-center gap-2">
                  <FaArrowDown /> Rugi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
