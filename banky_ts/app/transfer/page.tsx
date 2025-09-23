'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { jwtDecode } from 'jwt-decode'
import NormalUserTransfer from '../../components/NormalUserTransfer'
import GoogleTransfer from '../../components/GoogleTransfer'

interface DecodedToken {
    _id: string
    fullname: string
    email: string
    exp: number
}


function page() {
    const {data: session, status} = useSession()
    const [isNormalUser, setIsNormalUser] = useState(false)

    useEffect(() => {
        const token = sessionStorage.getItem("token")
        if (token){
            try {
                const decoded: DecodedToken = jwtDecode(token)
                if (decoded.exp * 1000 > Date.now()){
                    setIsNormalUser(true)
                }else{
                    sessionStorage.removeItem("token")
                    setIsNormalUser(false)
                }
            }catch (err: unknown) {
                if(err instanceof Error){
                    console.error("Invalid token", err)
                    setIsNormalUser(false)
                }else{
                    console.error("Something went wrong")
                }
            }
        }
    })

    if (isNormalUser) {
        return <NormalUserTransfer/>
    }

    if (status === "loading") return
            <div className="flex items-center justify-center min-h-screen text-gray-600">
                Loading...
            </div>

    if (session) {
        return <GoogleTransfer/>
    }
}

export default page