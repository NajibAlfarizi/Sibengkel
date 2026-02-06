import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single payable
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const payable = await prisma.payable.findUnique({
      where: { id },
    })

    if (!payable) {
      return NextResponse.json(
        { error: 'Payable not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(payable)
  } catch (error) {
    console.error('Error fetching payable:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payable' },
      { status: 500 }
    )
  }
}

// DELETE - Delete payable
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    // Delete all related payments first (cascade)
    await prisma.payablePayment.deleteMany({
      where: { payableId: id },
    })

    // Then delete the payable
    await prisma.payable.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Payable deleted successfully' })
  } catch (error) {
    console.error('Error deleting payable:', error)
    return NextResponse.json(
      { error: 'Failed to delete payable' },
      { status: 500 }
    )
  }
}
