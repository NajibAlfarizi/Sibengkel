'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FaMoneyBillWave, FaCalendarAlt, FaPrint, FaDownload, FaChartPie, FaReceipt, FaPercentage } from 'react-icons/fa'

export default function ExpensesReportPage() {
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
        `/api/reports/expenses?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat laporan pengeluaran...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaMoneyBillWave className="text-red-600" />
              Laporan Pengeluaran
            </h1>
            <p className="text-gray-600">Analisis lengkap pengeluaran operasional bisnis</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-colors shadow-md flex items-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <FaCalendarAlt className="text-red-600" />
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Total Pengeluaran</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(report?.summary?.totalExpenses || 0)}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaReceipt className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Total Transaksi</p>
              <p className="text-3xl font-bold mt-1">{report?.summary?.totalTransactions || 0}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <FaChartPie className="text-3xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold opacity-90">Rata-rata Pengeluaran</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(report?.summary?.averageExpense || 0)}</p>
            </div>
          </div>
          <div className="bg-white/10 h-1 rounded-full"></div>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-red-100">
        <div className="flex items-center gap-2 mb-6">
          <FaChartPie className="text-red-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Pengeluaran per Kategori</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Jumlah Transaksi
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.expensesByCategory?.length > 0 ? (
                report.expensesByCategory.map((item: any, index: number) => {
                  const percentage = report?.summary?.totalExpenses > 0
                    ? ((item.total / report.summary.totalExpenses) * 100).toFixed(2)
                    : 0
                  return (
                    <tr 
                      key={index} 
                      className="hover:bg-red-50 transition-colors duration-200 hover:shadow-md"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                          {item.count} transaksi
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-red-600">{formatCurrency(item.total)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FaPercentage className="text-purple-600" />
                          <span className="text-sm font-bold text-purple-600">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data pengeluaran per kategori
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-red-100">
        <div className="flex items-center gap-2 mb-6">
          <FaReceipt className="text-purple-600 text-xl" />
          <h2 className="text-2xl font-bold text-gray-900">Riwayat Pengeluaran</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                  Keterangan
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                  Jumlah
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {report?.expenses?.length > 0 ? (
                report.expenses.map((expense: any) => (
                  <tr 
                    key={expense.id} 
                    className="hover:bg-purple-50 transition-colors duration-200 hover:shadow-md"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-700">
                        {new Date(expense.date).toLocaleDateString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{expense.description || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-red-600">{formatCurrency(expense.amount)}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Tidak ada riwayat pengeluaran
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


