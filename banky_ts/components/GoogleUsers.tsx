'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import { signOut, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export interface UserData {
    fullname: string
    email: string
    balance: number
}

const actions = [
    { title: 'Add Money', href: '/add-money' },
    { title: 'Transfer', href: '/transfer' },
]

function GoogleUsers() {
    const router = useRouter()
    const [user, setUser] = useState<UserData | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { data: session } = useSession()

    useEffect(() => {
        try {
        if (session) {
            fetch(`/api/user?email=${session.user?.email}`)
            .then(res => res.json())
            .then(data => setUser(data.user))
            .catch(console.error)
        } else {
            router.push('/login')
        }
        } catch (err) {
            if (err instanceof Error) {
                toast.error(err.message)
            }else {
                throw new Error('An unexpected error occurred')
            }
        }
    }, [session])

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push('/login')
        toast.success('Logged out successfully')
    }

    if (!session)
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

    return (
        <div className="relative min-h-screen bg-background text-foreground p-4 overflow-x-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <motion.h2
            className="text-2xl font-bold"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            >
            Hello, {session.user?.name} 👋
            </motion.h2>
            <motion.button
            className="text-3xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            whileTap={{ scale: 0.9 }}
            >
            ☰
            </motion.button>
        </div>

        {/* Balance Card */}
        <motion.div
            className="bg-card rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-start border border-gray-800"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div>
            <p className="text-sm text-muted-foreground">Balance</p>
            <div className="text-3xl font-bold text-green-500">
                {user ? (
                <AnimatedCounter key={user.balance} bal={user.balance} />
                ) : (
                <p>₦-</p>
                )}
            </div>
            </div>
            <Link
            href="/transactions"
            className="text-sm text-yellow-400 hover:underline mt-2"
            >
            View History →
            </Link>
        </motion.div>

        {/* Actions */}
        <motion.div
            className="grid grid-cols-2 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
            hidden: {},
            visible: {
                transition: {
                staggerChildren: 0.15,
                },
            },
            }}
        >
            {actions.map(({ title, href }, i) => (
            <Link href={href} key={i} className="block w-full h-full">
                <ActionBox title={title} />
            </Link>
            ))}
        </motion.div>

        {/* Sidebar */}
        <AnimatePresence>
            {sidebarOpen && (
            <motion.div
                className="fixed top-0 right-0 h-full w-64 bg-card border-l border-gray-800 shadow-xl z-50 p-6"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ type: 'tween', duration: 0.3 }}
            >
                <button
                className="mb-6 text-lg font-semibold"
                onClick={() => setSidebarOpen(false)}
                >
                ✕ Close
                </button>
                <div className="space-y-4">
                <Link href="/buy-airtime" className="block hover:underline">
                    📱 Buy Airtime
                </Link>
                <Link href="/buy-data" className="block hover:underline">
                    🌐 Buy Data
                </Link>
                <Link href="/pay-bills" className="block hover:underline">
                    💡 Pay Bills
                </Link>
                <button onClick={handleSignOut}>🚪 Logout</button>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    )
}

function ActionBox({ title }: { title: string }) {
    return (
        <motion.div
        className="w-full h-24 bg-card rounded-xl shadow flex items-center justify-center text-center font-semibold hover:bg-gray-800 transition border border-gray-700 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        >
        {title}
        </motion.div>
    )
}

    export default GoogleUsers