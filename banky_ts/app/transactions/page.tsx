'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import GoogleTransactions from '../../components/GoogleTransactions'
import { motion } from 'framer-motion'

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
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)

    // 🔹 Case 1: JWT users (local signup)
    useEffect(() => {
        if (!session) {
        const fetchTx = async () => {
            try {
            const token = sessionStorage.getItem('token')
            if (!token) return
            setLoading(true)

            const res = await fetch('/api/transactions/history', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setTransactions(data.transactions || [])
            } catch (err) {
            console.error('Fetch error:', err)
            } finally {
            setLoading(false)
            }
        }

        fetchTx()
        }
    }, [session])

    // 🔹 Case 2: Google users (next-auth)
    if (session) {
        return <GoogleTransactions email={session.user?.email || ''} />
    }

    // 🔹 Loading animation
    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            >
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
            <p className="text-green-500 font-medium">Loading transactions...</p>
            </motion.div>
        </div>
        )
    }

    // 🔹 Default: JWT users view
    return (
        <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Transaction History</h1>

        <ul className="space-y-4">
            {transactions.map((tx) => (
            <div
                key={tx._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md"
            >
                <p>
                <span className="font-semibold">Type:</span> {tx.type.toUpperCase()}
                </p>
                <p>
                <span className="font-semibold">Amount:</span> ₦
                {tx.amount.toLocaleString()}
                </p>
                {tx.to && (
                <p>
                    <span className="font-semibold">To:</span> {tx.to}
                </p>
                )}
                {tx.from && (
                <p>
                    <span className="font-semibold">From:</span> {tx.from}
                </p>
                )}
                <p>
                <span className="font-semibold">Date:</span>{' '}
                {new Date(tx.date).toLocaleString()}
                </p>

                <Link href={`/receipt/${tx._id}`}>
                <button className="mt-3 text-green-500 hover:text-green-400 transition-colors font-medium">
                    View Receipt →
                </button>
                </Link>
            </div>
            ))}
        </ul>
        </div>
    )
}