'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type AddMoneyButtonProps = {
  userId: string
  amount: string
}

export default function AddMoneyButton({ userId, amount }: AddMoneyButtonProps) {
  const [paystackReady, setPaystackReady] = useState(false)
  const router = useRouter()
  const ref = Math.floor(Math.random() * 1000000000).toString()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    script.onload = () => setPaystackReady(true)
    document.body.appendChild(script)
  }, [])

  const handlePayment = () => {
    if (!userId || !amount) {
      alert('Missing user ID or amount')
      return
    }

    if (!paystackReady || !window.PaystackPop) {
      alert('Paystack is not ready yet. Please try again shortly.')
      return
    }

    const paystack = window.PaystackPop.setup({
      key: 'pk_test_03924c92898057e131556cf7d8c1a47c11a68395', // 🔑 Replace with your real Paystack Public Key
      amount: parseInt(amount) * 100,
      email: 'test@example.com', // Still required by Paystack, even if dummy
      ref,
      callback: function (response) {
        fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ref: response.reference,
            userId,
            amount,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              alert('Wallet funded successfully!')
              setTimeout(() =>{
                router.push("dashboard")
              }, 1500)
            } else {
              alert(data.error || 'Verification failed')
            }
          })
          .catch(() => alert('Error verifying payment'))
      },
      onClose: () => {
        alert('Payment window closed.')
      },
    })

    paystack.openIframe()
  }

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      disabled={!paystackReady}
    >
      {paystackReady ? 'Add Money' : 'Loading...'}
    </button>
  )
}
