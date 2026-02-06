'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Table from '@/components/Table'
import Card from '@/components/Card'
import Pagination from '@/components/Pagination'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { FaPlus, FaEye, FaSearch, FaFilter, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PurchasesPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [todayStats, setTodayStats] = useState({
    count: 0,
    total: 0,
    lunas: 0,
    cicilan: 0,
  })

  useEffect(() => {
    fetchTransactions()
  }, [statusFilter, startDate, endDate])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      let url = '/api/transactions?type=PEMBELIAN'
      if (statusFilter !== 'ALL') {
        url += `&status=${statusFilter}`
      }
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`
      }
      
      const res = await fetch(url)
      const data = await res.json()
      setTransactions(data)

      // Hitung transaksi hari ini
      const today = new Date()
      const todayDateString = today.toISOString().split('T')[0] // YYYY-MM-DD

      const todayTransactions = data.filter((t: any) => {
        const transDateString = new Date(t.date).toISOString().split('T')[0]
        return transDateString === todayDateString
      })

      const totalPaid = todayTransactions.reduce((sum: number, t: any) => sum + (t.paidAmount || 0), 0)
      const totalRemaining = todayTransactions.reduce((sum: number, t: any) => sum + (t.remainingAmount || 0), 0)

      setTodayStats({
        count: todayTransactions.length,
        total: todayTransactions.reduce((sum: number, t: any) => sum + t.total, 0),
        lunas: totalPaid,
        cicilan: totalRemaining,
      })
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter berdasarkan search term
  const filteredTransactions = transactions.filter((transaction: any) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      transaction.invoiceNumber.toLowerCase().includes(searchLower) ||
      transaction.supplier?.name?.toLowerCase().includes(searchLower) ||
      ''
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, startDate, endDate])

  const columns = [
    { 
      key: 'invoiceNumber', 
      label: 'No. Invoice',
    },
    {
      key: 'date',
      label: 'Tanggal',
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (_: any, row: any) => row.supplier?.name || '-',
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'LUNAS'
            ? 'bg-green-100 text-green-800'
            : value === 'CICILAN'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: any) => (
        <Link
          href={`/transactions/${row.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaEye className="inline" />
        </Link>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transaksi Pembelian</h1>
        <Link href="/transactions/purchases/new">
          <Button>
            <FaPlus className="inline mr-2" />
            Transaksi Baru
          </Button>
        </Link>
      </div>

      {/* Statistik Hari Ini */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card
          title="Transaksi Hari Ini"
          value={`${todayStats.count} Transaksi`}
          icon={<FaShoppingCart />}
          color="purple"
          subtitle={new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        />
        <Card
          title="Total Pembelian Hari Ini"
          value={formatCurrency(todayStats.total)}
          icon={<FaMoneyBillWave />}
          color="blue"
          subtitle="Otomatis reset setiap hari"
        />
        <Card
          title="Pembayaran Lunas"
          value={formatCurrency(todayStats.lunas)}
          icon={<FaMoneyBillWave />}
          color="indigo"
          subtitle="Total sudah dibayar (termasuk DP)"
        />
        <Card
          title="Pembayaran Cicilan"
          value={formatCurrency(todayStats.cicilan)}
          icon={<FaMoneyBillWave />}
          color="orange"
          subtitle="Total sisa belum dibayar"
        />
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaSearch className="inline mr-2" />
              Cari Transaksi
            </label>
            <input
              type="text"
              placeholder="No. Invoice atau Nama Supplier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaFilter className="inline mr-2" />
              Status Pembayaran
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="LUNAS">Lunas</option>
              <option value="CICILAN">Cicilan</option>
              <option value="HUTANG">Hutang</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periode
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white text-sm"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Reset Filter */}
        {(searchTerm || statusFilter !== 'ALL' || startDate || endDate) && (
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('ALL')
                setStartDate('')
                setEndDate('')
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table columns={columns} data={paginatedTransactions} loading={loading} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTransactions.length}
        />
      </div>
    </div>
  )
}
