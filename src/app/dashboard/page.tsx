'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/Card'
import { FaBox, FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, FaExclamationTriangle, FaCheckCircle, FaArrowUp, FaArrowDown, FaClock, FaTruck, FaWarehouse, FaFileInvoiceDollar } from 'react-icons/fa'
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    todaySales: 0,
    monthlySales: 0,
    todayPurchases: 0,
    monthlyPurchases: 0,
    totalReceivables: 0,
    totalPayables: 0,
    overdueReceivables: 0,
    overduePayables: 0,
    totalExpenses: 0,
    monthlyExpenses: 0,
    profitMargin: 0,
    totalTransactions: 0,
    completedTransactions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentTransactions, setRecentTransactions] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch products
      const productsRes = await fetch('/api/products')
      const products = await productsRes.json()
      const lowStock = products.filter((p: any) => p.stock <= p.minStock).length

      // Fetch customers
      const customersRes = await fetch('/api/customers')
      const customers = await customersRes.json()

      // Fetch suppliers
      const suppliersRes = await fetch('/api/suppliers')
      const suppliers = await suppliersRes.json()

      // Date ranges
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      // Fetch today's sales
      const todaySalesRes = await fetch(
        `/api/transactions?type=PENJUALAN&startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`
      )
      const todaySalesData = await todaySalesRes.json()
      const todayTotal = Array.isArray(todaySalesData) ? todaySalesData.reduce((sum: number, t: any) => sum + t.total, 0) : 0

      // Fetch monthly sales
      const monthlySalesRes = await fetch(
        `/api/transactions?type=PENJUALAN&startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`
      )
      const monthlySalesData = await monthlySalesRes.json()
      const monthlyTotal = Array.isArray(monthlySalesData) ? monthlySalesData.reduce((sum: number, t: any) => sum + t.total, 0) : 0

      // Fetch today's purchases
      const todayPurchasesRes = await fetch(
        `/api/transactions?type=PEMBELIAN&startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`
      )
      const todayPurchasesData = await todayPurchasesRes.json()
      const todayPurchases = Array.isArray(todayPurchasesData) ? todayPurchasesData.reduce((sum: number, t: any) => sum + t.total, 0) : 0

      // Fetch monthly purchases
      const monthlyPurchasesRes = await fetch(
        `/api/transactions?type=PEMBELIAN&startDate=${firstDay.toISOString()}&endDate=${lastDay.toISOString()}`
      )
      const monthlyPurchasesData = await monthlyPurchasesRes.json()
      const monthlyPurchases = Array.isArray(monthlyPurchasesData) ? monthlyPurchasesData.reduce((sum: number, t: any) => sum + t.total, 0) : 0

      // Fetch all receivables
      const receivablesRes = await fetch('/api/receivables')
      const allReceivables = await receivablesRes.json()
      const totalReceivables = allReceivables
        .filter((r: any) => r.status !== 'LUNAS')
        .reduce((sum: number, r: any) => sum + r.remaining, 0)
      const overdueReceivables = allReceivables
        .filter((r: any) => r.status !== 'LUNAS' && r.dueDate && new Date(r.dueDate) < new Date())
        .reduce((sum: number, r: any) => sum + r.remaining, 0)

      // Fetch all payables
      const payablesRes = await fetch('/api/payables')
      const allPayables = await payablesRes.json()
      const totalPayables = allPayables
        .filter((p: any) => p.status !== 'LUNAS')
        .reduce((sum: number, p: any) => sum + p.remaining, 0)
      const overduePayables = allPayables
        .filter((p: any) => p.status !== 'LUNAS' && p.dueDate && new Date(p.dueDate) < new Date())
        .reduce((sum: number, p: any) => sum + p.remaining, 0)

      // Fetch expenses
      const expensesRes = await fetch('/api/expenses')
      const expenses = await expensesRes.json()
      const totalExpenses = Array.isArray(expenses) ? expenses.reduce((sum: number, e: any) => sum + e.amount, 0) : 0
      const monthlyExpenses = Array.isArray(expenses) 
        ? expenses
            .filter((e: any) => {
              const expenseDate = new Date(e.date)
              return expenseDate >= firstDay && expenseDate <= lastDay
            })
            .reduce((sum: number, e: any) => sum + e.amount, 0)
        : 0

      // Fetch all transactions
      const transactionsRes = await fetch('/api/transactions')
      const transactions = await transactionsRes.json()
      const totalTransactions = transactions.length
      const completedTransactions = transactions.filter((t: any) => t.status === 'COMPLETED').length

      // Calculate profit margin (sales - purchases - expenses)
      const profitMargin = monthlyTotal - monthlyPurchases - monthlyExpenses

      // Fetch recent transactions
      const recentData = transactions.slice(0, 8)

      setStats({
        totalProducts: products.length,
        lowStockProducts: lowStock,
        totalCustomers: customers.length,
        totalSuppliers: suppliers.length,
        todaySales: todayTotal,
        monthlySales: monthlyTotal,
        todayPurchases,
        monthlyPurchases,
        totalReceivables,
        totalPayables,
        overdueReceivables,
        overduePayables,
        totalExpenses,
        monthlyExpenses,
        profitMargin,
        totalTransactions,
        completedTransactions,
      })
      setRecentTransactions(recentData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 font-medium">Memuat dashboard...</p>
      </div>
    )
  }

  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container-responsive py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
              <FaChartLine className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Sistem Bengkel</h1>
              <p className="text-gray-600 mt-1">Ringkasan aktivitas dan performa bisnis Anda</p>
            </div>
          </div>
        </div>

        {/* Quick Stats - Revenue & Profit */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today Sales */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaArrowUp className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Hari Ini</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Penjualan</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.todaySales)}</p>
            <div className="mt-4 text-xs opacity-75">Target harian tercapai</div>
          </div>

          {/* Today Purchases */}
          <div className="bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaArrowDown className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Hari Ini</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Pembelian</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.todayPurchases)}</p>
            <div className="mt-4 text-xs opacity-75">Stok barang bertambah</div>
          </div>

          {/* Monthly Profit */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaChartLine className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">{currentMonth}</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Laba Bersih</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.profitMargin)}</p>
            <div className="mt-4 text-xs opacity-75">
              {stats.profitMargin >= 0 ? '✓ Positif' : '⚠ Negatif'}
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-orange-400 to-red-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaFileInvoiceDollar className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs opacity-75">Total</p>
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Transaksi</h3>
            <p className="text-3xl font-bold mt-2">{stats.totalTransactions}</p>
            <div className="mt-4 text-xs opacity-75">{stats.completedTransactions} selesai</div>
          </div>
        </div>

        {/* Monthly Revenue Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaMoneyBillWave className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Penjualan Bulanan</p>
                <p className="text-xs text-gray-500">{currentMonth}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlySales)}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Revenue dari transaksi penjualan</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaTruck className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pembelian Bulanan</p>
                <p className="text-xs text-gray-500">{currentMonth}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyPurchases)}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Pengeluaran untuk stok barang</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaMoneyBillWave className="text-2xl text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pengeluaran Lain</p>
                <p className="text-xs text-gray-500">{currentMonth}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyExpenses)}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Biaya operasional dan lainnya</p>
            </div>
          </div>
        </div>

        {/* Receivables & Payables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Piutang (Receivables)</h3>
                  <p className="text-sm opacity-90 mt-1">Tagihan yang belum dibayar customer</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaMoneyBillWave className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalReceivables)}</p>
                <p className="text-sm text-gray-500 mt-1">Total piutang belum lunas</p>
              </div>
              {stats.overdueReceivables > 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <FaExclamationTriangle className="text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Jatuh Tempo</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(stats.overdueReceivables)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-red-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Hutang (Payables)</h3>
                  <p className="text-sm opacity-90 mt-1">Tagihan yang harus dibayar ke supplier</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FaMoneyBillWave className="text-2xl" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalPayables)}</p>
                <p className="text-sm text-gray-500 mt-1">Total hutang belum lunas</p>
              </div>
              {stats.overduePayables > 0 && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <FaExclamationTriangle className="text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-red-700">Jatuh Tempo</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(stats.overduePayables)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory & Partners Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FaWarehouse className="text-2xl text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Produk</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
            {stats.lowStockProducts > 0 && (
              <div className="mt-3 flex items-center gap-2 text-yellow-600">
                <FaExclamationTriangle className="text-sm" />
                <p className="text-xs font-medium">{stats.lowStockProducts} stok menipis</p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaUsers className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Customer</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            <p className="text-xs text-gray-500 mt-3">Total pelanggan terdaftar</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaTruck className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Supplier</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSuppliers}</p>
            <p className="text-xs text-gray-500 mt-3">Mitra penyedia barang</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaClock className="text-2xl" />
              </div>
              <div>
                <p className="text-sm font-semibold opacity-90">Status</p>
              </div>
            </div>
            <p className="text-3xl font-bold">Online</p>
            <p className="text-xs opacity-75 mt-3">Sistem berjalan normal</p>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Transaksi Terbaru</h2>
                <p className="text-sm opacity-90 mt-1">8 transaksi terakhir yang tercatat</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaFileInvoiceDollar className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Customer/Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction: any) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{transaction.invoiceNumber}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.type === 'PENJUALAN' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type === 'PENJUALAN' ? '📈 Penjualan' : '📦 Pembelian'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-medium">
                          {transaction.customer?.name || transaction.supplier?.name || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(transaction.total)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{transaction.paymentMethod}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.paymentStatus === 'LUNAS'
                              ? 'bg-green-100 text-green-800'
                              : transaction.paymentStatus === 'DP'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.paymentStatus === 'LUNAS' && '✓ '}
                            {transaction.paymentStatus}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="inline-block p-4 bg-gray-100 rounded-full mb-3">
                        <FaFileInvoiceDollar className="text-3xl text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada transaksi</p>
                      <p className="text-gray-400 text-sm mt-1">Transaksi akan muncul setelah ada aktivitas</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
