"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NormalUserTransfer() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = sessionStorage.getItem("token");
        if (!token) {
        router.push("/login");
        }

        const res = await fetch("/api/user/updateAccountNo", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setLoading(false);

        if (!res.ok) {
        setMessage(data.error || "Failed");
        } else {
        toast.success("Account number created");
        setTimeout(() => router.push(`/profile`), 1500);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-4">
        <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 shadow-lg rounded-2xl p-6 w-full max-w-md border border-neutral-800"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center">
            Generate AccountNo
            </h2>

            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            />

            <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-3 rounded-xl w-full disabled:opacity-50"
            disabled={loading}
            >
            {loading ? "Generating AccountNo..." : "Generate AccountNo"}
            </button>

            {message && (
            <p className="text-center mt-4 text-sm text-red-400">{message}</p>
            )}
        </form>
        </div>
    );
}