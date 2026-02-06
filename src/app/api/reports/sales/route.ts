import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const dateFilter = startDate && endDate ? {
      date: {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000),
      },
    } : {}
    
    // Get sales transactions
    const salesTransactions = await prisma.transaction.findMany({
      where: {
        type: 'PENJUALAN',
        status: 'COMPLETED',
        ...dateFilter,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    })
    
    // Calculate summary
    const totalSales = salesTransactions.reduce((sum: number, t: any) => sum + t.total, 0)
    const totalDiscount = salesTransactions.reduce((sum: number, t: any) => sum + t.discount, 0)
    const totalTransactions = salesTransactions.length
    
    // Group by date
    const salesByDate = salesTransactions.reduce((acc: any, t: any) => {
      const date = t.date.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, total: 0, count: 0 }
      }
      acc[date].total += t.total
      acc[date].count += 1
      return acc
    }, {})
    
    // Group by category
    const salesByCategory = salesTransactions.reduce((acc: any, t: any) => {
      t.items.forEach((item: any) => {
        const categoryName = item.product.category.name
        if (!acc[categoryName]) {
          acc[categoryName] = { category: categoryName, total: 0, quantity: 0 }
        }
        acc[categoryName].total += item.subtotal
        acc[categoryName].quantity += item.quantity
      })
      return acc
    }, {})
    
    // Top products
    const productSales = salesTransactions.reduce((acc: any, t: any) => {
      t.items.forEach((item: any) => {
        const productId = item.product.id
        if (!acc[productId]) {
          acc[productId] = {
            product: item.product,
            totalQuantity: 0,
            totalRevenue: 0,
          }
        }
        acc[productId].totalQuantity += item.quantity
        acc[productId].totalRevenue += item.subtotal
      })
      return acc
    }, {})
    
    const topProducts = Object.values(productSales)
      .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10)
    
    return NextResponse.json({
      summary: {
        totalSales,
        totalDiscount,
        totalTransactions,
        averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0,
      },
      transactions: salesTransactions,
      salesByDate: Object.values(salesByDate),
      salesByCategory: Object.values(salesByCategory),
      topProducts,
    })
  } catch (error) {
    console.error('Sales report error:', error)
    return NextResponse.json({ error: 'Failed to generate sales report' }, { status: 500 })
  }
}
