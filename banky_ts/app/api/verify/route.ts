// app/api/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { connectDB } from '../../../lib/db'
import User from '../../../models/Users'

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
    const body = await req.json() as { ref: string; userId: string; amount: string }

    const { ref, userId, amount } = body

    if (!ref || !userId || !amount) {
      return NextResponse.json({ error: 'Missing reference, userId or amount' }, { status: 400 })
    }

    // 🔐 Verify with Paystack
    const response = await axios.get<PaystackVerificationResponse>(
      `https://api.paystack.co/transaction/verify/${ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const verification = response.data

    if (!verification.status || verification.data.status !== 'success') {
      return NextResponse.json({ error: 'Transaction not successful' }, { status: 400 })
    }

    // ✅ Update DB
    await connectDB()
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    user.balance += parseInt(amount)
    await user.save()

    return NextResponse.json({
      success: true,
      newBalance: user.balance,
      reference: verification.data.reference,
    })
  } catch (err) {
    console.error('❌ Verification error:', err)
    return NextResponse.json({ error: 'Server error during verification' }, { status: 500 })
  }
}
