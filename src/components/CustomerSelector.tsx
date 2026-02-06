'use client'

import { useState } from 'react'
import { FaUserPlus, FaUsers } from 'react-icons/fa'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  name: string
  type: string
  phone?: string
}

interface Props {
  customers: Customer[]
  selectedCustomerId: string
  onCustomerChange: (customerId: string) => void
  onCustomerCreated: () => void
}

export default function CustomerSelector({
  customers,
  selectedCustomerId,
  onCustomerChange,
  onCustomerCreated,
}: Props) {
  const [mode, setMode] = useState<'select' | 'new' | 'manual'>('select')
  const [manualCustomerName, setManualCustomerName] = useState('')
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    type: 'RETAIL',
    phone: '',
    address: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSaveCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast.error('Nama customer harus diisi')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success('Customer baru berhasil ditambahkan!')
        onCustomerChange(data.id)
        setMode('select')
        setNewCustomer({ name: '', type: 'RETAIL', phone: '', address: '' })
        onCustomerCreated()
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal menambahkan customer')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode('select')}
          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
            mode === 'select'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FaUsers className="inline mr-1" />
          Pilih
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
            mode === 'manual'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✍️ Manual
        </button>
        <button
          type="button"
          onClick={() => setMode('new')}
          className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
            mode === 'new'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FaUserPlus className="inline mr-1" />
          Daftar
        </button>
      </div>

      {mode === 'select' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => onCustomerChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">Pilih Customer (Opsional)</option>
          mode === 'manual' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Customer (Tipe: Umum)
          </label>
          <input
            type="text"
            value={manualCustomerName}
            onChange={(e) => {
              setManualCustomerName(e.target.value)
              onCustomerChange(`manual:${e.target.value}`)
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white"
            placeholder="Ketik nama customer..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Customer manual tidak disimpan ke database
          </p>
        </div>
      ) :   {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.type}
                {customer.phone && ` - ${customer.phone}`}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Kosongkan jika customer umum / tidak terdaftar
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Customer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Masukkan nama customer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe
              </label>
              <select
                value={newCustomer.type}
                onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value="RETAIL">Retail</option>
                <option value="WORKSHOP">Workshop</option>
                <option value="DEALER">Dealer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <input
                type="text"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                placeholder="08xxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              rows={2}
              placeholder="Alamat customer (opsional)"
            />
          </div>

          <button
            type="button"
            onClick={handleSaveCustomer}
            disabled={saving || !newCustomer.name.trim()}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {saving ? 'Menyimpan...' : 'Simpan & Gunakan Customer Ini'}
          </button>
        </div>
      )}
    </div>
  )
}
