'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaSearch, FaFilter, FaShoppingCart } from 'react-icons/fa'
import { formatCurrency } from '@/lib/utils'
import Button from './Button'

interface Product {
  id: string
  code: string
  name: string
  category?: { name: string }
  sellingPrice: number
  stock: number
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectProduct: (product: Product, quantity: number) => void
  onSelectMultiple?: (products: Array<{ product: Product; quantity: number }>) => void
  products: Product[]
  categories: any[]
}

export default function ProductSelectorModal({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectMultiple,
  products,
  categories,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<Map<string, number>>(new Map())
  const [mode, setMode] = useState<'single' | 'multiple'>('multiple')

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSelectedCategory('')
      setSelectedProduct(null)
      setQuantity(1)
      setSelectedProducts(new Map())
      setMode('multiple')
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       product.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = !selectedCategory || product.category?.name === selectedCategory
    return matchSearch && matchCategory && product.stock > 0
  })

  const handleAddToCart = () => {
    if (mode === 'single' && selectedProduct && quantity > 0) {
      onSelectProduct(selectedProduct, quantity)
      setSelectedProduct(null)
      setQuantity(1)
      onClose()
    } else if (mode === 'multiple' && selectedProducts.size > 0) {
      const productsToAdd = Array.from(selectedProducts.entries()).map(([productId, qty]) => {
        const product = products.find(p => p.id === productId)!
        return { product, quantity: qty }
      })
      
      if (onSelectMultiple) {
        onSelectMultiple(productsToAdd)
      } else {
        // Fallback to single selection
        productsToAdd.forEach(({ product, quantity }) => {
          onSelectProduct(product, quantity)
        })
      }
      
      setSelectedProducts(new Map())
      onClose()
    }
  }

  const toggleProductSelection = (product: Product) => {
    const newSelected = new Map(selectedProducts)
    if (newSelected.has(product.id)) {
      newSelected.delete(product.id)
    } else {
      newSelected.set(product.id, 1)
    }
    setSelectedProducts(newSelected)
  }

  const updateProductQuantity = (productId: string, qty: number) => {
    const newSelected = new Map(selectedProducts)
    if (qty > 0) {
      newSelected.set(productId, qty)
    } else {
      newSelected.delete(productId)
    }
    setSelectedProducts(newSelected)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-6xl overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-2xl font-bold text-gray-900">
              Pilih Produk
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari produk (nama atau kode)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode('multiple')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  mode === 'multiple'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                ☑️ Pilih Multiple
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('single')
                  setSelectedProducts(new Map())
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  mode === 'single'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                ☝️ Pilih Satu
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const isSelected = mode === 'multiple' 
                    ? selectedProducts.has(product.id)
                    : selectedProduct?.id === product.id
                  
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        if (mode === 'multiple') {
                          toggleProductSelection(product)
                        } else {
                          setSelectedProduct(product)
                        }
                      }}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md relative ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {mode === 'multiple' && (
                        <div className="absolute top-2 right-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProductSelection(product)}
                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm pr-8">{product.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Stok: {product.stock}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">Kode: {product.code}</p>
                      {product.category && (
                        <p className="text-xs text-gray-500 mb-2">
                          Kategori: {product.category.name}
                        </p>
                      )}
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(product.sellingPrice)}
                      </p>

                      {mode === 'multiple' && isSelected && (
                        <div className="mt-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                          <label className="block text-xs text-gray-600 mb-1">Qty:</label>
                          <input
                            type="number"
                            value={selectedProducts.get(product.id) || 1}
                            onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                            min="1"
                            max={product.stock}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Produk tidak ditemukan</p>
                <p className="text-sm">Coba ubah pencarian atau filter</p>
              </div>
            )}
          </div>

          {/* Footer - Selected Product */}
          {((mode === 'single' && selectedProduct) || (mode === 'multiple' && selectedProducts.size > 0)) && (
            <div className="p-6 border-t bg-gray-50">
              {mode === 'single' && selectedProduct ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Produk Dipilih:</p>
                    <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-600">
                      Harga: {formatCurrency(selectedProduct.sellingPrice)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jumlah
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.min(parseInt(e.target.value) || 1, selectedProduct.stock))}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                        min="1"
                        max={selectedProduct.stock}
                      />
                      <p className="text-xs text-gray-500 mt-1">Maks: {selectedProduct.stock}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtotal
                      </label>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(selectedProduct.sellingPrice * quantity)}
                      </p>
                    </div>
                    <Button onClick={handleAddToCart} className="mt-6">
                      <FaShoppingCart className="inline mr-2" />
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Produk Dipilih:</p>
                      <p className="font-semibold text-gray-900">{selectedProducts.size} produk</p>
                    </div>
                    <Button onClick={handleAddToCart} variant="primary">
                      <FaShoppingCart className="inline mr-2" />
                      Tambah {selectedProducts.size} Item ke Keranjang
                    </Button>
                  </div>
                  <div className="max-h-24 overflow-y-auto text-xs text-gray-600">
                    {Array.from(selectedProducts.entries()).map(([productId, qty]) => {
                      const product = products.find(p => p.id === productId)
                      return product ? (
                        <div key={productId} className="flex justify-between py-1">
                          <span>{product.name}</span>
                          <span>x{qty}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
