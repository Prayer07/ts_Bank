import { connectDB } from "../../../lib/db";
import Users from "../../../models/Users";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        await connectDB()
        const{fullname, email, password } = await req.json()

        //Validation
        const existingUser = await Users.findOne({email})
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const accountNo = Math.floor(1000000000 + Math.random() * 9000000000);

        const newUser = new Users({
            fullname,
            email,
            password: hashedPassword,
            accountNo,
        })

        await newUser.save()

        return NextResponse.json({message: "User created successfully"}, {status: 201})

    }catch (err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}