'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { FaArrowLeft, FaMoneyBillWave, FaPrint } from 'react-icons/fa'
import Button from '@/components/Button'
import toast from 'react-hot-toast'
import AlertDialog from '@/components/AlertDialog'

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [transaction, setTransaction] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentNotes, setPaymentNotes] = useState('')
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  useEffect(() => {
    fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/transactions/${id}`)
      if (res.ok) {
        const data = await res.json()
        setTransaction(data)
        setPaymentAmount(data.remainingAmount || 0)
      } else {
        toast.error('Transaksi tidak ditemukan')
      }
    } catch (error) {
      console.error('Error fetching transaction:', error)
      toast.error('Gagal memuat data transaksi')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (paymentAmount <= 0) {
      toast.error('Jumlah pembayaran harus lebih dari 0')
      return
    }

    if (paymentAmount > transaction.remainingAmount) {
      toast.error('Jumlah pembayaran melebihi sisa tagihan')
      return
    }

    const loadingToast = toast.loading('Memproses pembayaran...')

    try {
      const res = await fetch(`/api/transactions/${id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentAmount,
          paymentMethod: 'CASH',
          notes: paymentNotes,
        }),
      })

      toast.dismiss(loadingToast)

      if (res.ok) {
        toast.success('Pembayaran berhasil dicatat')
        setShowPaymentForm(false)
        setPaymentNotes('')
        fetchTransaction()
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-600">Transaksi tidak ditemukan</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="secondary" onClick={() => router.back()}>
          <FaArrowLeft className="inline mr-2" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Detail Transaksi</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informasi Transaksi */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Transaksi</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">No. Invoice</p>
                <p className="font-semibold text-gray-900">{transaction.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal</p>
                <p className="font-semibold text-gray-900">{formatDateTime(transaction.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipe</p>
                <p className="font-semibold text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.type === 'PENJUALAN' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {transaction.type}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  {transaction.type === 'PENJUALAN' ? 'Customer' : 'Supplier'}
                </p>
                <p className="font-semibold text-gray-900">
                  {transaction.customer?.name || transaction.supplier?.name || 'Umum'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Metode Pembayaran</p>
                <p className="font-semibold text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.paymentMethod === 'CASH' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {transaction.paymentMethod}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status Pembayaran</p>
                <p className="font-semibold text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.paymentStatus === 'LUNAS'
                      ? 'bg-green-100 text-green-800'
                      : transaction.paymentStatus === 'CICILAN'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.paymentStatus}
                  </span>
                </p>
              </div>
              {transaction.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Catatan</p>
                  <p className="font-semibold text-gray-900">{transaction.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Detail Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Detail Item</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diskon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transaction.items?.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.product?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.discount)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* History Pembayaran (jika cicilan) */}
          {transaction.payments && transaction.payments.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pembayaran</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metode</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transaction.payments.map((payment: any) => (
                      <tr key={payment.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDateTime(payment.paymentDate)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{payment.paymentMethod}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{payment.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Ringkasan & Aksi */}
        <div className="space-y-6">
          {/* Ringkasan Pembayaran */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan</h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(transaction.subtotal)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Diskon:</span>
                  <span>-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              {transaction.tax > 0 && (
                <div className="flex justify-between">
                  <span>Pajak:</span>
                  <span className="text-gray-900">{formatCurrency(transaction.tax)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(transaction.total)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Dibayar:</span>
                <span className="font-medium text-green-600">{formatCurrency(transaction.paidAmount)}</span>
              </div>
              {transaction.remainingAmount > 0 && (
                <div className="flex justify-between">
                  <span>Sisa:</span>
                  <span className="font-medium text-red-600">{formatCurrency(transaction.remainingAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Pembayaran Cicilan */}
          {transaction.paymentStatus !== 'LUNAS' && transaction.remainingAmount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bayar Cicilan</h2>
              {showPaymentForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Pembayaran
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      min="0"
                      max={transaction.remainingAmount}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maks: {formatCurrency(transaction.remainingAmount)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                      rows={3}
                      placeholder="Catatan pembayaran (opsional)"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handlePayment} className="flex-1" variant="success">
                      <FaMoneyBillWave className="inline mr-2" />
                      Bayar
                    </Button>
                    <Button onClick={() => setShowPaymentForm(false)} variant="secondary">
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowPaymentForm(true)} className="w-full" variant="primary">
                  <FaMoneyBillWave className="inline mr-2" />
                  Tambah Pembayaran
                </Button>
              )}
            </div>
          )}

          {/* Aksi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi</h2>
            <div className="space-y-2">
              <Button 
                onClick={() => window.print()} 
                className="w-full" 
                variant="secondary"
              >
                <FaPrint className="inline mr-2" />
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
