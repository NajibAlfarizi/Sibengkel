'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { formatCurrency, generateInvoiceNumber } from '@/lib/utils'
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NewPurchasePage() {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
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
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetchSuppliers()
    fetchProducts()
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

  const addItem = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error('Pilih produk dan masukkan jumlah yang valid')
      return
    }

    const product: any = products.find((p: any) => p.id === selectedProduct)
    if (!product) {
      toast.error('Produk tidak ditemukan')
      return
    }

    const existingItem = items.find((item) => item.productId === selectedProduct)
    if (existingItem) {
      setItems(
        items.map((item) =>
          item.productId === selectedProduct
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.price }
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
          quantity,
          discount: 0,
          subtotal: product.purchasePrice * quantity,
        },
      ])
    }

    setSelectedProduct('')
    setQuantity(1)
    toast.success('Item ditambahkan')
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Item</h2>
              
              <div className="flex gap-2 mb-4">
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Produk</option>
                  {products.map((product: any) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.purchasePrice)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <Button type="button" onClick={addItem}>
                  <FaPlus />
                </Button>
              </div>

              {items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.productName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded"
                              min="1"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
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
                <p className="text-center text-gray-500 py-4">Belum ada item</p>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Pembayaran</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metode Pembayaran
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Pembayaran
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LUNAS">Lunas</option>
                  <option value="BELUM_LUNAS">Belum Lunas</option>
                  <option value="CICILAN">Cicilan</option>
                </select>
              </div>
              {formData.paymentStatus !== 'LUNAS' && (
                <Input
                  label="Jumlah Dibayar"
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                />
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ringkasan</h2>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" variant="success">
              <FaSave className="inline mr-2" />
              Simpan Transaksi
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
