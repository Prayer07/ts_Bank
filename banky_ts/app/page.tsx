"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] text-transparent bg-clip-text">
            Banky
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto">
          Secure banking made simple — send money, chat, manage your wallet.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            onClick={() => router.push("/signup")}
            className="px-8 py-3 text-lg font-semibold rounded-xl shadow-lg 
                      bg-gradient-to-r from-[#0052FF] to-[#7B2FF7]
                      hover:opacity-90 transition-all duration-200"
          >
            Create Account
          </Button>

          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="px-8 py-3 text-lg rounded-xl border border-gray-600
                      hover:bg-[#1A1F2C] transition-all duration-200"
          >
            Login
          </Button>
        </div>
      </motion.div>
    </div>
  );
}