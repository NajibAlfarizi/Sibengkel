import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const result = await prisma.$transaction(async (tx: any) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          transactionId: id,
          amount: body.amount,
          paymentDate: new Date(body.paymentDate),
          paymentMethod: body.paymentMethod,
          notes: body.notes,
        },
      })
      
      // Get current transaction
      const transaction = await tx.transaction.findUnique({
        where: { id },
      })
      
      if (!transaction) {
        throw new Error('Transaction not found')
      }
      
      const newPaidAmount = transaction.paidAmount + body.amount
      const newRemainingAmount = transaction.total - newPaidAmount
      const newPaymentStatus = newRemainingAmount <= 0 ? 'LUNAS' : 'CICILAN'
      
      // Update transaction
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          paymentStatus: newPaymentStatus,
        },
      })
      
      // Update receivable/payable
      if (transaction.type === 'PENJUALAN' && transaction.customerId) {
        const receivable = await tx.receivable.findFirst({
          where: {
            customerId: transaction.customerId,
            description: { contains: transaction.invoiceNumber },
          },
        })
        
        if (receivable) {
          await tx.receivable.update({
            where: { id: receivable.id },
            data: {
              paidAmount: newPaidAmount,
              remaining: newRemainingAmount,
              status: newPaymentStatus,
            },
          })
        }
      } else if (transaction.type === 'PEMBELIAN' && transaction.supplierId) {
        const payable = await tx.payable.findFirst({
          where: {
            supplierId: transaction.supplierId,
            description: { contains: transaction.invoiceNumber },
          },
        })
        
        if (payable) {
          await tx.payable.update({
            where: { id: payable.id },
            data: {
              paidAmount: newPaidAmount,
              remaining: newRemainingAmount,
              status: newPaymentStatus,
            },
          })
        }
      }
      
      return { payment, transaction: updatedTransaction }
    })
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment error:', error)
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 })
  }
}
