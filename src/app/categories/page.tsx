'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import AlertDialog from '@/components/AlertDialog'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileExport } from 'react-icons/fa'
import { exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, categoryId: '', categoryName: '' })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Gagal memuat data kategori')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success(editingCategory ? 'Kategori berhasil diperbarui!' : 'Kategori berhasil ditambahkan!')
        fetchCategories()
        closeModal()
      } else {
        const errorData = await res.json()
        toast.error(errorData.error || 'Gagal menyimpan kategori')
      }
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Terjadi kesalahan saat menyimpan kategori')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Kategori berhasil dihapus!')
        fetchCategories()
      } else {
        toast.error('Gagal menghapus kategori')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Terjadi kesalahan saat menghapus kategori')
    }
  }

  const openDeleteDialog = (category: any) => {
    setDeleteDialog({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, categoryId: '', categoryName: '' })
  }

  const confirmDelete = () => {
    handleDelete(deleteDialog.categoryId)
    closeDeleteDialog()
  }

  const openModal = (category?: any) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: '', description: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleExport = () => {
    const exportData = filteredCategories.map((category: any) => ({
      'Nama Kategori': category.name,
      'Deskripsi': category.description || '-',
      'Jumlah Produk': category._count?.products || 0,
    }))
    exportToCSV(exportData, 'data-kategori')
  }

  const filteredCategories = categories.filter((category: any) => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  const columns = [
    { key: 'name', label: 'Nama Kategori' },
    { key: 'description', label: 'Deskripsi' },
    {
      key: '_count',
      label: 'Jumlah Produk',
      render: (value: any) => value?.products || 0,
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
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
        <h1 className="text-3xl font-bold text-gray-800">Data Kategori</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <FaFileExport className="inline mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => openModal()}>
            <FaPlus className="inline mr-2" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Menampilkan {filteredCategories.length} dari {categories.length} kategori
        </div>
      </div>

      <Table columns={columns} data={filteredCategories} loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Kategori"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Deskripsi"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
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
        title="Hapus Kategori"
        message={`Apakah Anda yakin ingin menghapus kategori "${deleteDialog.categoryName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}
