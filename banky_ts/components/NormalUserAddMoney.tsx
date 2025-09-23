"use client"

import { useState, useEffect } from "react"
import AddMoneyButton from "./AddMoneyButton"

export default function NormalUserAddMoney() {
    const [amount, setAmount] = useState("")
    const [userId, setUserId] = useState("")
    const [email, setEmail] = useState("")

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}")
        if (user?._id) {
        setUserId(user._id)
        setEmail(user.email || "")
        }
    }, [])

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

            <AddMoneyButton 
            userId={userId} 
            amount={parseInt(amount) || 0} 
            email={email} 
            />
        </div>
        </div>
    )
}