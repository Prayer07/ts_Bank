'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from 'react-hot-toast'
import PasswordInput from '../../components/PasswordInput'

export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (form.password.length < 6) {
      setLoading(false)
      return setError('Password is weak')
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      
      toast.success("Signed up successfully")
      setTimeout(() => {
        router.push('/login')
      }, 1500)

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-800 bg-card">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="fullname"
              type="text"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />

            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />

            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-400 underline">
                Login
              </Link>
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-700" />
              <span className="text-muted-foreground text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-700" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google", { redirectTo: "/dashboard" })}
              className="w-full flex items-center justify-center gap-2 rounded-xl"
            >
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}