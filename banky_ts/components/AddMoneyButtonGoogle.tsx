"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type AddMoneyButtonProps = {
    amount: number
    email: string // Google email is required here
}

export default function AddMoneyButtonGoogle({ amount, email }: AddMoneyButtonProps) {
    const [paystackReady, setPaystackReady] = useState(false)
    const router = useRouter()
    const ref = Math.floor(Math.random() * 1000000000).toString()

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://js.paystack.co/v1/inline.js"
        script.async = true
        script.onload = () => setPaystackReady(true)
        document.body.appendChild(script)
    }, [])

    const handlePayment = () => {
        if (!email || !amount) {
        toast.error("Missing email or amount")
        return
        }

        if (!paystackReady || !window.PaystackPop) {
        toast.error("Paystack is not ready yet. Please try again shortly.")
        return
        }

        const paystack = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        amount: amount * 100, // Paystack uses kobo
        email, // ✅ Google user’s email goes straight to Paystack
        ref,
        callback: function (response) {
            fetch("/api/transactions/google/add-money", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ref: response.reference,
                amount,
            }),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                toast.success("Wallet funded successfully!")
                setTimeout(() => {
                    router.push(`/dashboard`)
                }, 1000)
                } else {
                toast.error(data.error || "Verification failed")
                }
            })
            .catch(() => toast.error("Error verifying payment"))
        },
        onClose: () => {
            toast.error("Payment window closed.")
        },
        })

        paystack.openIframe()
    }

    return (
        <button
        onClick={handlePayment}
        className="bg-black text-white py-2 rounded w-full"
        disabled={!paystackReady || amount <= 0}
        >
        {paystackReady ? "Add Money" : "Loading..."}
        </button>
    )
}