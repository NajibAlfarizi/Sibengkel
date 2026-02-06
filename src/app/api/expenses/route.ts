import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const category = searchParams.get('category')
    
    const where: any = {}
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }
    
    if (category) {
      where.category = category
    }
    
    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    })
    
    return NextResponse.json(expenses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Parse date properly to avoid timezone issues
    let expenseDate = new Date(body.date)
    // If only date string provided (YYYY-MM-DD), set to current local time
    if (body.date && !body.date.includes('T')) {
      const now = new Date()
      expenseDate = new Date(body.date + 'T' + now.toTimeString().split(' ')[0])
    }
    
    const expense = await prisma.expense.create({
      data: {
        date: expenseDate,
        category: body.category,
        amount: body.amount,
        description: body.description,
      },
    })
    
    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
  }
}
