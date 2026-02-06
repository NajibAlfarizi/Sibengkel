'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Pagination from '@/components/Pagination'
import Modal from '@/components/Modal'
import Input from '@/components/Input'
import AlertDialog from '@/components/AlertDialog'
import { FaMoneyBillWave, FaHistory, FaTrash, FaExclamationTriangle, FaSearch, FaFilter } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function PayablesPage() {
  const [payables, setPayables] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPayable, setSelectedPayable] = useState<any>(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    paymentMethod: 'CASH',
    notes: '',
  })

  // History modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState([])

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    lunas: 0,
    belumLunas: 0,
    jatuhTempo: 0,
  })

  useEffect(() => {
    fetchPayables()
  }, [statusFilter])

  const fetchPayables = async () => {
    setLoading(true)
    try {
      let url = '/api/payables'
      if (statusFilter !== 'ALL') {
        url += `?status=${statusFilter}`
      }
      
      const res = await fetch(url)
      const data = await res.json()
      setPayables(data)

      // Calculate statistics
      const total = data.reduce((sum: number, p: any) => sum + p.remaining, 0)
      const lunas = data.filter((p: any) => p.status === 'LUNAS').reduce((sum: number, p: any) => sum + p.amount, 0)
      const belumLunas = data.filter((p: any) => p.status !== 'LUNAS').reduce((sum: number, p: any) => sum + p.remaining, 0)
      
      // Check jatuh tempo (overdue)
      const today = new Date()
      const jatuhTempo = data.filter((p: any) => {
        if (!p.dueDate || p.status === 'LUNAS') return false
        return new Date(p.dueDate) < today
      }).reduce((sum: number, p: any) => sum + p.remaining, 0)

      setStats({
        total,
        lunas,
        belumLunas,
        jatuhTempo,
      })
    } catch (error) {
      console.error('Error fetching payables:', error)
      toast.error('Gagal memuat data hutang')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPayable) return
    if (paymentForm.amount <= 0) {
      toast.error('Jumlah pembayaran harus lebih dari 0')
      return
    }
    if (paymentForm.amount > selectedPayable.remaining) {
      toast.error('Jumlah pembayaran melebihi sisa hutang')
      return
    }

    const loadingToast = toast.loading('Memproses pembayaran...')

    try {
      const res = await fetch(`/api/payables/${selectedPayable.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm),
      })

      toast.dismiss(loadingToast)

      if (res.ok) {
        toast.success('Pembayaran berhasil dicatat!')
        fetchPayables()
        closePaymentModal()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal mencatat pembayaran')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat memproses pembayaran')
    }
  }

  const fetchPaymentHistory = async (payableId: string) => {
    try {
      const res = await fetch(`/api/payables/${payableId}/payments`)
      const data = await res.json()
      setPaymentHistory(data)
    } catch (error) {
      console.error('Error fetching payment history:', error)
      toast.error('Gagal memuat riwayat pembayaran')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    const loadingToast = toast.loading('Menghapus hutang...')

    try {
      const res = await fetch(`/api/payables/${deleteId}`, {
        method: 'DELETE',
      })

      toast.dismiss(loadingToast)

      if (res.ok) {
        toast.success('Hutang berhasil dihapus!')
        fetchPayables()
        setDeleteId(null)
      } else {
        toast.error('Gagal menghapus hutang')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error deleting payable:', error)
      toast.error('Terjadi kesalahan saat menghapus hutang')
    }
  }

  const openPaymentModal = (payable: any) => {
    setSelectedPayable(payable)
    setPaymentForm({
      amount: payable.remaining,
      paymentMethod: 'CASH',
      notes: '',
    })
    setIsPaymentModalOpen(true)
  }

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false)
    setSelectedPayable(null)
    setPaymentForm({
      amount: 0,
      paymentMethod: 'CASH',
      notes: '',
    })
  }

  const openHistoryModal = (payable: any) => {
    setSelectedPayable(payable)
    fetchPaymentHistory(payable.id)
    setIsHistoryModalOpen(true)
  }

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false)
    setSelectedPayable(null)
    setPaymentHistory([])
  }

  // Filter and search
  const filteredData = payables.filter((item: any) => {
    const matchSearch = 
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter
    return matchSearch && matchStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  // Auto reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter])

  // Check if overdue
  const isOverdue = (dueDate: string | null, status: string) => {
    if (!dueDate || status === 'LUNAS') return false
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container-responsive py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-orange-500 text-white rounded-xl shadow-lg">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              Manajemen Hutang
            </h1>
            <p className="text-gray-600 mt-2 ml-1">Kelola dan pantau hutang kepada supplier</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaExclamationTriangle className="text-2xl" />
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Belum Lunas</h3>
            <p className="text-3xl font-bold mt-2">
              Rp {stats.belumLunas.toLocaleString('id-ID')}
            </p>
            <div className="mt-4 text-xs opacity-75">Menunggu pembayaran</div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaMoneyBillWave className="text-2xl" />
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Sudah Lunas</h3>
            <p className="text-3xl font-bold mt-2">
              Rp {stats.lunas.toLocaleString('id-ID')}
            </p>
            <div className="mt-4 text-xs opacity-75">Pembayaran selesai</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaSearch className="text-2xl" />
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Hutang</h3>
            <p className="text-3xl font-bold mt-2">
              Rp {stats.total.toLocaleString('id-ID')}
            </p>
            <div className="mt-4 text-xs opacity-75">Saldo belum dibayar</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <FaExclamationTriangle className="text-2xl" />
              </div>
            </div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Jatuh Tempo</h3>
            <p className="text-3xl font-bold mt-2">
              Rp {stats.jatuhTempo.toLocaleString('id-ID')}
            </p>
            <div className="mt-4 text-xs opacity-75">Perlu tindak lanjut</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <FaFilter className="text-orange-500 text-xl" />
            <h2 className="text-lg font-bold text-gray-900">Filter & Pencarian</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <FaSearch className="text-gray-400" />
                Cari Supplier
              </label>
              <Input
                type="text"
                placeholder="Cari nama supplier atau keterangan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-gray-200 focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                <FaFilter className="text-gray-400" />
                Status Pembayaran
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium"
              >
                <option value="ALL">🔍 Semua Status</option>
                <option value="LUNAS">✅ Lunas</option>
                <option value="BELUM_LUNAS">⏳ Belum Lunas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">Memuat data hutang...</p>
            </div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                <FaSearch className="text-4xl text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">Tidak ada data hutang</p>
              <p className="text-gray-400 text-sm mt-2">Data akan muncul setelah transaksi pembelian dengan sistem hutang</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-orange-500 to-red-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Total Tagihan</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Terbayar</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Sisa Tagihan</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Jatuh Tempo</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item: any) => (
                    <tr key={item.id} className={`transition-all duration-200 hover:bg-orange-50 hover:shadow-md ${isOverdue(item.dueDate, item.status) ? 'bg-red-50 border-l-4 border-red-500' : 'hover:border-l-4 hover:border-orange-500'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {isOverdue(item.dueDate, item.status) && (
                          <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-gray-900">{item.supplier || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900 font-medium">Rp {item.amount.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-semibold">Rp {item.paidAmount.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-red-600 text-base">
                        Rp {item.remaining.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'LUNAS'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.dueDate ? (
                        <span className={`font-medium ${isOverdue(item.dueDate, item.status) ? 'text-red-600' : 'text-gray-900'}`}>
                          {new Date(item.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      ) : <span className="text-gray-500">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {item.status !== 'LUNAS' && (
                          <Button
                            onClick={() => openPaymentModal(item)}
                            variant="primary"
                            className="text-xs px-4 py-2 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                          >
                            <FaMoneyBillWave className="mr-1.5 inline" /> Bayar
                          </Button>
                        )}
                        <Button
                          onClick={() => openHistoryModal(item)}
                          variant="secondary"
                          className="text-xs px-3 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                          title="Lihat Riwayat"
                        >
                          <FaHistory />
                        </Button>
                        <Button
                          onClick={() => setDeleteId(item.id)}
                          variant="danger"
                          className="text-xs px-3 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                          title="Hapus"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
            />
          </div>
        )}

        {/* Payment Modal */}
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={closePaymentModal}
        title="Catat Pembayaran"
      >
        <form onSubmit={handlePayment}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Supplier</label>
              <Input
                type="text"
                value={selectedPayable?.supplier || ''}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sisa Hutang</label>
              <Input
                type="text"
                value={`Rp ${(selectedPayable?.remaining || 0).toLocaleString('id-ID')}`}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Jumlah Bayar *</label>
              <Input
                type="number"
                value={paymentForm.amount || ''}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseFloat(e.target.value) || 0 })}
                required
                min="1"
                max={selectedPayable?.remaining}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Metode Pembayaran *</label>
              <select
                value={paymentForm.paymentMethod}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="CASH">Cash</option>
                <option value="TRANSFER">Transfer</option>
                <option value="CARD">Kartu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Catatan</label>
              <textarea
                value={paymentForm.notes}
                onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Catatan pembayaran (opsional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" onClick={closePaymentModal} variant="secondary">
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Pembayaran
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={closeHistoryModal}
        title="Riwayat Pembayaran"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Supplier</p>
            <p className="font-medium">{selectedPayable?.supplier}</p>
          </div>
          
          {paymentHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada riwayat pembayaran</p>
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment: any) => (
                <div key={payment.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-green-600">
                        Rp {payment.amount.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {payment.paymentMethod}
                    </span>
                  </div>
                  {payment.notes && (
                    <p className="text-sm text-gray-600 mt-1">{payment.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Hutang"
        message="Apakah Anda yakin ingin menghapus data hutang ini? Tindakan ini tidak dapat dibatalkan."
      />
      </div>
    </div>
  )
}
