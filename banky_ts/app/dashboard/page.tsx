'use client'

import React, { useEffect, useState } from 'react'
import GoogleUsers from '../../components/GoogleUsers'
import { useSession } from 'next-auth/react'
import NormalUsers from '../../components/NormalUsers'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface DecodedToken {
    _id: string
    fullname: string
    email: string
    exp: number
}

function Page() {
    const { data: session, status } = useSession()
    const [isNormalUser, setIsNormalUser] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = sessionStorage.getItem('token')

        if (token) {
        try {
            const decoded: DecodedToken = jwtDecode(token)
            if (decoded.exp * 1000 > Date.now()) {
            setIsNormalUser(true)
            return
            } else {
            sessionStorage.removeItem('token')
            }
        } catch (err) {
            console.error('Invalid token', err)
        }
        }

        // 🔹 Only check Google session if no valid normal-user token
        if (status === 'unauthenticated') {
        router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
            </motion.div>
        </div>
        )
    }

    if (isNormalUser) {
        return <NormalUsers />
    }

    if (session) {
        return <GoogleUsers />
    }

    return null
}

export default Page