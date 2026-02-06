import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        transactions: {
          include: {
            items: true,
          },
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
    })
    
    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }
    
    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        code: body.code,
        name: body.name,
        companyName: body.companyName,
        phone: body.phone,
        email: body.email,
        address: body.address,
      },
    })
    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.supplier.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Supplier deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
  }
}
