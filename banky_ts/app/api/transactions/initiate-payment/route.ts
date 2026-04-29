import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "token";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    // Get user token
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { uid: string };

    // Initialize paystack
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount: Number(amount) * 100,
        email: `${decoded.uid}@bankapp.com`,
        callback_url: `${process.env.NEXTAUTH_URL}/dashboard`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return NextResponse.json({
      paymentUrl: paystackRes.data.data.authorization_url,
      reference: paystackRes.data.data.reference,
    });
  } catch (error) {
    console.error("INIT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}