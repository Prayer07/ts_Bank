import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import Users from "../../../models/Users";
import { connectDB } from "../../../lib/db";

const JWT_SECRET = process.env.JWT_SECRET!
console.log("add-money" + JWT_SECRET )

export async function POST(req: NextRequest){
    await connectDB()

    interface DecodedToken {
        _id: string
        fname: string
        phone: string
        exp: number
    }

    const auth = req.headers.get('authorization')
    const token = auth?.split(' ')[1]

    if(!token) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET ) as DecodedToken
        const {amount} = await req.json()

        const amt = parseFloat(amount)
        if(isNaN(amt) || amt <= 0){
            return NextResponse.json({error: "invalid amount"}, {status: 400})
        }
        
        const user = await Users.findById(decoded._id)
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        user.balance += amt

        // if (!user.transactions) {
        // user.transactions = []
        // }

        user.transactions.push({
        type: 'add',
        amount: amt,
        })

        await user.save()

        return NextResponse.json({message: "Money added", balance: user.balance})

    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 })
        }

        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
    }

}