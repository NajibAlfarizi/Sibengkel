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
    
    // Get purchase transactions
    const purchaseTransactions = await prisma.transaction.findMany({
      where: {
        type: 'PEMBELIAN',
        status: 'COMPLETED',
        ...dateFilter,
      },
      include: {
        supplier: true,
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
    const totalPurchases = purchaseTransactions.reduce((sum: number, t: any) => sum + t.total, 0)
    const totalTransactions = purchaseTransactions.length
    
    // Group by supplier
    const purchasesBySupplier = purchaseTransactions.reduce((acc: any, t: any) => {
      if (t.supplier) {
        const supplierId = t.supplier.id
        if (!acc[supplierId]) {
          acc[supplierId] = {
            supplier: t.supplier,
            total: 0,
            count: 0,
          }
        }
        acc[supplierId].total += t.total
        acc[supplierId].count += 1
      }
      return acc
    }, {})
    
    // Group by category
    const purchasesByCategory = purchaseTransactions.reduce((acc: any, t: any) => {
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
    
    return NextResponse.json({
      summary: {
        totalPurchases,
        totalTransactions,
        averageTransaction: totalTransactions > 0 ? totalPurchases / totalTransactions : 0,
      },
      transactions: purchaseTransactions,
      purchasesBySupplier: Object.values(purchasesBySupplier),
      purchasesByCategory: Object.values(purchasesByCategory),
    })
  } catch (error) {
    console.error('Purchase report error:', error)
    return NextResponse.json({ error: 'Failed to generate purchase report' }, { status: 500 })
  }
}
