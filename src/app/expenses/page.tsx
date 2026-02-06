'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import Card from '@/components/Card'
import Pagination from '@/components/Pagination'
import AlertDialog from '@/components/AlertDialog'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaMoneyBillWave, FaChartLine, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [todayStats, setTodayStats] = useState({
    count: 0,
    total: 0,
  })
  const [monthlyStats, setMonthlyStats] = useState({
    count: 0,
    total: 0,
  })
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    description: '',
  })

  useEffect(() => {
    fetchExpenses()
  }, [categoryFilter, startDate, endDate])

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      let url = '/api/expenses'
      const params = new URLSearchParams()
      
      if (categoryFilter !== 'ALL') {
        params.append('category', categoryFilter)
      }
      if (startDate) {
        params.append('startDate', startDate)
      }
      if (endDate) {
        params.append('endDate', endDate)
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const res = await fetch(url)
      const data = await res.json()
      setExpenses(data)

      // Hitung statistik hari ini
      const today = new Date()
      const todayDateString = today.toISOString().split('T')[0]
      const todayExpenses = data.filter((e: any) => {
        const expenseDateString = new Date(e.date).toISOString().split('T')[0]
        return expenseDateString === todayDateString
      })

      setTodayStats({
        count: todayExpenses.length,
        total: todayExpenses.reduce((sum: number, e: any) => sum + e.amount, 0),
      })

      // Hitung statistik bulan ini
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      
      const monthlyExpenses = data.filter((e: any) => {
        const expenseDate = new Date(e.date)
        return expenseDate >= firstDay && expenseDate <= lastDay
      })

      setMonthlyStats({
        count: monthlyExpenses.length,
        total: monthlyExpenses.reduce((sum: number, e: any) => sum + e.amount, 0),
      })
    } catch (error) {
      console.error('Error fetching expenses:', error)
      toast.error('Gagal memuat data pengeluaran')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const loadingToast = toast.loading(isEditMode ? 'Mengupdate pengeluaran...' : 'Menyimpan pengeluaran...')
    
    try {
      const url = isEditMode ? `/api/expenses/${editingId}` : '/api/expenses'
      const method = isEditMode ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      toast.dismiss(loadingToast)

      if (res.ok) {
        toast.success(isEditMode ? 'Pengeluaran berhasil diupdate!' : 'Pengeluaran berhasil ditambahkan!')
        fetchExpenses()
        closeModal()
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || 'Gagal menyimpan pengeluaran')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error saving expense:', error)
      toast.error('Terjadi kesalahan saat menyimpan pengeluaran')
    }
  }

  const handleEdit = (expense: any) => {
    setIsEditMode(true)
    setEditingId(expense.id)
    setFormData({
      date: new Date(expense.date).toISOString().split('T')[0],
      category: expense.category,
      amount: expense.amount,
      description: expense.description || '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const loadingToast = toast.loading('Menghapus pengeluaran...')

    try {
      const res = await fetch(`/api/expenses/${deleteId}`, {
        method: 'DELETE',
      })

      toast.dismiss(loadingToast)

      if (res.ok) {
        toast.success('Pengeluaran berhasil dihapus!')
        fetchExpenses()
        setDeleteId(null)
      } else {
        toast.error('Gagal menghapus pengeluaran')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error deleting expense:', error)
      toast.error('Terjadi kesalahan saat menghapus pengeluaran')
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditMode(false)
    setEditingId(null)
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: 0,
      description: '',
    })
  }

  // Filter berdasarkan search term
  const filteredExpenses = expenses.filter((expense: any) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      expense.category.toLowerCase().includes(searchLower) ||
      expense.description?.toLowerCase().includes(searchLower) ||
      ''
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, startDate, endDate])

  const columns = [
    {
      key: 'date',
      label: 'Tanggal',
      render: (value: string) => formatDateTime(value),
    },
    { 
      key: 'category', 
      label: 'Kategori',
      render: (value: string) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
          {value}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Jumlah',
      render: (value: number) => (
        <span className="font-bold text-red-600">{formatCurrency(value)}</span>
      ),
    },
    { 
      key: 'description', 
      label: 'Keterangan',
      render: (value: string) => value || '-',
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ]

  const expenseCategories = [
    'Gaji Karyawan',
    'Listrik & Air',
    'Sewa Tempat',
    'Peralatan',
    'Pemeliharaan',
    'Transport',
    'Internet & Telpon',
    'Pajak',
    'Promosi & Marketing',
    'Lain-lain',
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Pengeluaran</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <FaPlus className="inline mr-2" />
          Tambah Pengeluaran
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card
          title="Pengeluaran Hari Ini"
          value={`${todayStats.count} Item`}
          icon={<FaCalendarAlt />}
          color="orange"
          subtitle={new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        />
        <Card
          title="Total Hari Ini"
          value={formatCurrency(todayStats.total)}
          icon={<FaMoneyBillWave />}
          color="red"
          subtitle="Otomatis reset setiap hari"
        />
        <Card
          title="Total Bulan Ini"
          value={formatCurrency(monthlyStats.total)}
          icon={<FaChartLine />}
          color="purple"
          subtitle={`${monthlyStats.count} transaksi pengeluaran`}
        />
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaSearch className="inline mr-2" />
              Cari Pengeluaran
            </label>
            <input
              type="text"
              placeholder="Kategori atau Keterangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaFilter className="inline mr-2" />
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="ALL">Semua Kategori</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="lg:col-start-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
        </div>

        {/* Reset Filter */}
        {(searchTerm || categoryFilter !== 'ALL' || startDate || endDate) && (
          <div className="mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('ALL')
                setStartDate('')
                setEndDate('')
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>

      {/* Table with Pagination */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <Table columns={columns} data={paginatedExpenses} loading={loading} emptyMessage="Belum ada data pengeluaran" />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={filteredExpenses.length}
        />
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isEditMode ? 'Edit Pengeluaran' : 'Tambah Pengeluaran'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Tanggal"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {expenseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Jumlah"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Pengeluaran"
        message="Apakah Anda yakin ingin menghapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  )
}