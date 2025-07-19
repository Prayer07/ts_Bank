'use client'

import { useState, useEffect } from 'react'
import AddMoneyButton from '../../components/AddMoneyButton'

export default function AddMoneyPage() {
  const [amount, setAmount] = useState('')
  const [userId, setUserId] = useState('')

  // 🔐 Get user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    if (user?._id) {
      setUserId(user._id)
    }
  }, [userId])

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Add Money</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      {/* ✅ Pass real userId and amount */}
      <AddMoneyButton userId={userId} amount={amount} />
    </div>
  )
}






// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import AddMoneyButton from '../../components/AddMoneyButton'

// const mockUser = {
//   _id: '123456abcdef',
// }

// export default function AddMoneyPage() {
//   const [amount, setAmount] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [message, setMessage] = useState('')
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)

//     const token = sessionStorage.getItem('token')
//     if (!token) return router.push('/login')

//     const res = await fetch('/api/add-money', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ amount }),
//     })

//     const data = await res.json()
//     setLoading(false)

//     if (!res.ok) {
//       setMessage(data.error || 'Something went wrong')
//     } else {
//       setMessage('✅ Money added successfully!')
//       setTimeout(() => router.push('/dashboard'), 1500)
//     }
//   }

//   return (
//     <div className="min-h-screen p-4 flex flex-col justify-center items-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
//       >
//         <h2 className="text-xl font-bold mb-4 text-center">Add Money</h2>
//         <input
//           type="number"
//           placeholder="Enter amount"
//           className="w-full p-3 border rounded mb-4"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />

// <AddMoneyButton user={{ _id: user._id }} />

//         {message && <p className="text-center mt-4 text-sm">{message}</p>}
//       </form>
//     </div>
//   )
// }
