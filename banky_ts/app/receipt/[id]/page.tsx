'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Transaction {
  _id: string
  type: 'add' | 'withdraw' | 'transfer'
  amount: number
  to?: string
  from?: string
  date: string
}

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchReceipt = async () => {
      try {
        const res = await fetch(`/api/receipt?id=${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setTransaction(data.transaction)
      } catch (err) {
        console.error('Error fetching receipt:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipt()
  }, [id])

  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined') return

    const element = document.getElementById('receipt-content')
    if (!element) return

    try {
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .from(element)
        .set({
          margin: 0.5,
          filename: 'receipt.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .save()
    } catch (error) {
      console.error('PDF generation failed:', error)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading receipt...</div>
  if (!transaction) return <div style={{ padding: '2rem', color: 'red' }}>Receipt not found.</div>

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#f3f4f6' }} // bg-gray-100
    >
      <motion.div
        id="receipt-content"
        className="shadow-2xl rounded-xl p-6 w-full max-w-md"
        style={{ backgroundColor: '#ffffff' }} // bg-white
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-2xl font-bold text-center mb-4"
          style={{ color: '#16a34a' }} // text-green-600
        >
          Payment Receipt
        </h2>

        <div className="space-y-3" style={{ color: '#374151' }}> {/* text-gray-700 */}
          <p><strong>Transaction ID:</strong> {transaction._id}</p>
          <p><strong>Type:</strong> {transaction.type.toUpperCase()}</p>
          <p><strong>Amount:</strong> ₦{transaction.amount.toLocaleString()}</p>
          {transaction.type === 'transfer' && (
            <>
              <p><strong>From:</strong> {transaction.from}</p>
              <p><strong>To:</strong> {transaction.to}</p>
            </>
          )}
          <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="mt-6 px-4 py-2 rounded w-full transition"
          style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
        >
          📄 Download as PDF
        </button>

        <button
          onClick={() => window.print()}
          className="mt-4 px-4 py-2 rounded w-full transition"
          style={{ backgroundColor: '#4b5563', color: '#ffffff' }} // bg-gray-600
        >
          🖨️ Print Receipt
        </button>

        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 rounded w-full transition"
          style={{ backgroundColor: '#2563eb', color: '#ffffff' }} // bg-blue-600
        >
          ← Back
        </button>
      </motion.div>
    </div>
  )
}
