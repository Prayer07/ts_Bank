'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import "./globals.css";

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
          Welcome to{" "}
          <span className="text-yellow-400 drop-shadow-lg">Banky</span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto">
          Send money, chat, and connect — all in one secure and fast app.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            onClick={() => router.push("/signup")}
            className="px-8 py-3 text-lg font-semibold rounded-2xl 
                      bg-yellow-400 hover:bg-yellow-300 text-black 
                      shadow-lg transition-transform hover:scale-105"
          >
            Signup
          </Button>

          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="px-8 py-3 text-lg font-semibold rounded-2xl 
                      border border-gray-700 bg-zinc-900 text-gray-200 
                      hover:bg-zinc-800 hover:text-white transition"
          >
            Login
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
