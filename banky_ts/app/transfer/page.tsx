'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TransferPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = sessionStorage.getItem('token')
    if (!token) return router.push('/login')

    const res = await fetch('/api/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phone, amount }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setMessage(data.error || 'Transfer failed')
    } else {
      setMessage('✅ Transfer successful!')
      setTimeout(() => router.push('/dashboard'), 1500)
    }
  }

  return (
    <div className="min-h-screen p-4 flex flex-col justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Transfer Money</h2>
        <input
          type="tel"
          placeholder="Recipient Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          maxLength={11}
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-3 border rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Money'}
        </button>
        {message && <p className="text-center mt-4 text-sm">{message}</p>}
      </form>
    </div>
  )
}
