"use client"

import { signIn } from "next-auth/react"

export default function GoogleSignIn() {
    return <button onClick={() => signIn("google")}></button>
}