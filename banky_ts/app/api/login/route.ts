import { connectDB } from "../../../lib/db"
import Users from "../../../models/Users"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!
console.log("login "+ JWT_SECRET)

export async function POST(req: Request) {
    try {
        await connectDB()
        const { email, password} = await req.json()

        if(!email || !password){
            return NextResponse.json({error: "Missing email or password"}, {status: 400})
        }

        const user = await Users.findOne({ email })
        if(!user) {
            return NextResponse.json({error: "Email not found"}, {status: 404})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return NextResponse.json({error: "Invalid password"}, {status:401})
        }

        const token = jwt.sign(
            {
                _id: user._id,
                fullname: user.fullname,
                email : user.email,
            },
            JWT_SECRET,
            {expiresIn: '1d'}
        )

        return NextResponse.json({
        token,
        user: {
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            balance: user.balance,
        }}, {status: 200})

    } catch (err) {
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}