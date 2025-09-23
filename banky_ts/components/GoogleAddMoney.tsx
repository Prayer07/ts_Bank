"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import AddMoneyButtonGoogle from "./AddMoneyButtonGoogle"

export default function GoogleAddMoney() {
    const { data: session } = useSession()
    const [amount, setAmount] = useState("")

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-4">
        <div className="bg-neutral-900 shadow-lg rounded-2xl p-6 w-full max-w-md border border-neutral-800">
            <h2 className="text-2xl font-semibold mb-6 text-center">Add Money</h2>

            <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-6"
            />

            <AddMoneyButtonGoogle
            amount={parseInt(amount) || 0} 
            email={session?.user?.email || "test@gmail.com"} 
            />
        </div>
        </div>
    )
}