import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { phone: { contains: search } },
      ]
    }
    
    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const supplier = await prisma.supplier.create({
      data: {
        code: body.code,
        name: body.name,
        companyName: body.companyName,
        phone: body.phone,
        email: body.email,
        address: body.address,
      },
    })
    
    return NextResponse.json(supplier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}
