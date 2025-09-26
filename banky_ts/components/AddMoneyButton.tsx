"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type AddMoneyButtonProps = {
  userId: string
  amount: number
  email?: string
}

export default function AddMoneyButton({ userId, amount, email }: AddMoneyButtonProps) {
  const [paystackReady, setPaystackReady] = useState(false)
  const router = useRouter()
  const ref = Math.floor(Math.random() * 1000000000).toString()

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.async = true
    script.onload = () => setPaystackReady(true)
    document.body.appendChild(script)
  }, [])

  const handlePayment = () => {
    if (!userId || !amount) {
      toast.error("Missing user ID or amount")
      return
    }

    if (!paystackReady || !window.PaystackPop) {
      toast.error("Paystack is not ready yet. Please try again shortly.")
      return
    }

    const paystack = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      amount: amount * 100, // Paystack uses kobo
      email: email || "test@gmail.com",
      ref,
      callback: function (response) {
        const token = sessionStorage.getItem("token")
        fetch("/api/transactions/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ref: response.reference,
            userId,
            amount,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success("Wallet funded successfully!")
              setTimeout(() => {
                router.push(`/dashboard`)
              }, 1000)
            } else {
              toast.error(data.error || "Verification failed")
            }
          })
          .catch(() => toast.error("Error verifying payment"))
      },
      onClose: () => {
        toast.error("Payment window closed.")
      },
    })

    paystack.openIframe()
  }

  return (
    <button
      onClick={handlePayment}
      className="bg-black text-white py-2 rounded w-full"
      disabled={!paystackReady || amount <= 0}
    >
      {paystackReady ? "Add Money" : "Loading..."}
    </button>
  )
}





// "use client"

// import { useRouter } from "next/navigation"
// import { useEffect, useState } from "react"
// import toast from "react-hot-toast"

// type AddMoneyButtonProps = {
//   userId: string
//   amount: number
//   email?: string // add email so Paystack can use it
// }

// export default function AddMoneyButton({ userId, amount, email }: AddMoneyButtonProps) {
//   const [paystackReady, setPaystackReady] = useState(false)
//   const router = useRouter()
//   const ref = Math.floor(Math.random() * 1000000000).toString()

//   useEffect(() => {
//     const script = document.createElement("script")
//     script.src = "https://js.paystack.co/v1/inline.js"
//     script.async = true
//     script.onload = () => setPaystackReady(true)
//     document.body.appendChild(script)
//   }, [])

//   const handlePayment = () => {
//     if (!userId || !amount) {
//       toast.error("Missing user ID or amount")
//       return
//     }

//     if (!paystackReady || !window.PaystackPop) {
//       toast.error("Paystack is not ready yet. Please try again shortly.")
//       return
//     }

//     const paystack = window.PaystackPop.setup({
//       key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!, // Replace with real public key
//       amount: amount * 100, // Paystack uses kobo
//       email: email || "test@gmail.com",
//       ref,
//       callback: function (response) {
//         fetch("/api/transactions/verify", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ref: response.reference,
//             userId,
//             amount,
//           }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.success) {
//               toast.success("Wallet funded successfully!")
//               setTimeout(() => {
//                 router.push("/dashboard")
//               }, 1000)
//             } else {
//               toast.error(data.error || "Verification failed")
//             }
//           })
//           .catch(() => alert("Error verifying payment"))
//       },
//       onClose: () => {
//         toast.error("Payment window closed.")
//       },
//     })

//     paystack.openIframe()
//   }

//   return (
//     <button
//       onClick={handlePayment}
//       className="bg-black text-white py-2 rounded w-full"
//       disabled={!paystackReady || amount <= 0}
//     >
//       {paystackReady ? "Add Money" : "Loading..."}
//     </button>
//   )
// }