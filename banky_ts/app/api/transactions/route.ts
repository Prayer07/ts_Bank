import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { connectDB } from "../../../lib/db";
import User from "../../../models/Users";

const JWT_SECRET = process.env.JWT_SECRET!
console.log("Transactions " + JWT_SECRET )


export async function GET(req: NextRequest){
    await connectDB()

    const auth = req.headers.get('authorization')
    const token = auth?.split(' ')[1]

    if (!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        
        const decoded: any = jwt.verify(token, JWT_SECRET )

        const user = await User.findById(decoded._id)
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json({transactions: user.transactions.reverse()})

    } catch (err) {
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}