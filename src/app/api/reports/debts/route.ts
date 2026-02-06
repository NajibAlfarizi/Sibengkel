import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const whereReceivable: any = {}
    const wherePayable: any = {}
    
    if (status) {
      whereReceivable.status = status
      wherePayable.status = status
    }
    
    // Get receivables (piutang)
    const receivables = await prisma.receivable.findMany({
      where: whereReceivable,
      orderBy: { createdAt: 'desc' },
    })
    
    // Get payables (hutang)
    const payables = await prisma.payable.findMany({
      where: wherePayable,
      orderBy: { createdAt: 'desc' },
    })
    
    // Calculate receivables summary
    const totalReceivables = receivables.reduce((sum: number, r: any) => sum + r.amount, 0)
    const totalReceivablesPaid = receivables.reduce((sum: number, r: any) => sum + r.paidAmount, 0)
    const totalReceivablesRemaining = receivables.reduce((sum: number, r: any) => sum + r.remaining, 0)
    
    // Calculate payables summary
    const totalPayables = payables.reduce((sum: number, p: any) => sum + p.amount, 0)
    const totalPayablesPaid = payables.reduce((sum: number, p: any) => sum + p.paidAmount, 0)
    const totalPayablesRemaining = payables.reduce((sum: number, p: any) => sum + p.remaining, 0)
    
    // Group receivables by customer
    const receivablesByCustomer = receivables.reduce((acc: any, r: any) => {
      const customerName = r.customer || 'Unknown Customer'
      if (!acc[customerName]) {
        acc[customerName] = {
          customer: { name: customerName }, // Format as object with name property
          total: 0,
          paid: 0,
          remaining: 0,
          count: 0,
        }
      }
      acc[customerName].total += r.amount
      acc[customerName].paid += r.paidAmount
      acc[customerName].remaining += r.remaining
      acc[customerName].count += 1
      return acc
    }, {})
    
    // Group payables by supplier
    const payablesBySupplier = payables.reduce((acc: any, p: any) => {
      const supplierName = p.supplier || 'Unknown Supplier'
      if (!acc[supplierName]) {
        acc[supplierName] = {
          supplier: { name: supplierName }, // Format as object with name property
          total: 0,
          paid: 0,
          remaining: 0,
          count: 0,
        }
      }
      acc[supplierName].total += p.amount
      acc[supplierName].paid += p.paidAmount
      acc[supplierName].remaining += p.remaining
      acc[supplierName].count += 1
      return acc
    }, {})
    
    return NextResponse.json({
      receivables: {
        summary: {
          total: totalReceivables,
          paid: totalReceivablesPaid,
          remaining: totalReceivablesRemaining,
          count: receivables.length,
        },
        data: receivables,
        byCustomer: Object.values(receivablesByCustomer),
      },
      payables: {
        summary: {
          total: totalPayables,
          paid: totalPayablesPaid,
          remaining: totalPayablesRemaining,
          count: payables.length,
        },
        data: payables,
        bySupplier: Object.values(payablesBySupplier),
      },
    })
  } catch (error) {
    console.error('Debt report error:', error)
    return NextResponse.json({ error: 'Failed to generate debt report' }, { status: 500 })
  }
}
