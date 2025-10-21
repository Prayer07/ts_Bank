import { connectDB } from "../../../lib/db";
import Users from "../../../models/Users";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectDB()

        const url = new URL(req.url)
        const email = url.searchParams.get('email')

        if(!email){
            return NextResponse.json({error: "Email is required"}, {status: 400})
        }

        const user = await Users.findOne({ email }).select('fullname email balance accountNo')
        if (!user){
            return NextResponse.json({error: "Email not found"}, {status: 404})
        }

        return NextResponse.json({user}, {status: 200})
    }catch(err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}