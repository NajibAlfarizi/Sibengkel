import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch payment history for a payable
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  try {
    // Fetch all payment records for this payable
    const payments = await prisma.payablePayment.findMany({
      where: { payableId: id },
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

// POST - Create a new payment for payable
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

    // Get payable
    const payable = await prisma.payable.findUnique({
      where: { id },
    })

    if (!payable) {
      return NextResponse.json(
        { error: 'Payable not found' },
        { status: 404 }
      )
    }

    // Check if payment exceeds remaining
    if (body.amount > payable.remaining) {
      return NextResponse.json(
        { error: 'Payment amount exceeds remaining balance' },
        { status: 400 }
      )
    }

    // Create payment record
    const payment = await prisma.payablePayment.create({
      data: {
        payableId: id,
        amount: body.amount,
        paymentMethod: body.paymentMethod || 'CASH',
        notes: body.notes || '',
        date: new Date(),
      },
    })

    // Update payable
    const newPaidAmount = payable.paidAmount + body.amount
    const newRemaining = payable.remaining - body.amount
    const newStatus = newRemaining === 0 ? 'LUNAS' : payable.status

    await prisma.payable.update({
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
