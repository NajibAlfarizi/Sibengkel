import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get products with low stock
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { stock: 'asc' },
    })
    
    const lowStockProducts = products.filter((p: any) => p.stock <= p.minStock)
    const outOfStockProducts = products.filter((p: any) => p.stock === 0)
    
    // Calculate total stock value
    const totalStockValue = products.reduce((sum: number, p: any) => sum + (p.stock * p.purchasePrice), 0)
    const totalSellingValue = products.reduce((sum: number, p: any) => sum + (p.stock * p.sellingPrice), 0)
    const potentialProfit = totalSellingValue - totalStockValue
    
    // Group by category
    const stockByCategory = products.reduce((acc: any, p: any) => {
      const categoryName = p.category.name
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: categoryName,
          totalProducts: 0,
          totalStock: 0,
          totalValue: 0,
        }
      }
      acc[categoryName].totalProducts += 1
      acc[categoryName].totalStock += p.stock
      acc[categoryName].totalValue += p.stock * p.purchasePrice
      return acc
    }, {})
    
    return NextResponse.json({
      summary: {
        totalProducts: products.length,
        lowStockProducts: lowStockProducts.length,
        outOfStockProducts: outOfStockProducts.length,
        totalStockValue,
        totalSellingValue,
        potentialProfit,
      },
      lowStockProducts,
      outOfStockProducts,
      stockByCategory: Object.values(stockByCategory),
      allProducts: products,
    })
  } catch (error) {
    console.error('Stock report error:', error)
    return NextResponse.json({ error: 'Failed to generate stock report' }, { status: 500 })
  }
}
