// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminDb } from "../../../../services/firebaseAdmin";
import { User } from "../../../../types/UserData";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "token";

export async function POST(req: Request) {
  const body = await req.json();
  const { uid, fullname, phone, password } = body;

  if (!uid || !phone || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  // check if phone exists
  const q = await adminDb.collection("users").where("phone", "==", phone).limit(1).get();
  if (!q.empty) {
    return NextResponse.json({ message: "Phone already registered" }, { status: 409 });
  }

  const accountNo = Math.floor(1000000000 + Math.random() * 9000000000);

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt);

  const userDoc: User = {
    uid,
    fullname,
    phone,
    balance: 0,
    accountNo,
    password: hashed,
    createdAt: Date.now(),
  };

  await adminDb.collection("users").doc(uid).set(userDoc);

  // create JWT
  const token = jwt.sign({ uid, phone }, JWT_SECRET, { expiresIn: "7d" });

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