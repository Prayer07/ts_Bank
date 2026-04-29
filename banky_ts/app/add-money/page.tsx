"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"

export default function AddMoneyPage() {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const startPayment = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount")
      return
    }

    setLoading(true)

    try {
      // Call your backend to generate Paystack transaction
      const res = await axios.post("/api/transactions/initiate-payment", {
        amount: Number(amount),
      })

      const { paymentUrl } = res.data

      // Redirect user to Paystack payment page
      window.location.href = paymentUrl
    } catch (err) {
      console.error(err)
      toast.error("Payment initialization failed")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-xl border border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-4">
          Add Money
        </h1>

        <Input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 rounded-xl bg-background border-gray-700"
        />

        <Button
          onClick={startPayment}
          disabled={loading}
          className="w-full rounded-xl"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </div>
    </div>
  )
}