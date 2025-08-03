'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({ phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const phoneRegex = /^\d{10}$/

    if (!phoneRegex.test(form.phone)) {
      setLoading(false)
      return setError('Phone must be exactly 10 digits')
    }

    if (form.password.length <= 3) {
      setLoading(false)
      return setError('Password is weak')
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Save token and fname to sessionStorage
      sessionStorage.setItem('token', data.token)
      sessionStorage.setItem('user', JSON.stringify(data.user))
      sessionStorage.setItem('phone', data.phone)

      setTimeout(() => {
        router.push('/dashboard')
      })

    } catch (err: unknown) {
      if(err instanceof Error){
        setError(err.message)
      }else{
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="login-box p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          name="phone"
          type="tel"
          placeholder="Phone (10 digits)"
          value={form.phone}
          onChange={handleChange}
          required
          pattern="\d{10}"
          maxLength={10}
          className="w-full border p-2 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{textAlign:"center"}}>Don&apos;t have an account...? <Link style={{color:"white", textDecoration:"underline"}} href={"/signup"}>Create Account</Link></p>
      </form>
    </div>
  )
}
