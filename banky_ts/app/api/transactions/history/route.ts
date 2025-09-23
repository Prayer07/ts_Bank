import { NextResponse, NextRequest } from "next/server";
import jwt from 'jsonwebtoken'
import { connectDB } from "../../../../lib/db";
import Users from "../../../../models/Users";

const JWT_SECRET = process.env.JWT_SECRET!
console.log("Transactions " + JWT_SECRET )


export async function GET(req: NextRequest){
    await connectDB()

    const auth = req.headers.get('authorization')
    const token = auth?.split(' ')[1]

    interface DecodedToken {
        _id: string
        fullname: string
        email: string
        exp: number
    }

    if (!token){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET ) as DecodedToken

        const user = await Users.findById(decoded._id)
        if(!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json({transactions: user.transactions.reverse()})

    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 })
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}