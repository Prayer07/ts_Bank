// app/api/transactions/verify/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { connectDB } from "../../../../../lib/db"
import Users from "../../../../../models/Users"

interface PaystackVerificationResponse {
    status: boolean
    message: string
    data: {
        status: string
        reference: string
        amount: number
        currency: string
        customer: {
        email: string
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as { ref: string; amount: string }
        const { ref, amount } = body

        if (!ref || !amount) {
        return NextResponse.json(
            { error: "Missing reference or amount" },
            { status: 400 }
        )
        }

        // 🔐 Verify with Paystack
        const response = await axios.get<PaystackVerificationResponse>(
        `https://api.paystack.co/transaction/verify/${ref}`,
        {
            headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
            },
        }
        )

        const verification = response.data
        if (!verification.status || verification.data.status !== "success") {
        return NextResponse.json(
            { error: "Transaction not successful" },
            { status: 400 }
        )
        }

        // ✅ Use Google email from Paystack
        const googleEmail = verification.data.customer.email
        if (!googleEmail) {
        return NextResponse.json({ error: "Email not found" }, { status: 400 })
        }

        const amt = parseFloat(amount)
        if (isNaN(amt) || amt <= 0) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        // ✅ DB
        await connectDB()
        const user = await Users.findOne({ email: googleEmail })
        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        user.balance += amt
        user.transactions.push({
        email: user.email,
        type: "add",
        amount: amt,
        reference: ref, // 🔑 Paystack reference
        date: new Date(),
        })

        await user.save()

        const newTransaction =
        user.transactions[user.transactions.length - 1]._id.toString()

        return NextResponse.json({
        success: true,
        message: "Money added",
        balance: user.balance,
        receiptId: newTransaction,
        })
    } catch (err) {
        console.error("❌ Verification error (Google users):", err)
        return NextResponse.json(
        { error: "Server error during verification" },
        { status: 500 }
        )
    }
}