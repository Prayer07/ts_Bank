// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; //important for the updated version/code
import jwt from "jsonwebtoken";
import { adminDb } from "../../../../services/firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "token";

// Define the JWT payload structure
interface JwtPayload {
  uid: string;
  // Add other JWT payload fields if needed
}

// Define the user data structure from Firestore
interface UserData {
  password?: string;
  phone?: string;
  fullname?: string;
  // Add other user fields as needed
}

export async function GET() {
    // outdated code or version
//   const token = req.cookies.get(COOKIE_NAME)?.value;
//   if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// updated code or version
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Type-safe JWT verification
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const uid = payload.uid;
    
    // Fetch user from Firestore
    const doc = await adminDb.collection("users").doc(uid).get();
    
    if (!doc.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    // Get user data with proper typing
    const user = doc.data() as UserData;
    
    // Remove sensitive password field before returning
    delete user.password;
    
    return NextResponse.json({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return NextResponse.json({ err: message }, { status: 401 });
  }
}