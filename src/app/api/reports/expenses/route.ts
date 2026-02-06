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
    
    // Get expenses
    const expenses = await prisma.expense.findMany({
      where: dateFilter,
      orderBy: { date: 'desc' },
    })
    
    // Calculate summary
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
    
    // Group by category
    const expensesByCategory = expenses.reduce((acc: any, e: any) => {
      const category = e.category
      if (!acc[category]) {
        acc[category] = { category, total: 0, count: 0 }
      }
      acc[category].total += e.amount
      acc[category].count += 1
      return acc
    }, {})
    
    // Group by date
    const expensesByDate = expenses.reduce((acc: any, e: any) => {
      const date = e.date.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, total: 0, count: 0 }
      }
      acc[date].total += e.amount
      acc[date].count += 1
      return acc
    }, {})
    
    return NextResponse.json({
      summary: {
        totalExpenses,
        totalTransactions: expenses.length,
        averageExpense: expenses.length > 0 ? totalExpenses / expenses.length : 0,
      },
      expenses,
      expensesByCategory: Object.values(expensesByCategory),
      expensesByDate: Object.values(expensesByDate),
    })
  } catch (error) {
    console.error('Expense report error:', error)
    return NextResponse.json({ error: 'Failed to generate expense report' }, { status: 500 })
  }
}
