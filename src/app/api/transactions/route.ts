import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const where: any = {}
    
    if (type) {
      where.type = type
    }
    
    if (status) {
      where.status = status
    }
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        customer: true,
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })
    
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Create transaction with items
    const transaction = await prisma.$transaction(async (tx: any) => {
      // Parse date properly to avoid timezone issues
      let transactionDate = new Date(body.date)
      // If only date string provided (YYYY-MM-DD), set to current local time
      if (body.date && !body.date.includes('T')) {
        const now = new Date()
        transactionDate = new Date(body.date + 'T' + now.toTimeString().split(' ')[0])
      }
      
      // Create the transaction
      const transactionData: any = {
        invoiceNumber: body.invoiceNumber,
        type: body.type,
        date: transactionDate,
        subtotal: body.subtotal,
        discount: body.discount || 0,
        tax: body.tax || 0,
        total: body.total,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus,
        paidAmount: body.paidAmount || 0,
        remainingAmount: body.remainingAmount || 0,
        status: body.status || 'COMPLETED',
        notes: body.notes || '',
      }

      // Handle customer (either ID or manual name)
      if (body.customerId) {
        transactionData.customerId = body.customerId
      } else if (body.customerName) {
        transactionData.notes = `Customer: ${body.customerName}${body.notes ? ' | ' + body.notes : ''}`
      }

      // Handle supplier
      if (body.supplierId) {
        transactionData.supplierId = body.supplierId
      }

      const newTransaction = await tx.transaction.create({
        data: transactionData,
      })
      
      // Create transaction items from products
      if (body.items && body.items.length > 0) {
        for (const item of body.items) {
          await tx.transactionItem.create({
            data: {
              transactionId: newTransaction.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount || 0,
              subtotal: item.subtotal,
            },
          })
          
          // Update product stock
          if (body.type === 'PENJUALAN') {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            })
          } else if (body.type === 'PEMBELIAN') {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  increment: item.quantity,
                },
              },
            })
          }
        }
      }

      // Handle manual items (items that are not in database)
      if (body.manualItems && body.manualItems.length > 0) {
        const manualItemsText = body.manualItems
          .map((item: any) => `${item.name} (${item.quantity}x @ Rp${item.price.toLocaleString()})`)
          .join(', ')
        
        // Append to notes
        await tx.transaction.update({
          where: { id: newTransaction.id },
          data: {
            notes: `${transactionData.notes}${transactionData.notes ? ' | ' : ''}Manual Items: ${manualItemsText}`,
          },
        })
      }
      
      // Create receivable/payable if payment status is not LUNAS
      if (body.paymentStatus !== 'LUNAS' && body.remainingAmount > 0) {
        if (body.type === 'PENJUALAN' && body.customerId) {
          // Get customer name
          const customer = await tx.customer.findUnique({
            where: { id: body.customerId },
            select: { name: true }
          })
          
          await tx.receivable.create({
            data: {
              customerId: body.customerId,
              customer: customer?.name || 'Unknown',
              amount: body.total,
              paidAmount: body.paidAmount || 0,
              remaining: body.remainingAmount,
              status: body.paymentStatus,
              description: `Invoice ${body.invoiceNumber}`,
            },
          })
        } else if (body.type === 'PEMBELIAN' && body.supplierId) {
          // Get supplier name
          const supplier = await tx.supplier.findUnique({
            where: { id: body.supplierId },
            select: { name: true }
          })
          
          await tx.payable.create({
            data: {
              supplierId: body.supplierId,
              supplier: supplier?.name || 'Unknown',
              amount: body.total,
              paidAmount: body.paidAmount || 0,
              remaining: body.remainingAmount,
              status: body.paymentStatus,
              description: `Invoice ${body.invoiceNumber}`,
            },
          })
        }
      }
      
      return newTransaction
    })
    
    // Fetch complete transaction
    const completeTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
      include: {
        customer: true,
        supplier: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })
    
    return NextResponse.json(completeTransaction, { status: 201 })
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
