'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import AlertDialog from '@/components/AlertDialog'
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFileExport } from 'react-icons/fa'
import Link from 'next/link'
import { generateSupplierCode, validateEmail, validatePhone, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, supplierId: '', supplierName: '' })
  const [formData, setFormData] = useState({
    code: '',
    name: '',
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
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('/api/suppliers')
      const data = await res.json()
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast.error('Gagal memuat data supplier')
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
      const url = editingSupplier ? `/api/suppliers/${editingSupplier.id}` : '/api/suppliers'
      const method = editingSupplier ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingSupplier ? 'Supplier berhasil diperbarui!' : 'Supplier berhasil ditambahkan!')
        fetchSuppliers()
        closeModal()
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || 'Gagal menyimpan supplier')
      }
    } catch (error) {
      console.error('Error saving supplier:', error)
      toast.error('Terjadi kesalahan saat menyimpan supplier')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Supplier berhasil dihapus!')
        fetchSuppliers()
      } else {
        toast.error('Gagal menghapus supplier')
      }
    } catch (error) {
      console.error('Error deleting supplier:', error)
      toast.error('Terjadi kesalahan saat menghapus supplier')
    }
  }

  const openDeleteDialog = (supplier: any) => {
    setDeleteDialog({
      isOpen: true,
      supplierId: supplier.id,
      supplierName: supplier.name,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, supplierId: '', supplierName: '' })
  }

  const confirmDelete = () => {
    handleDelete(deleteDialog.supplierId)
    closeDeleteDialog()
  }

  const openModal = async (supplier?: any) => {
    setValidationErrors({ email: '', phone: '' })
    
    if (supplier) {
      setEditingSupplier(supplier)
      setFormData({
        code: supplier.code,
        name: supplier.name,
        companyName: supplier.companyName || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
      })
    } else {
      setEditingSupplier(null)
      // Auto-generate kode supplier baru
      const newCode = await generateSupplierCode()
      setFormData({
        code: newCode,
        name: '',
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
    setEditingSupplier(null)
  }

  const handleExport = () => {
    const exportData = filteredSuppliers.map((supplier: any) => ({
      'Kode': supplier.code,
      'Nama': supplier.name,
      'Nama Perusahaan': supplier.companyName || '-',
      'Telepon': supplier.phone || '-',
      'Email': supplier.email || '-',
      'Alamat': supplier.address || '-',
    }))
    exportToCSV(exportData, 'data-supplier')
  }

  const filteredSuppliers = suppliers.filter((supplier: any) => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (supplier.companyName && supplier.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (supplier.phone && supplier.phone.includes(searchQuery))
    return matchesSearch
  })

  const columns = [
    { key: 'code', label: 'Kode' },
    { key: 'name', label: 'Nama' },
    { key: 'companyName', label: 'Nama Perusahaan' },
    { key: 'phone', label: 'Telepon' },
    { key: 'email', label: 'Email' },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Link href={`/suppliers/${row.id}`}>
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
        <h1 className="text-3xl font-bold text-gray-800">Data Supplier</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <FaFileExport className="inline mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => openModal()}>
            <FaPlus className="inline mr-2" />
            Tambah Supplier
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari supplier (nama, kode, perusahaan, atau telepon)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Menampilkan {filteredSuppliers.length} dari {suppliers.length} supplier
        </div>
      </div>

      <Table columns={columns} data={filteredSuppliers} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSupplier ? 'Edit Supplier' : 'Tambah Supplier'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Kode Supplier"
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
          <Input
            label="Nama Perusahaan"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
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
        title="Hapus Supplier"
        message={`Apakah Anda yakin ingin menghapus supplier "${deleteDialog.supplierName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}
