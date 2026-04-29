// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminDb } from "../../../../services/firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "token";

export async function POST(req: Request) {
  const { phone, password } = await req.json();

  if (!phone || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const q = await adminDb.collection("users").where("phone", "==", phone).limit(1).get();
  if (q.empty) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const doc = q.docs[0];
  const user = doc.data();

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign({ uid: user.uid, phone: user.phone }, JWT_SECRET, { expiresIn: "7d" });

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}