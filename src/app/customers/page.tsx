'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import AlertDialog from '@/components/AlertDialog'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFileExport } from 'react-icons/fa'
import Link from 'next/link'
import { generateCustomerCode, validateEmail, validatePhone, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, customerId: '', customerName: '' })
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'UMUM',
    companyName: '',
    phone: '',
    email: '',
    address: '',
  })
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers')
      const data = await res.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error('Gagal memuat data customer')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi email dan phone
    const errors = { email: '', phone: '' }
    
    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Format email tidak valid'
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      errors.phone = 'Format nomor telepon tidak valid'
    }
    
    if (errors.email || errors.phone) {
      setValidationErrors(errors)
      return
    }
    
    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer.id}` : '/api/customers'
      const method = editingCustomer ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingCustomer ? 'Customer berhasil diperbarui!' : 'Customer berhasil ditambahkan!')
        fetchCustomers()
        closeModal()
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || 'Gagal menyimpan customer')
      }
    } catch (error) {
      console.error('Error saving customer:', error)
      toast.error('Terjadi kesalahan saat menyimpan customer')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Customer berhasil dihapus!')
        fetchCustomers()
      } else {
        toast.error('Gagal menghapus customer')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast.error('Terjadi kesalahan saat menghapus customer')
    }
  }

  const openDeleteDialog = (customer: any) => {
    setDeleteDialog({
      isOpen: true,
      customerId: customer.id,
      customerName: customer.name,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, customerId: '', customerName: '' })
  }

  const confirmDelete = () => {
    handleDelete(deleteDialog.customerId)
    closeDeleteDialog()
  }

  const openModal = async (customer?: any) => {
    setValidationErrors({ email: '', phone: '' })
    
    if (customer) {
      setEditingCustomer(customer)
      setFormData({
        code: customer.code,
        name: customer.name,
        type: customer.type,
        companyName: customer.companyName || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
      })
    } else {
      setEditingCustomer(null)
      // Auto-generate kode customer baru
      const newCode = await generateCustomerCode()
      setFormData({
        code: newCode,
        name: '',
        type: 'UMUM',
        companyName: '',
        phone: '',
        email: '',
        address: '',
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCustomer(null)
  }

  const handleExport = () => {
    const exportData = filteredCustomers.map((customer: any) => ({
      'Kode': customer.code,
      'Nama': customer.name,
      'Tipe': customer.type,
      'Nama Perusahaan': customer.companyName || '-',
      'Telepon': customer.phone || '-',
      'Email': customer.email || '-',
      'Alamat': customer.address || '-',
    }))
    exportToCSV(exportData, 'data-customer')
  }

  const filteredCustomers = customers.filter((customer: any) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (customer.phone && customer.phone.includes(searchQuery))
    const matchesType = !filterType || customer.type === filterType
    return matchesSearch && matchesType
  })

  const columns = [
    { key: 'code', label: 'Kode' },
    { key: 'name', label: 'Nama' },
    {
      key: 'type',
      label: 'Tipe',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'UMUM' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      ),
    },
    { key: 'phone', label: 'Telepon' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Link href={`/customers/${row.id}`}>
            <button className="text-green-600 hover:text-green-800">
              <FaEye />
            </button>
          </Link>
          <button
            onClick={() => openModal(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => openDeleteDialog(row)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Customer</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <FaFileExport className="inline mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => openModal()}>
            <FaPlus className="inline mr-2" />
            Tambah Customer
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari customer (nama, kode, atau telepon)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">Semua Tipe</option>
            <option value="UMUM">Umum</option>
            <option value="PERUSAHAAN">Perusahaan</option>
          </select>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Menampilkan {filteredCustomers.length} dari {customers.length} customer
        </div>
      </div>

      <Table columns={columns} data={filteredCustomers} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCustomer ? 'Edit Customer' : 'Tambah Customer'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Kode Customer"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <Input
            label="Nama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Customer
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="UMUM">Umum</option>
              <option value="PERUSAHAAN">Perusahaan</option>
            </select>
          </div>
          {formData.type === 'PERUSAHAAN' && (
            <Input
              label="Nama Perusahaan"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          )}
          <Input
            label="Telepon"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
          )}
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Hapus Customer"
        message={`Apakah Anda yakin ingin menghapus customer "${deleteDialog.customerName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}
