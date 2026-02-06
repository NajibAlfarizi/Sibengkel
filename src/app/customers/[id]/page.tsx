'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Table from '@/components/Table'
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<any>(null)
  const [transactions, setTransactions] = useState([])
  const [receivables, setReceivables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomerDetail()
  }, [])

  const fetchCustomerDetail = async () => {
    try {
      const res = await fetch(`/api/customers/${params.id}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch customer')
      }

      const data = await res.json()
      
      setCustomer(data)
      setTransactions(Array.isArray(data.transactions) ? data.transactions : [])
      setReceivables(Array.isArray(data.receivables) ? data.receivables : [])
    } catch (error) {
      console.error('Error fetching customer detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const transactionColumns = [
    { 
      key: 'invoiceNumber', 
      label: 'No. Invoice',
      render: (value: string, row: any) => (
        <a 
          href={`/transactions/${row.id}`}
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      )
    },
    { 
      key: 'date', 
      label: 'Tanggal',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => formatCurrency(value || 0)
    },
    {
      key: 'paymentMethod',
      label: 'Pembayaran',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      render: (value: string) => {
        const colors = {
          LUNAS: 'bg-green-100 text-green-800',
          BELUM_LUNAS: 'bg-red-100 text-red-800',
          CICILAN: 'bg-yellow-100 text-yellow-800',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors]}`}>
            {value.replace('_', ' ')}
          </span>
        )
      }
    },
  ]

  const receivableColumns = [
    { key: 'description', label: 'Keterangan' },
    { 
      key: 'dueDate', 
      label: 'Jatuh Tempo',
      render: (value: string) => value ? formatDate(value) : '-'
    },
    {
      key: 'amount',
      label: 'Jumlah',
      render: (value: number) => formatCurrency(value || 0)
    },
    {
      key: 'remaining',
      label: 'Sisa',
      render: (value: number) => formatCurrency(value || 0)
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const colors = {
          LUNAS: 'bg-green-100 text-green-800',
          BELUM_LUNAS: 'bg-red-100 text-red-800',
          CICILAN: 'bg-yellow-100 text-yellow-800',
        }
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {value.replace('_', ' ')}
          </span>
        )
      }
    },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Customer tidak ditemukan</div>
      </div>
    )
  }

  const safeTransactions = Array.isArray(transactions) ? transactions : []
  const safeReceivables = Array.isArray(receivables) ? receivables : []

  const totalTransactions = safeTransactions.length
  const totalSales = safeTransactions.reduce((sum: number, t: any) => sum + (t.total || 0), 0)
  const totalReceivables = safeReceivables.reduce((sum: number, r: any) => sum + (r.remaining || 0), 0)
  const unpaidReceivables = safeReceivables.filter((r: any) => r.status !== 'LUNAS').length

  return (
    <div className="p-8">
      <Button
        variant="secondary"
        onClick={() => router.back()}
        className="mb-6"
      >
        <FaArrowLeft className="inline mr-2" />
        Kembali
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Info */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Customer</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Kode</div>
                <div className="font-semibold text-gray-800">{customer.code}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Nama</div>
                <div className="font-semibold text-gray-800">{customer.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaBuilding className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Tipe</div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  customer.type === 'UMUM' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {customer.type}
                </span>
              </div>
            </div>
            {customer.companyName && (
              <div className="flex items-center gap-3">
                <FaBuilding className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Nama Perusahaan</div>
                  <div className="font-semibold text-gray-800">{customer.companyName}</div>
                </div>
              </div>
            )}
            {customer.phone && (
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Telepon</div>
                  <div className="font-semibold text-gray-800">{customer.phone}</div>
                </div>
              </div>
            )}
            {customer.email && (
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold text-gray-800">{customer.email}</div>
                </div>
              </div>
            )}
            {customer.address && (
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Alamat</div>
                  <div className="font-semibold text-gray-800">{customer.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Transaksi</div>
            <div className="text-3xl font-bold text-gray-800">{totalTransactions}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Penjualan</div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(totalSales)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Piutang</div>
            <div className="text-3xl font-bold text-orange-600">{formatCurrency(totalReceivables)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Piutang Belum Lunas</div>
            <div className="text-3xl font-bold text-red-600">{unpaidReceivables}</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Transaksi</h2>
        <Table columns={transactionColumns} data={safeTransactions} />
      </div>

      {/* Receivables */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Piutang</h2>
        <Table columns={receivableColumns} data={safeReceivables} />
      </div>
    </div>
  )
}
