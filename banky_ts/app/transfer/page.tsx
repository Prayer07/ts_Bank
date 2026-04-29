"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"

export default function TransferPage() {
  const [accountNo, setAccountNo] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMoney = async () => {
    if (!accountNo || !amount) {
      toast.error("All fields are required")
      return
    }

    setLoading(true)

    try {
      const res = await axios.post("/api/transactions/transfer", {
        accountNo,
        amount,
      })

      toast.success("Transfer successful!")
      window.location.href = `/receipt/${res.data.receiptId}`

    } catch (err) {
        let message = "Transfer failed";
        
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }

        toast.error(message);
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-xl border border-gray-800">
        <h1 className="text-2xl font-bold text-center mb-4">
          Transfer Money
        </h1>

        <Input
          placeholder="Receiver Account Number"
          value={accountNo}
          onChange={(e) => setAccountNo(e.target.value)}
          className="mb-4 rounded-xl bg-background border-gray-700"
        />

        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 rounded-xl bg-background border-gray-700"
        />

        <Button
          onClick={sendMoney}
          disabled={loading}
          className="w-full rounded-xl"
        >
          {loading ? "Processing..." : "Send Money"}
        </Button>
      </div>
    </div>
  )
}