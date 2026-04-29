import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import jwt from "jsonwebtoken"
import { adminDb } from "../../../../services/firebaseAdmin"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = "token";

interface PaystackVerificationResponse {
  status: boolean
  message: string
  data: {
    status: string
    reference: string
    amount: number
    currency: string
    customer: { phone: string }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { ref: string; amount: string }
    const { ref, amount } = body

    if (!ref || !amount) {
      return NextResponse.json(
        { error: "Missing reference or amount" },
        { status: 400 }
      )
    }

    // -------------------------------------
    // 🔐 Verify via Paystack API
    // -------------------------------------
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

    // -------------------------------------
    // 🔐 Verify JWT + Get User UID
    // -------------------------------------
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      uid: string
    }

    const uid = decoded.uid

    // -------------------------------------
    // 💰 Validate Amount
    // -------------------------------------
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    // -------------------------------------
    // 🔥 Firestore DB Operations
    // -------------------------------------
    const userRef = adminDb.collection("users").doc(uid)
    const userSnap = await userRef.get()

    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userSnap.data()!
    const newBalance = (userData.balance || 0) + amt

    // Update balance
    await userRef.update({ balance: newBalance })

    // Save transaction
    const txRef = await userRef.collection("transactions").add({
      type: "add",
      amount: amt,
      reference: ref,
      date: new Date(),
      phone: userData.phone || null,
    })

    return NextResponse.json({
      success: true,
      message: "Money added successfully",
      balance: newBalance,
      receiptId: txRef.id,
    })
  } catch (err) {
    console.error("❌ Verification error:", err)
    return NextResponse.json(
      { error: "Server error during verification" },
      { status: 500 }
    )
  }
}