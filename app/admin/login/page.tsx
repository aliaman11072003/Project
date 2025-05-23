"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        throw new Error('Unauthorized access')
      }

      router.push('/admin/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 rounded-lg p-8 border border-purple-900 shadow-[0_0_20px_rgba(138,43,226,0.3)]">
          <h1 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Admin Login
          </h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 