'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import Table from '@/components/Table'
import AlertDialog from '@/components/AlertDialog'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileExport, FaChevronLeft, FaChevronRight, FaSync } from 'react-icons/fa'
import { generateProductCode, exportToCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isAutoCode, setIsAutoCode] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, productId: '', productName: '' })
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    categoryId: '',
    stock: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    minStock: 5,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Gagal memuat data produk')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock: Number(formData.stock),
          purchasePrice: Number(formData.purchasePrice),
          sellingPrice: Number(formData.sellingPrice),
          minStock: Number(formData.minStock),
        }),
      })

      if (res.ok) {
        toast.success(editingProduct ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!')
        fetchProducts()
        closeModal()
      } else {
        const errorData = await res.json()
        toast.error(errorData.details || errorData.error || 'Gagal menyimpan produk')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Terjadi kesalahan saat menyimpan produk')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Produk berhasil dihapus!')
        fetchProducts()
      } else {
        toast.error('Gagal menghapus produk')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Terjadi kesalahan saat menghapus produk')
    }
  }

  const openDeleteDialog = (product: any) => {
    setDeleteDialog({
      isOpen: true,
      productId: product.id,
      productName: product.name,
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, productId: '', productName: '' })
  }

  const confirmDelete = () => {
    handleDelete(deleteDialog.productId)
    closeDeleteDialog()
  }

  const openModal = async (product?: any) => {
    if (product) {
      setEditingProduct(product)
      setIsAutoCode(false)
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId,
        stock: product.stock,
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        minStock: product.minStock,
      })
    } else {
      setEditingProduct(null)
      setIsAutoCode(true)
      // Auto-generate kode produk baru
      const newCode = await generateProductCode()
      setFormData({
        code: newCode,
        name: '',
        description: '',
        categoryId: '',
        stock: 0,
        purchasePrice: 0,
        sellingPrice: 0,
        minStock: 5,
      })
    }
    setIsModalOpen(true)
  }

  const handleGenerateCode = async () => {
    const newCode = await generateProductCode()
    setFormData({ ...formData, code: newCode })
    toast.success('Kode produk berhasil di-generate!')
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleExport = () => {
    const exportData = filteredProducts.map((product: any) => ({
      'Kode': product.code,
      'Nama Produk': product.name,
      'Kategori': product.category?.name || '-',
      'Stok': product.stock,
      'Harga Beli': product.purchasePrice,
      'Harga Jual': product.sellingPrice,
      'Min Stok': product.minStock,
    }))
    exportToCSV(exportData, 'data-produk')
  }

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || product.categoryId === filterCategory
    return matchesSearch && matchesCategory
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterCategory])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const columns = [
    { key: 'code', label: 'Kode' },
    { key: 'name', label: 'Nama Produk' },
    {
      key: 'category',
      label: 'Kategori',
      render: (_: any, row: any) => row.category?.name || '-',
    },
    {
      key: 'stock',
      label: 'Stok',
      render: (value: number, row: any) => (
        <span className={value <= row.minStock ? 'text-red-600 font-bold' : ''}>
          {value}
        </span>
      ),
    },
    {
      key: 'purchasePrice',
      label: 'Harga Beli',
      render: (value: number) => `Rp ${value.toLocaleString('id-ID')}`,
    },
    {
      key: 'sellingPrice',
      label: 'Harga Jual',
      render: (value: number) => `Rp ${value.toLocaleString('id-ID')}`,
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
        <h1 className="text-3xl font-bold text-gray-800">Data Produk</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <FaFileExport className="inline mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => openModal()}>
            <FaPlus className="inline mr-2" />
            Tambah Produk
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
              placeholder="Cari produk (nama atau kode)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} dari {filteredProducts.length} produk
        </div>
      </div>

      <Table columns={columns} data={paginatedProducts} loading={loading} />

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Tampilkan:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">data per halaman</span>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                >
                  <FaChevronLeft />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 border rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="px-2 py-1 text-gray-500">...</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            <div className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}
      >
        <form onSubmit={handleSubmit}>
          {!editingProduct && (
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoCode}
                  onChange={(e) => {
                    setIsAutoCode(e.target.checked)
                    if (e.target.checked) {
                      handleGenerateCode()
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                Generate kode produk otomatis
              </label>
            </div>
          )}

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Kode Produk"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={isAutoCode && !editingProduct}
                required
              />
            </div>
            {!editingProduct && !isAutoCode && (
              <button
                type="button"
                onClick={handleGenerateCode}
                className="px-3 py-2 mb-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                title="Generate kode"
              >
                <FaSync className="text-sm" />
              </button>
            )}
          </div>

          <Input
            label="Nama Produk"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Deskripsi"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Input
            label="Stok"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Harga Beli"
            type="number"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
            required
          />
          <Input
            label="Harga Jual"
            type="number"
            value={formData.sellingPrice}
            onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) })}
            required
          />
          <Input
            label="Minimal Stok"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
            required
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
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${deleteDialog.productName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />
    </div>
  )
}
