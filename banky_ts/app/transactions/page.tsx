'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Transaction {
  _id: string
  type: string
  amount: number
  to?: string
  from?: string
  date: string
}


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchTx = async () => {
      const token = sessionStorage.getItem('token')
      const res = await fetch('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setTransactions(data.transactions || [])
    }

    fetchTx()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Transaction History</h1>
      <ul className="space-y-3">
        {transactions.map((tx, i) => (
  <div key={i} className="money-box shadow p-4 rounded mb-4">
    <p><strong>Type:</strong> {tx.type.toUpperCase()}</p>
    <p><strong>Amount:</strong> ₦{tx.amount.toLocaleString()}</p>
    {tx.to && <p><strong>To:</strong> {tx.to}</p>}
    {tx.from && <p><strong>From:</strong> {tx.from}</p>}
    <p><strong>Date:</strong> {new Date(tx.date).toLocaleString()}</p>

    {/* 👇 View Receipt Link */}
    <Link href={`/receipt/${tx._id}`}>
      <button className="mt-2 text-blue-600 hover:underline">
        View Receipt →
      </button>
    </Link>
  </div>
))}

      </ul>
    </div>
  )
}
