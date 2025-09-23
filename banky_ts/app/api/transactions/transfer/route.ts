import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { connectDB } from "../../../../lib/db";
import Users from "../../../../models/Users";

const JWT_SECRET = process.env.JWT_SECRET!
console.log("Transfer " + JWT_SECRET )

export async function POST(req: NextRequest){
    await connectDB()

    const auth = req.headers.get('authorization')
    const token = auth?.split(' ')[1]

    interface DecodedToken {
        _id: string
        fname: string
        email: string
        exp: number
    }

    if (!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET ) as DecodedToken
        const {email, amount} = await req.json()

        const sender = await Users.findById(decoded._id)
        if(!sender) return NextResponse.json({error: "Sender not found"}, {status: 404})
        
        if (email === sender.email){
            return NextResponse.json({error:"Thef Cannot send to yourself"}, {status: 400})
        }

        const receiver = await Users.findOne({email})
        if(!receiver)
            return NextResponse.json({error: "User not found"}, {status: 404})

        const amt = parseFloat(amount)
        if (isNaN(amt) || amt <= 0){
            return NextResponse.json({error:" Invalid amount"}, {status: 400})
        }

        if (sender.balance < amt)
            return NextResponse.json({error: "Insufficient balance"}, {status: 400})

        sender.balance -= amt
        receiver.balance += amt

        const newTx = {
        type: 'transfer',
        amount: amt,
        to: email,
        }

        sender.transactions.push(newTx)

        sender.transactions.push({
        type: 'transfer',
        amount: amt,
        to: email,
        from: sender.email,
        })

        receiver.transactions.push({
        type: 'receive',
        amount: amt,
        from: sender.email,
        })

        await sender.save()
        await receiver.save()


        return NextResponse.json({
        success: true,
        receiptId: sender.transactions[sender.transactions.length - 1]._id.toString(), // ✅ use the last pushed
        })
    } catch (err) {
        console.error(err)
        return NextResponse.json({error: "Invalid token or server error"}, {status: 500})
    }
}