"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {jwtDecode} from 'jwt-decode'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedCounter from '../../components/AnimatedCounter'
import Logout from '../../components/Logout'

interface DecodedToken {
  _id: string
  fname: string
  phone: string
  exp: number
}

interface UserData {
  fname: string
  phone: string
  balance: number
}

const actions = [
  { title: 'Add Money', href: '/add-money' },
  { title: 'Transfer', href: '/transfer' },
  // { title: 'Withdraw', href: '/withdraw' },
  // { title: 'Deposit', href: '/deposit' },
]


export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (!token) return router.push('/login')

    try {
      const decoded: DecodedToken = jwtDecode(token)

      if (decoded.exp * 1000 < Date.now()) {
        sessionStorage.removeItem('token')
        return router.push('/login')
      }

      const fetchUser = async () => {
        const res = await fetch(`/api/user?phone=${decoded.phone}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.error)
        setUser(data.user)
      }

      fetchUser()
    } catch (err) {
      console.error(err)
      sessionStorage.removeItem('token')
      router.push('/login')
    }
  })

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading...
      </div>
    )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 p-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-2xl font-bold"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Hello, {user.fname} 👋
        </motion.h2>
        <motion.button
          className="text-3xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          whileTap={{ scale: 0.9 }}
        >
          ☰
        </motion.button>
      </div>

      {/* Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-start"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-3xl font-bold text-green-600">
          </p>
          <div className="text-3xl font-bold text-green-600">
              <AnimatedCounter key={user.balance} bal={user.balance} />
            </div>
        </div>
        <Link
          href="/transactions"
          className="text-sm text-blue-600 hover:underline mt-2"
        >
          View History →
        </Link>
      </motion.div>

      {/* Action Buttons */}
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
        href ? (
          <Link
            href={href}
            key={i}
            className="block w-full h-full"
          >
            <ActionBox title={title} />
          </Link>
        ) : (
          <ActionBox key={i} title={title} />
        )
      ))}
    </motion.div>


      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 p-6"
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
            <div className="space-y-4 text-gray-700">
              <Link href="/buy-airtime" className="block hover:underline">
                📱 Buy Airtime
              </Link>
              <Link href="/buy-data" className="block hover:underline">
                🌐 Buy Data
              </Link>
              <Link href="/pay-bills" className="block hover:underline">
                💡 Pay Bills
              </Link>
                🚪 <Logout/>
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
      className="w-full h-24 bg-white rounded-xl shadow flex items-center justify-center text-center font-semibold hover:bg-gray-50 transition border cursor-pointer"
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