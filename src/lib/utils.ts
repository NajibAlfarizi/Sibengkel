export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateCode(prefix: string, lastNumber: number): string {
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0')
  return `${prefix}${nextNumber}`
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV${year}${month}${day}${random}`
}

export function generateProductCode(lastCode?: string): string {
  if (!lastCode) return 'PRD001'
  const num = parseInt(lastCode.replace('PRD', '')) || 0
  return `PRD${(num + 1).toString().padStart(3, '0')}`
}

export function generateCustomerCode(lastCode?: string): string {
  if (!lastCode) return 'CUST001'
  const num = parseInt(lastCode.replace('CUST', '')) || 0
  return `CUST${(num + 1).toString().padStart(3, '0')}`
}

export function generateSupplierCode(lastCode?: string): string {
  if (!lastCode) return 'SUP001'
  const num = parseInt(lastCode.replace('SUP', '')) || 0
  return `SUP${(num + 1).toString().padStart(3, '0')}`
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone: string): boolean {
  const re = /^(\+62|62|0)[0-9]{9,12}$/
  return re.test(phone.replace(/[\s-]/g, ''))
}

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header]
        if (cell === null || cell === undefined) return ''
        if (typeof cell === 'object') return JSON.stringify(cell)
        return `"${cell}"`
      }).join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}
