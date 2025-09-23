import { NextResponse, NextRequest } from "next/server"
import { connectDB } from "../../../../../lib/db"
import Users from "../../../../../models/Users"

    export async function GET(req: NextRequest) {
    await connectDB()

    try {
        // get email from query string
        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email")

        if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await Users.findOne({ email })
        if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
        transactions: user.transactions.reverse(),
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
        return NextResponse.json({ error: err.message }, { status: 500 })
        }
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}