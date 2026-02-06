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
    
    // Get sales
    const sales = await prisma.transaction.findMany({
      where: {
        type: 'PENJUALAN',
        status: 'COMPLETED',
        ...dateFilter,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
    
    // Get purchases
    const purchases = await prisma.transaction.findMany({
      where: {
        type: 'PEMBELIAN',
        status: 'COMPLETED',
        ...dateFilter,
      },
    })
    
    // Get expenses
    const expenses = await prisma.expense.findMany({
      where: dateFilter,
    })
    
    // Calculate totals
    const totalRevenue = sales.reduce((sum: number, s: any) => sum + s.total, 0)
    
    // Calculate CORRECT COGS from products sold (using purchasePrice)
    let totalCOGS = 0
    for (const sale of sales) {
      for (const item of sale.items) {
        // Use purchasePrice from product
        const itemCOGS = item.quantity * (item.product.purchasePrice || 0)
        totalCOGS += itemCOGS
      }
    }
    
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
    const grossProfit = totalRevenue - totalCOGS
    const netProfit = grossProfit - totalExpenses
    
    // Profit margin
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
    const netProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    
    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        transactionCount: sales.length,
      },
      cogs: {
        total: totalCOGS,
        transactionCount: purchases.length,
      },
      expenses: {
        total: totalExpenses,
        transactionCount: expenses.length,
      },
      profit: {
        gross: grossProfit,
        net: netProfit,
        grossMargin: grossProfitMargin,
        netMargin: netProfitMargin,
      },
    })
  } catch (error) {
    console.error('Profit report error:', error)
    return NextResponse.json({ error: 'Failed to generate profit report' }, { status: 500 })
  }
}
