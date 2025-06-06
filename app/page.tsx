"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Simulated user data
const users = [
  { id: 1, email: "admin@company.com", password: "admin123", role: "admin", name: "Admin User" },
  { id: 2, email: "john@company.com", password: "user123", role: "user", name: "John Doe" },
  { id: 3, email: "jane@company.com", password: "user123", role: "user", name: "Jane Smith" },
  { id: 4, email: "mike@company.com", password: "user123", role: "user", name: "Mike Johnson" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #044f7c 0%, #5c2d88 50%, #6f2978 100%)" }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div
            className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: "#00a7cf" }}
          >
            EMS
          </div>
          <CardTitle className="text-2xl">Employee Management System</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" style={{ backgroundColor: "#044f7c" }}>
              Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs">Admin: admin@company.com / admin123</p>
            <p className="text-xs">User: john@company.com / user123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
