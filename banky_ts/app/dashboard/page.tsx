// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../../types/UserData";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setUser(data.user);
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const logout = async () =>{
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0F0F14] text-white p-6">
      <h1 className="text-3xl font-bold">
        Hi, <span className="text-[#7B2FF7]">{user?.fullname}</span>
      </h1>
      <p className="text-gray-400 mt-2">UID: {user?.uid}</p>
      <p className="text-gray-400 mt-2">Balance: {user?.balance}</p>
      <p className="text-gray-400 mt-2">AccountNo: {user?.accountNo}</p>

      <a href="/add-money">Add money {"  "}</a>
      <a href="/transfer">Transfer money</a>

      <Button
        onClick={logout}
        className="mt-6 bg-gradient-to-r from-[#0052FF] to-[#7B2FF7] py-3 px-4 rounded-xl pointer"
      >
        Logout
      </Button>
    </div>
  );
} 