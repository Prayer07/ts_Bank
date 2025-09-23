// app/api/verify/route.ts
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { connectDB } from "../../../../lib/db"
import Users from "../../../../models/Users"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!

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

    // ✅ Auth
    const auth = req.headers.get("authorization")
    const token = auth?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    interface DecodedToken {
      _id: string
      fullname: string
      email: string
      exp: number
    }
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken

    // ✅ Amount check
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // ✅ DB
    await connectDB()
    const user = await Users.findById(decoded._id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    user.balance += amt
    user.transactions.push({
      email: user.email,
      type: "add",
      amount: amt,
      reference: ref, // 🔑 keep track of Paystack reference
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
    console.error("❌ Verification error:", err)
    return NextResponse.json(
      { error: "Server error during verification" },
      { status: 500 }
    )
  }
}



// // app/api/verify/route.ts
// //paystack api
// import { NextRequest, NextResponse } from 'next/server'
// import axios from 'axios'
// import { connectDB } from '../../../../lib/db'
// import Users from '../../../../models/Users'
// import jwt from "jsonwebtoken"


// const JWT_SECRET = process.env.JWT_SECRET!
// console.log("add-money/verify" + JWT_SECRET )


// interface PaystackVerificationResponse {
//   status: boolean
//   message: string
//   data: {
//     status: string
//     reference: string
//     amount: number
//     currency: string
//     customer: {
//       email: string
//     }
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json() as { ref: string; userId: string; amount: string }

//     const { ref, userId, amount } = body

//     if (!ref || !userId || !amount) {
//       return NextResponse.json({ error: 'Missing reference, userId or amount' }, { status: 400 })
//     }

//     // 🔐 Verify with Paystack
//     const response = await axios.get<PaystackVerificationResponse>(
//       `https://api.paystack.co/transaction/verify/${ref}`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     )

//     const verification = response.data

//     if (!verification.status || verification.data.status !== 'success') {
//       return NextResponse.json({ error: 'Transaction not successful' }, { status: 400 })
//     }

//     // ✅ Update DB
//     await connectDB()
    
//     interface DecodedToken {
//       _id: string
//       fullname: string
//       email: string
//       exp: number
//     }
    
//     const auth = req.headers.get('authorization')
//     const token = auth?.split(' ')[1]
    
//     if(!token) {
//       return NextResponse.json({error: "Unauthorized"}, {status: 401})
//     }

//     const decoded = jwt.verify(token, JWT_SECRET ) as DecodedToken
//     const {amtt} = await req.json()
    
//     const amt = parseFloat(amtt)
//       if(isNaN(amt) || amt <= 0){
//         return NextResponse.json({error: "invalid amount"}, {status: 400})
//       }

//       const user = await Users.findById(decoded._id)
//         if(!user){
//           return NextResponse.json({error: "User not found"}, {status: 404})
//         }
    
//       user.balance += amt
    
//       user.transactions.push({
//         email: user.email,
//         type: 'add',
//         amount: amt,
//       })
    
//       await user.save()
    
//       return NextResponse.json({
//         success: true,
//         message: "Money added",
//         balance: user.balance,
//         receiptId: user.transactions[user.transactions.length - 1]._id.toString(), // ✅ use the last pushed
//       })

//   } catch (err) {
//     console.error('❌ Verification error:', err)
//     return NextResponse.json({ error: 'Server error during verification' }, { status: 500 })
//   }
// }