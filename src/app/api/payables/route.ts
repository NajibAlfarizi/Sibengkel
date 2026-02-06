import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const supplierId = searchParams.get('supplierId')
    const status = searchParams.get('status')
    
    const where: any = {}
    
    if (supplierId) {
      where.supplierId = supplierId
    }
    
    if (status) {
      where.status = status
    }
    
    const payables = await prisma.payable.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(payables)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payables' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const payable = await prisma.payable.create({
      data: {
        supplierId: body.supplierId,
        supplier: body.supplier,
        amount: body.amount,
        paidAmount: body.paidAmount || 0,
        remaining: body.amount - (body.paidAmount || 0),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: body.status || 'BELUM_LUNAS',
        description: body.description,
      },
    })
    
    return NextResponse.json(payable, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payable' }, { status: 500 })
  }
}
