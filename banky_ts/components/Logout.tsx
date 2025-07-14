import { useRouter } from 'next/navigation'
import React from 'react'

export default function Logout() {

    const router = useRouter()

    const handleLogout = () =>{
        sessionStorage.clear()
        router.push("/login")
    }

  return (
    <>
    <button className=" text-red-500" onClick={handleLogout}>Logout</button>
    </>
  )
}
