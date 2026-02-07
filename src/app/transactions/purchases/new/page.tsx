'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { formatCurrency, generateInvoiceNumber } from '@/lib/utils'
import { FaPlus, FaTrash, FaSave, FaArrowLeft, FaShoppingCart } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ProductSelectorModal from '@/components/ProductSelectorModal'

export default function NewPurchasePage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showProductModal, setShowProductModal] = useState(false)
  
  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    supplierId: '',
    paymentMethod: 'CASH',
    paymentStatus: 'LUNAS',
    paidAmount: 0,
    discount: 0,
    tax: 0,
    notes: '',
  })
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetchSuppliers()
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchSuppliers = async () => {
    const res = await fetch('/api/suppliers')
    const data = await res.json()
    setSuppliers(data)
  }

  const fetchProducts = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  const handleProductSelect = (product: any, qty: number) => {
    const existingItem = items.find((item) => item.productId === product.id)
    if (existingItem) {
      const newQty = existingItem.quantity + qty
      setItems(
        items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: newQty, subtotal: newQty * item.price }
            : item
        )
      )
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          productName: product.name,
          price: product.purchasePrice,
          quantity: qty,
          discount: 0,
          subtotal: product.purchasePrice * qty,
        },
      ])
    }

    toast.success('Item ditambahkan ke keranjang')
  }

  const handleMultipleProductSelect = (productsToAdd: Array<{ product: any; quantity: number }>) => {
    let addedCount = 0

    productsToAdd.forEach(({ product, quantity: qty }) => {
      const existingItem = items.find((item) => item.productId === product.id)
      if (existingItem) {
        const newQty = existingItem.quantity + qty
        setItems(prev =>
          prev.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: newQty, subtotal: newQty * item.price }
              : item
          )
        )
      } else {
        setItems(prev => [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            price: product.purchasePrice,
            quantity: qty,
            discount: 0,
            subtotal: product.purchasePrice * qty,
          },
        ])
      }
      addedCount++
    })

    if (addedCount > 0) {
      toast.success(`${addedCount} produk berhasil ditambahkan`)
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
    toast.success('Item dihapus')
  }

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      toast.error('Jumlah harus lebih dari 0')
      return
    }
    
    setItems(
      items.map((item, i) =>
        i === index
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      )
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const discountAmount = (subtotal * formData.discount) / 100
    const taxAmount = (subtotal * formData.tax) / 100
    const total = subtotal - discountAmount + taxAmount
    return { subtotal, discountAmount, taxAmount, total }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast.error('Tambahkan minimal 1 item produk')
      return
    }

    if (!formData.supplierId) {
      toast.error('Pilih supplier')
      return
    }

    const { subtotal, total } = calculateTotals()
    const paidAmount = formData.paymentStatus === 'LUNAS' ? total : formData.paidAmount
    const remainingAmount = total - paidAmount

    const loadingToast = toast.loading('Menyimpan transaksi pembelian...')

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'PEMBELIAN',
          subtotal,
          total,
          paidAmount,
          remainingAmount,
          status: 'COMPLETED',
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            subtotal: item.subtotal,
          })),
        }),
      })

      toast.dismiss(loadingToast)

      if (res.ok) {
        toast.success('Transaksi pembelian berhasil disimpan!')
        setTimeout(() => router.push('/transactions/purchases'), 1000)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Gagal menyimpan transaksi')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat menyimpan transaksi')
    }
  }

  const totals = calculateTotals()

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="secondary" onClick={() => router.back()}>
          <FaArrowLeft className="inline mr-2" />
          Kembali
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Transaksi Pembelian Baru</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Transaksi</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="No. Invoice"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  required
                />
                <Input
                  label="Tanggal"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Pilih Supplier</option>
                    {suppliers.map((supplier: any) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Daftar Item</h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setShowProductModal(true)}
                    variant="primary"
                  >
                    <FaPlus className="mr-2" />
                    Tambah Produk
                  </Button>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-gray-900 bg-white"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-600 text-right">{formatCurrency(item.subtotal)}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <FaShoppingCart className="mx-auto text-4xl mb-3 text-gray-400" />
                  <p className="text-lg font-medium">Belum ada item</p>
                  <p className="text-sm">Klik tombol "Tambah Produk" untuk menambah item pembelian</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pembayaran</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="CASH">💵 Cash</option>
                  <option value="CREDIT">💳 Credit Card</option>
                  <option value="TRANSFER">🏦 Transfer Bank</option>
                  <option value="QRIS">📱 QRIS</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Pembayaran
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  <option value="LUNAS">✅ Lunas (Bayar Penuh)</option>
                  <option value="BELUM_LUNAS">❌ Belum Lunas</option>
                  <option value="CICILAN">⚠️ Cicilan (DP)</option>
                </select>
              </div>

              <div className="border-t border-b py-4 my-4">
                <h3 className="font-semibold text-gray-800 mb-3">Ringkasan Harga</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-gray-600">Diskon (%):</label>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right text-gray-900 bg-white"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600 text-xs">
                        <span>Potongan:</span>
                        <span>-{formatCurrency(totals.discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-gray-600">Pajak/PPN (%):</label>
                      <input
                        type="number"
                        value={formData.tax}
                        onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-right text-gray-900 bg-white"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-green-600 text-xs">
                        <span>Tambahan:</span>
                        <span>+{formatCurrency(totals.taxAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-blue-600">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>

              {formData.paymentStatus !== 'LUNAS' && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah Dibayar (DP/Cicilan)
                  </label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                    min="0"
                    max={totals.total}
                  />
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Sisa:</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(totals.total - formData.paidAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  rows={3}
                  placeholder="Catatan transaksi (opsional)"
                />
              </div>

              <Button type="submit" className="w-full" variant="success">
                <FaSave className="inline mr-2" />
                Simpan Transaksi
              </Button>
            </div>
          </div>
        </div>
      </form>

      <ProductSelectorModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSelectProduct={handleProductSelect}
        onSelectMultiple={handleMultipleProductSelect}
        products={products}
        categories={categories}
      />
    </div>
  )
}
