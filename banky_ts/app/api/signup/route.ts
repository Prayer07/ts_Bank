import { connectDB } from "../../../lib/db";
import Users from "../../../models/Users";
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try {
        await connectDB()
        const{fname, lname, phone, password} = await req.json()

        //Validation
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(phone)){
            return NextResponse.json({error: "Phone number must be 10 digits"}, {status: 400})
        }

        const existingUser = await Users.findOne({phone})
        if(existingUser){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new Users({
            fname,
            lname,
            phone,
            password: hashedPassword,
        })

        await newUser.save()

        return NextResponse.json({message: "User created successfully"}, {status: 201})

    }catch (err){
        console.error(err)
        return NextResponse.json({error: "Server error"}, {status: 500})
    }
}