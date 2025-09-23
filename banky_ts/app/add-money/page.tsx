"use client"

import { useState, useEffect } from "react"
import NormalUserAddMoney from "../../components/NormalUserAddMoney"
import GoogleAddMoney from "../../components/GoogleAddMoney"

export default function AddMoneyPage() {
  const [userId, setUserId] = useState("")

  // 🔐 Get user info from sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}")
    if (user?._id) {
      setUserId(user._id)
    }
  }, [])

  return (
    <>
    {userId? (
      <NormalUserAddMoney/>
    ):
    (
      <GoogleAddMoney/>
    )
    }
    </>
  )
}