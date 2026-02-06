import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    
    if (type) {
      where.type = type
    }
    
    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const customer = await prisma.customer.create({
      data: {
        code: body.code,
        name: body.name,
        type: body.type,
        companyName: body.companyName,
        phone: body.phone,
        email: body.email,
        address: body.address,
      },
    })
    
    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
