'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaFileInvoice, 
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartBar,
  FaDownload,
  FaPrint,
  FaFilter,
  FaShoppingCart,
  FaTruck,
  FaWarehouse,
  FaUsers
} from 'react-icons/fa'

type PeriodType = 'today' | 'week' | 'month' | 'year' | 'custom'

export default function ReportsPage() {
  const [period, setPeriod] = useState<PeriodType>('month')
  const [customRange, setCustomRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState({
    sales: { total: 0, count: 0, items: [] },
    purchases: { total: 0, count: 0, items: [] },
    receivables: { total: 0, paid: 0, remaining: 0, overdue: 0, count: 0 },
    payables: { total: 0, paid: 0, remaining: 0, overdue: 0, count: 0 },
    expenses: { total: 0, count: 0 },
    profit: { revenue: 0, cogs: 0, expenses: 0, gross: 0, net: 0 },
    inventory: { totalValue: 0, lowStock: 0, totalProducts: 0 },
  })

  useEffect(() => {
    fetchReports()
  }, [period, customRange])

  const getDateRange = () => {
    const now = new Date()
    let startDate = new Date()
    let endDate = new Date()

    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
      case 'custom':
        return customRange
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const dateRange = getDateRange()
      const startDateISO = new Date(dateRange.startDate).toISOString()
      const endDateISO = new Date(dateRange.endDate + 'T23:59:59').toISOString()

      // Fetch sales
      const salesRes = await fetch(`/api/transactions?type=PENJUALAN&startDate=${startDateISO}&endDate=${endDateISO}`)
      const salesData = await salesRes.json()
      const salesTotal = salesData.reduce((sum: number, t: any) => sum + t.total, 0)

      // Fetch purchases
      const purchasesRes = await fetch(`/api/transactions?type=PEMBELIAN&startDate=${startDateISO}&endDate=${endDateISO}`)
      const purchasesData = await purchasesRes.json()
      const purchasesTotal = purchasesData.reduce((sum: number, t: any) => sum + t.total, 0)

      // Fetch receivables
      const receivablesRes = await fetch('/api/receivables')
      const receivablesData = await receivablesRes.json()
      const receivablesTotal = receivablesData.reduce((sum: number, r: any) => sum + r.amount, 0)
      const receivablesPaid = receivablesData.reduce((sum: number, r: any) => sum + r.paidAmount, 0)
      const receivablesRemaining = receivablesData.filter((r: any) => r.status !== 'LUNAS').reduce((sum: number, r: any) => sum + r.remaining, 0)
      const receivablesOverdue = receivablesData.filter((r: any) => r.status !== 'LUNAS' && r.dueDate && new Date(r.dueDate) < new Date()).reduce((sum: number, r: any) => sum + r.remaining, 0)

      // Fetch payables
      const payablesRes = await fetch('/api/payables')
      const payablesData = await payablesRes.json()
      const payablesTotal = payablesData.reduce((sum: number, p: any) => sum + p.amount, 0)
      const payablesPaid = payablesData.reduce((sum: number, p: any) => sum + p.paidAmount, 0)
      const payablesRemaining = payablesData.filter((p: any) => p.status !== 'LUNAS').reduce((sum: number, p: any) => sum + p.remaining, 0)
      const payablesOverdue = payablesData.filter((p: any) => p.status !== 'LUNAS' && p.dueDate && new Date(p.dueDate) < new Date()).reduce((sum: number, p: any) => sum + p.remaining, 0)

      // Fetch expenses
      const expensesRes = await fetch('/api/expenses')
      const expensesData = await expensesRes.json()
      const expensesInRange = expensesData.filter((e: any) => {
        const expenseDate = new Date(e.date)
        return expenseDate >= new Date(startDateISO) && expenseDate <= new Date(endDateISO)
      })
      const expensesTotal = expensesInRange.reduce((sum: number, e: any) => sum + e.amount, 0)

      // Fetch products for inventory
      const productsRes = await fetch('/api/products')
      const productsData = await productsRes.json()
      const inventoryValue = productsData.reduce((sum: number, p: any) => sum + (p.price * p.stock), 0)
      const lowStockCount = productsData.filter((p: any) => p.stock <= p.minStock).length

      // Calculate profit
      const grossProfit = salesTotal - purchasesTotal
      const netProfit = grossProfit - expensesTotal

      setReports({
        sales: { total: salesTotal, count: salesData.length, items: salesData },
        purchases: { total: purchasesTotal, count: purchasesData.length, items: purchasesData },
        receivables: { 
          total: receivablesTotal, 
          paid: receivablesPaid, 
          remaining: receivablesRemaining,
          overdue: receivablesOverdue,
          count: receivablesData.length 
        },
        payables: { 
          total: payablesTotal, 
          paid: payablesPaid, 
          remaining: payablesRemaining,
          overdue: payablesOverdue,
          count: payablesData.length 
        },
        expenses: { total: expensesTotal, count: expensesInRange.length },
        profit: { 
          revenue: salesTotal, 
          cogs: purchasesTotal, 
          expenses: expensesTotal,
          gross: grossProfit, 
          net: netProfit 
        },
        inventory: { 
          totalValue: inventoryValue, 
          lowStock: lowStockCount,
          totalProducts: productsData.length
        },
      })
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return 'Hari Ini'
      case 'week': return '7 Hari Terakhir'
      case 'month': return 'Bulan Ini'
      case 'year': return 'Tahun Ini'
      case 'custom': return 'Custom Range'
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">Memuat laporan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg">
              <FaChartBar className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
              <p className="text-gray-600 mt-1">Analisis lengkap performa bisnis Anda</p>
            </div>
          </div>
        </div>

        {/* Period Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-indigo-500 text-xl" />
            <h2 className="text-lg font-bold text-gray-900">Filter Periode</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
            <button
              onClick={() => setPeriod('today')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                period === 'today'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Hari Ini
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                period === 'week'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Minggu Ini
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                period === 'month'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📆 Bulan Ini
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                period === 'year'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📈 Tahun Ini
            </button>
            <button
              onClick={() => setPeriod('custom')}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                period === 'custom'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔧 Custom
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-3 rounded-xl font-semibold bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
            >
              <FaPrint className="inline mr-2" /> Print
            </button>
          </div>

          {period === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-indigo-50 rounded-xl">
              <div>
                <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-500" />
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={customRange.startDate}
                  onChange={(e) => setCustomRange({ ...customRange, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-500" />
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={customRange.endDate}
                  onChange={(e) => setCustomRange({ ...customRange, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
            <p className="text-sm font-medium text-indigo-900">
              Periode: <span className="font-bold">{getPeriodLabel()}</span>
              {period === 'custom' && ` (${customRange.startDate} - ${customRange.endDate})`}
            </p>
          </div>
        </div>

        {/* Profit & Loss Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <FaBalanceScale className="text-2xl text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Laporan Laba Rugi</h2>
                <p className="text-sm text-gray-600">Profit & Loss Statement</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-6 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <FaArrowUp className="text-3xl opacity-80" />
                <div className="text-right">
                  <p className="text-xs opacity-75">Revenue</p>
                </div>
              </div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Pendapatan</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(reports.profit.revenue)}</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-400 to-indigo-600 text-white rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <FaArrowDown className="text-3xl opacity-80" />
                <div className="text-right">
                  <p className="text-xs opacity-75">Costs</p>
                </div>
              </div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Biaya</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(reports.profit.cogs + reports.profit.expenses)}</p>
            </div>

            <div className={`p-6 rounded-2xl shadow-lg text-white ${
              reports.profit.net >= 0 
                ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                : 'bg-gradient-to-br from-red-500 to-orange-600'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <FaBalanceScale className="text-3xl opacity-80" />
                <div className="text-right">
                  <p className="text-xs opacity-75">Net Profit</p>
                </div>
              </div>
              <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Laba Bersih</h3>
              <p className="text-3xl font-bold mt-2">{formatCurrency(reports.profit.net)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Detail Perhitungan</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-gray-700 font-medium">Penjualan (Revenue)</span>
                <span className="text-green-600 font-bold">{formatCurrency(reports.profit.revenue)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-gray-700 font-medium">Pembelian (COGS)</span>
                <span className="text-blue-600 font-bold">- {formatCurrency(reports.profit.cogs)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                <span className="text-gray-800 font-bold">Laba Kotor (Gross Profit)</span>
                <span className="text-green-700 font-bold text-lg">{formatCurrency(reports.profit.gross)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="text-gray-700 font-medium">Pengeluaran Lain (Expenses)</span>
                <span className="text-red-600 font-bold">- {formatCurrency(reports.profit.expenses)}</span>
              </div>
              <div className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                reports.profit.net >= 0 
                  ? 'bg-purple-50 border-purple-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <span className="text-gray-800 font-bold text-lg">Laba Bersih (Net Profit)</span>
                <span className={`font-bold text-2xl ${reports.profit.net >= 0 ? 'text-purple-700' : 'text-red-700'}`}>
                  {formatCurrency(reports.profit.net)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales & Purchases Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Penjualan</h3>
                  <p className="text-sm opacity-90 mt-1">{getPeriodLabel()}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaShoppingCart className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(reports.sales.total)}</p>
                <p className="text-sm text-gray-500 mt-1">{reports.sales.count} transaksi</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FaCheckCircle className="text-green-500" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Total Revenue</p>
                  <p className="text-xs text-green-600">Dari semua transaksi penjualan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Pembelian</h3>
                  <p className="text-sm opacity-90 mt-1">{getPeriodLabel()}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaTruck className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(reports.purchases.total)}</p>
                <p className="text-sm text-gray-500 mt-1">{reports.purchases.count} transaksi</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <FaWarehouse className="text-blue-500" />
                <div>
                  <p className="text-sm font-semibold text-blue-700">Total Procurement</p>
                  <p className="text-xs text-blue-600">Untuk persediaan barang</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Receivables & Payables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Piutang</h3>
                  <p className="text-sm opacity-90 mt-1">Accounts Receivable</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaMoneyBillWave className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Piutang</span>
                  <span className="font-bold text-gray-900">{formatCurrency(reports.receivables.total)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">Sudah Dibayar</span>
                  <span className="font-bold text-green-700">{formatCurrency(reports.receivables.paid)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-yellow-700">Belum Dibayar</span>
                  <span className="font-bold text-yellow-700">{formatCurrency(reports.receivables.remaining)}</span>
                </div>
                {reports.receivables.overdue > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <FaExclamationTriangle className="text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-700">Jatuh Tempo</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(reports.receivables.overdue)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Hutang</h3>
                  <p className="text-sm opacity-90 mt-1">Accounts Payable</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaMoneyBillWave className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Hutang</span>
                  <span className="font-bold text-gray-900">{formatCurrency(reports.payables.total)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-green-700">Sudah Dibayar</span>
                  <span className="font-bold text-green-700">{formatCurrency(reports.payables.paid)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm text-orange-700">Belum Dibayar</span>
                  <span className="font-bold text-orange-700">{formatCurrency(reports.payables.remaining)}</span>
                </div>
                {reports.payables.overdue > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <FaExclamationTriangle className="text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-700">Jatuh Tempo</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(reports.payables.overdue)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expenses & Inventory Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-400 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Pengeluaran</h3>
                  <p className="text-sm opacity-90 mt-1">{getPeriodLabel()}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaMoneyBillWave className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(reports.expenses.total)}</p>
                <p className="text-sm text-gray-500 mt-1">{reports.expenses.count} pengeluaran tercatat</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FaArrowDown className="text-red-500" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Operational Expenses</p>
                  <p className="text-xs text-red-600">Biaya operasional dan lainnya</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Inventory</h3>
                  <p className="text-sm opacity-90 mt-1">Nilai Persediaan</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaWarehouse className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(reports.inventory.totalValue)}</p>
                <p className="text-sm text-gray-500 mt-1">{reports.inventory.totalProducts} produk</p>
              </div>
              {reports.inventory.lowStock > 0 && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <FaExclamationTriangle className="text-yellow-500" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-700">Stok Menipis</p>
                    <p className="text-xs text-yellow-600">{reports.inventory.lowStock} produk perlu restock</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Ringkasan Periode {getPeriodLabel()}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{reports.sales.count}</div>
              <div className="text-sm opacity-90">Transaksi Penjualan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{reports.purchases.count}</div>
              <div className="text-sm opacity-90">Transaksi Pembelian</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{reports.receivables.count}</div>
              <div className="text-sm opacity-90">Total Piutang</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{reports.payables.count}</div>
              <div className="text-sm opacity-90">Total Hutang</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
