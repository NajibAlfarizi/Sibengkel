'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Table from '@/components/Table'
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function SupplierDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [supplier, setSupplier] = useState<any>(null)
  const [purchases, setPurchases] = useState([])
  const [payables, setPayables] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSupplierDetail()
  }, [])

  const fetchSupplierDetail = async () => {
    try {
      const res = await fetch(`/api/suppliers/${params.id}`)
      
      if (!res.ok) {
        throw new Error('Failed to fetch supplier')
      }

      const data = await res.json()
      
      setSupplier(data)
      setPurchases(Array.isArray(data.transactions) ? data.transactions : [])
      setPayables(Array.isArray(data.payables) ? data.payables : [])
    } catch (error) {
      console.error('Error fetching supplier detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const purchaseColumns = [
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

  const payableColumns = [
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

  if (!supplier) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">Supplier tidak ditemukan</div>
      </div>
    )
  }

  const safePurchases = Array.isArray(purchases) ? purchases : []
  const safePayables = Array.isArray(payables) ? payables : []

  const totalPurchases = safePurchases.length
  const totalAmount = safePurchases.reduce((sum: number, p: any) => sum + (p.total || 0), 0)
  const totalPayables = safePayables.reduce((sum: number, p: any) => sum + (p.remaining || 0), 0)
  const unpaidPayables = safePayables.filter((p: any) => p.status !== 'LUNAS').length

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
        {/* Supplier Info */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Supplier</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Kode</div>
                <div className="font-semibold text-gray-800">{supplier.code}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Nama</div>
                <div className="font-semibold text-gray-800">{supplier.name}</div>
              </div>
            </div>
            {supplier.companyName && (
              <div className="flex items-center gap-3">
                <FaBuilding className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Nama Perusahaan</div>
                  <div className="font-semibold text-gray-800">{supplier.companyName}</div>
                </div>
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Telepon</div>
                  <div className="font-semibold text-gray-800">{supplier.phone}</div>
                </div>
              </div>
            )}
            {supplier.email && (
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-semibold text-gray-800">{supplier.email}</div>
                </div>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Alamat</div>
                  <div className="font-semibold text-gray-800">{supplier.address}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Pembelian</div>
            <div className="text-3xl font-bold text-gray-800">{totalPurchases}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Nilai Pembelian</div>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalAmount)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Hutang</div>
            <div className="text-3xl font-bold text-orange-600">{formatCurrency(totalPayables)}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Hutang Belum Lunas</div>
            <div className="text-3xl font-bold text-red-600">{unpaidPayables}</div>
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pembelian</h2>
        <Table columns={purchaseColumns} data={safePurchases} />
      </div>

      {/* Payables */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hutang</h2>
        <Table columns={payableColumns} data={safePayables} />
      </div>
    </div>
  )
}
