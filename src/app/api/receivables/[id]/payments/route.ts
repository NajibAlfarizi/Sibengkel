import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch payment history for a receivable
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    // Fetch all payment records for this receivable
    const payments = await prisma.receivablePayment.findMany({
      where: { receivableId: id },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

// POST - Create a new payment for receivable
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    const body = await request.json()

    // Validate payment amount
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      )
    }

    // Get receivable
    const receivable = await prisma.receivable.findUnique({
      where: { id },
    })

    if (!receivable) {
      return NextResponse.json(
        { error: 'Receivable not found' },
        { status: 404 }
      )
    }

    // Check if payment exceeds remaining
    if (body.amount > receivable.remaining) {
      return NextResponse.json(
        { error: 'Payment amount exceeds remaining balance' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await prisma.receivablePayment.create({
      data: {
        receivableId: id,
        amount: body.amount,
        paymentMethod: body.paymentMethod || 'CASH',
        notes: body.notes || '',
        date: new Date(),
      },
    })

    // Update receivable
    const newPaidAmount = receivable.paidAmount + body.amount
    const newRemaining = receivable.remaining - body.amount
    const newStatus = newRemaining === 0 ? 'LUNAS' : receivable.status

    await prisma.receivable.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        remaining: newRemaining,
        status: newStatus,
      },
    })

    return NextResponse.json(payment, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
