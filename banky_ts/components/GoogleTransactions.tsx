"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Transaction {
    _id: string
    type: string
    amount: number
    to?: string
    from?: string
    date: string
}

type Props = {
  email: string // Google email
}

export default function GoogleTransactions({ email }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTx = async () => {
        try {
            const res = await fetch(`/api/transactions/google/history?email=${email}`)
            const data = await res.json()

            if (!res.ok) {
            console.error("Error fetching:", data.error)
            setTransactions([])
            } else {
            setTransactions(data.transactions || [])
            }
        } catch (err) {
            console.error("Fetch error:", err)
        } finally {
            setLoading(false)
        }
        }

        if (email) fetchTx()
    }, [email])

    if (loading){
        return(
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

    return (
        <div className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Transaction History</h1>

        {transactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions found.</p>
        ) : (
            <ul className="space-y-4">
            {transactions.map((tx) => (
                <div
                key={tx._id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-md"
                >
                <p><span className="font-semibold">Type:</span> {tx.type.toUpperCase()}</p>
                <p><span className="font-semibold">Amount:</span> ₦{tx.amount.toLocaleString()}</p>
                {tx.to && <p><span className="font-semibold">To:</span> {tx.to}</p>}
                {tx.from && <p><span className="font-semibold">From:</span> {tx.from}</p>}
                <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(tx.date).toLocaleString("en-NG")}
                </p>

                <Link href={`/receipt/${tx._id}`}>
                    <button className="mt-3 text-green-500 hover:text-green-400 transition-colors font-medium">
                    View Receipt →
                    </button>
                </Link>
                </div>
            ))}
            </ul>
        )}
        </div>
    )
}