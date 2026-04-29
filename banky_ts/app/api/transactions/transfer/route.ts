import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { adminDb } from "../../../../services/firebaseAdmin"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET!
const COOKIE_NAME = "token"

export async function POST(req: NextRequest) {
  try {
    const { accountNo, amount } = await req.json()

    if (!accountNo || !amount) {
      return NextResponse.json(
        { error: "Missing details" },
        { status: 400 }
      )
    }

    // -------------------------------------
    // 🔐 Get user token from cookies
    // -------------------------------------
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string }
    const senderUid = decoded.uid

    // -------------------------------------
    // 🧑‍💼 Fetch Sender
    // -------------------------------------
    const senderRef = adminDb.collection("users").doc(senderUid)
    const senderSnap = await senderRef.get()

    if (!senderSnap.exists) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 })
    }

    const sender = senderSnap.data()!

    // -------------------------------------
    // 🧑‍💼 Fetch Receiver
    // -------------------------------------
    const receiverSnap = await adminDb
      .collection("users")
      .where("accountNo", "==", accountNo)
      .limit(1)
      .get()

    if (receiverSnap.empty) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const receiverDoc = receiverSnap.docs[0]
    const receiverUid = receiverDoc.id
    const receiver = receiverDoc.data()

    // -------------------------------------
    // ❌ No self transfer
    // -------------------------------------
    if (sender.accountNo === accountNo) {
      return NextResponse.json(
        { error: "You cannot transfer to yourself" },
        { status: 400 }
      )
    }

    // -------------------------------------
    // 💵 Validate amount
    // -------------------------------------
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (sender.balance < amt) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // -------------------------------------
    // 🔥 Update balances
    // -------------------------------------
    await senderRef.update({
      balance: sender.balance - amt,
    })

    await adminDb.collection("users").doc(receiverUid).update({
      balance: (receiver.balance || 0) + amt,
    })

    // -------------------------------------
    // 📝 Save Transactions
    // -------------------------------------

    // Sender's transaction
    const senderTxRef = await senderRef.collection("transactions").add({
      type: "transfer",
      amount: amt,
      to: receiver.fullname,
      from: sender.fullname,
      date: new Date(),
    })

    // Receiver’s transaction
    await adminDb
      .collection("users")
      .doc(receiverUid)
      .collection("transactions")
      .add({
        type: "receive",
        amount: amt,
        from: sender.fullname,
        date: new Date(),
      })

    return NextResponse.json({
      success: true,
      receiptId: senderTxRef.id,
    })
  } catch (err) {
    console.error("TRANSFER ERROR:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}