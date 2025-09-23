import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export default function Logout() {

    const router = useRouter()

    const handleLogout = () =>{
        sessionStorage.clear()
        router.push("/login")
        toast.success("Logged out successfully")
    }

  return (
    <>
    <button className=" text-white-500" onClick={handleLogout}>Logout</button>
    </>
  )
}
