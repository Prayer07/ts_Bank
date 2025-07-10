import { NextResponse } from "next/server"
import { connectDB } from "../../../lib/db"
import User from "../../../models/Users"

export async function GET(req: Request){
    const {searchParams} = new URL(req.url)
    const id = searchParams.get('id')

    if (!id){
        return NextResponse.json({error: "Missing Id "}, {status: 400})
    }

    try {
        await connectDB()

        const user = await User.findOne({'transactions._id': id})

        if (!user){
            return NextResponse.json({error: "Transaction not found"}, {status: 404})
        }

        const transaction = user.transactions.id(id)

        if (!transaction) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
        }

        return NextResponse.json({ transaction: transaction.toObject() }, { status: 200 })

    } catch (err: unknown) {
        if(err instanceof Error){
            return NextResponse.json({error: "Unknown error "}, {status: 500})
        }
        return NextResponse.json({error: "Unknown error"}, {status: 500})
    }
}