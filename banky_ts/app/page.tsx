'use client'
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-900 via-indigo-800 to-purple-900 text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
          Welcome to <span className="text-yellow-400">Banky</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 max-w-xl mx-auto">
          Send money, chat, and connect — all in one secure and fast app. 💸💬🚀
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-full shadow-xl"
          >
            Signup
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 border border-white text-white font-semibold rounded-full hover:bg-white hover:text-black transition"
          >
            Login
          </button>
        </div>

        {/* <div className="mt-12">
          <img
            src="/bank-illustration.svg"
            alt="Bank App Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div> */}
      </div>
    </div>
  );
}
