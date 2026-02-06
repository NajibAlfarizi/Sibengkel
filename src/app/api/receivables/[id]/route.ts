import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch single receivable
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const receivable = await prisma.receivable.findUnique({
      where: { id },
    })

    if (!receivable) {
      return NextResponse.json(
        { error: 'Receivable not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(receivable)
  } catch (error) {
    console.error('Error fetching receivable:', error)
    return NextResponse.json(
      { error: 'Failed to fetch receivable' },
      { status: 500 }
    )
  }
}

// DELETE - Delete receivable
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    // Delete all related payments first (cascade)
    await prisma.receivablePayment.deleteMany({
      where: { receivableId: id },
    })

    // Then delete the receivable
    await prisma.receivable.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Receivable deleted successfully' })
  } catch (error) {
    console.error('Error deleting receivable:', error)
    return NextResponse.json(
      { error: 'Failed to delete receivable' },
      { status: 500 }
    )
  }
}
