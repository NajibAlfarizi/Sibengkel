import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const categoryId = searchParams.get('categoryId')
    
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ]
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    })
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Creating product with data:', body)
    
    // Validate required fields
    if (!body.code || !body.name || !body.categoryId) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: 'code, name, and categoryId are required'
      }, { status: 400 })
    }

    // Check if code already exists
    const existingProduct = await prisma.product.findUnique({
      where: { code: body.code },
    })

    if (existingProduct) {
      return NextResponse.json({ 
        error: 'Kode produk sudah digunakan',
        details: `Kode "${body.code}" sudah digunakan oleh produk lain. Silakan gunakan kode yang berbeda atau generate otomatis.`
      }, { status: 400 })
    }

    // Parse and validate numeric fields
    const stock = parseInt(body.stock) || 0
    const purchasePrice = parseFloat(body.purchasePrice)
    const sellingPrice = parseFloat(body.sellingPrice)
    const minStock = parseInt(body.minStock) || 5

    if (isNaN(purchasePrice) || isNaN(sellingPrice)) {
      return NextResponse.json({ 
        error: 'Invalid price values',
        details: 'purchasePrice and sellingPrice must be valid numbers'
      }, { status: 400 })
    }
    
    const product = await prisma.product.create({
      data: {
        code: body.code,
        name: body.name,
        description: body.description || null,
        categoryId: body.categoryId,
        stock: stock,
        purchasePrice: purchasePrice,
        sellingPrice: sellingPrice,
        minStock: minStock,
      },
      include: {
        category: true,
      },
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
