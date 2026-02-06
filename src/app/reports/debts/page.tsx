'use client'

import { useEffect, useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { FaMoneyBillWave, FaPrint, FaDownload, FaUsers, FaTruck, FaChartLine, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

export default function DebtsReportPage() {
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/reports/debts')
      const data = await res.json()
      setReport(data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat laporan hutang piutang...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaMoneyBillWave className="text-cyan-600" />
              Laporan Hutang Piutang
            </h1>
            <p className="text-gray-600">Monitoring kewajiban dan tagihan bisnis secara komprehensif</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md flex items-center gap-2"
            >
              <FaPrint /> Print
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors shadow-md flex items-center gap-2">
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Receivables Summary */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <FaChartLine className="text-blue-600 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-900">Piutang (Receivables)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaMoneyBillWave className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Total Piutang</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(report?.receivables?.summary?.total || 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaCheckCircle className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Sudah Dibayar</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(report?.receivables?.summary?.paid || 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaExclamationCircle className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Belum Dibayar</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(report?.receivables?.summary?.remaining || 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaUsers className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Jumlah Customer</p>
                <p className="text-3xl font-bold mt-1">{report?.receivables?.summary?.count || 0}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaUsers className="text-blue-600" />
            Piutang per Customer
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Dibayar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Sisa
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                    Transaksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report?.receivables?.byCustomer?.length > 0 ? (
                  report.receivables.byCustomer.map((item: any, index: number) => (
                    <tr 
                      key={index} 
                      className="hover:bg-blue-50 transition-colors duration-200 hover:shadow-md"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{item.customer?.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600">{formatCurrency(item.total)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">{formatCurrency(item.paid)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-red-600">{formatCurrency(item.remaining)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                          {item.count} transaksi
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data piutang
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payables Summary */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <FaChartLine className="text-orange-600 text-2xl" />
          <h2 className="text-3xl font-bold text-gray-900">Hutang (Payables)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaMoneyBillWave className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Total Hutang</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(report?.payables?.summary?.total || 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaCheckCircle className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Sudah Dibayar</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(report?.payables?.summary?.paid || 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaExclamationCircle className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Belum Dibayar</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(report?.payables?.summary?.remaining || 0)}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaTruck className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold opacity-90">Jumlah Supplier</p>
                <p className="text-3xl font-bold mt-1">{report?.payables?.summary?.count || 0}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1 rounded-full"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaTruck className="text-orange-600" />
            Hutang per Supplier
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tl-xl">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Dibayar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase">
                    Sisa
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold uppercase rounded-tr-xl">
                    Transaksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {report?.payables?.bySupplier?.length > 0 ? (
                  report.payables.bySupplier.map((item: any, index: number) => (
                    <tr 
                      key={index} 
                      className="hover:bg-orange-50 transition-colors duration-200 hover:shadow-md"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">{item.supplier?.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-orange-600">{formatCurrency(item.total)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-green-600">{formatCurrency(item.paid)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-red-600">{formatCurrency(item.remaining)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                          {item.count} transaksi
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Tidak ada data hutang
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
