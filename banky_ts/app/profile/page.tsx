"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { DecodedToken } from "../../components/NormalUsers";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { UserData } from "../../components/NormalUsers";
import AnimatedCounter from "../../components/AnimatedCounter";
import Link from "next/link";


export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  // Fetch user data on page load
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
            const res = await fetch(`/api/user?email=${decoded.email}`)
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
    }, [router])


  // Generate account number handler
  const handleGenerateAccount = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/user/updateAccountNo", { email: user.email });
      setUser(res.data.user);
    } catch (err) {
      console.error("Error generating account number", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-white">
        <>
          <h2>{user?.fullname || "ass"}</h2>
          <AnimatedCounter bal={user? user.balance : 0}/>
          <p>
            {user?.accountNo ? (<span>{user?.accountNo}</span>) : (<Link href={'/createAccNo'}>Create Account Number</Link>)}
          </p>
        </>
    </div>
  );
}