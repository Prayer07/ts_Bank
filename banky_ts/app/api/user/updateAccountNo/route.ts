import { connectDB } from "../../../../lib/db";
import Users from "../../../../models/Users";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!
console.log("AccNo "+ JWT_SECRET)

export async function POST(req: Request) {
    try {
        await connectDB()
        const { email, } = await req.json()

        if(!email){
            return NextResponse.json({error: "Missing email"}, {status: 400})
        }

        const user = await Users.findOne({ email })
        if(!user) {
            return NextResponse.json({error: "Email not found"}, {status: 404})
        }

        const accountNo = Math.floor(1000000000 + Math.random() * 9000000000);
        if(!accountNo) {
            return NextResponse.json({error: "Already owned"}, {status:401})
        }

        return NextResponse.json({
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            balance: user.balance,
            accountNo: user.accountNo,
        }}, {status: 200})

    } catch (err) {
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}