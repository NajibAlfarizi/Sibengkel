import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')
    
    const where: any = {}
    
    if (customerId) {
      where.customerId = customerId
    }
    
    if (status) {
      where.status = status
    }
    
    const receivables = await prisma.receivable.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(receivables)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch receivables' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const receivable = await prisma.receivable.create({
      data: {
        customerId: body.customerId,
        customer: body.customer,
        amount: body.amount,
        paidAmount: body.paidAmount || 0,
        remaining: body.amount - (body.paidAmount || 0),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: body.status || 'BELUM_LUNAS',
        description: body.description,
      },
    })
    
    return NextResponse.json(receivable, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create receivable' }, { status: 500 })
  }
}
