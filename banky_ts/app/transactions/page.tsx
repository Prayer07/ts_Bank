'use client'

import { useEffect, useState } from 'react'

interface Transaction {
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
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Transaction History</h1>
      <ul className="space-y-3">
        {transactions.map((tx, index) => (
          <li
            key={index}
            className="bg-white p-4 rounded shadow text-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold capitalize">{tx.type}</p>
              {tx.to && <p className="text-xs text-gray-500">To: {tx.to}</p>}
              {tx.from && <p className="text-xs text-gray-500">From: {tx.from}</p>}
            </div>
            <div className={`font-bold ${tx.type === 'withdraw' ? 'text-red-500' : 'text-green-600'}`}>
              ₦{tx.amount.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
