import { connectDB } from "../../../lib/db";
import Users from "../../../models/Users";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectDB()

        const url = new URL(req.url)
        const phone = url.searchParams.get('phone')

        if(!phone){
            return NextResponse.json({error: "Phone is required"}, {status: 400})
        }

        const user = await Users.findOne({phone}).select('fname phone balance')
        if (!user){
            return NextResponse.json({error: "User not found"}, {status: 404})
        }

        return NextResponse.json({user}, {status: 200})
    }catch(err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}