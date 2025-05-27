"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [requiresOTP, setRequiresOTP] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const result = await login(formData.email, formData.password, formData.otp)

      if (result.success) {
        router.push("/")
      } else if (result.requiresOTP) {
        setRequiresOTP(true)
        setMessage(result.message || "OTP sent to your email")
      } else {
        setMessage(result.message || "Login failed")
      }
    } catch (error) {
      setMessage("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="cura-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your CURA account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="cura-form-group">
              <label htmlFor="email" className="cura-label">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="cura-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="cura-form-group">
              <label htmlFor="password" className="cura-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="cura-input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {requiresOTP && (
              <div className="cura-form-group">
                <label htmlFor="otp" className="cura-label">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      otp: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  className="cura-input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">Check your email for the 6-digit verification code</p>
              </div>
            )}

            {message && (
              <div
                className={`text-center text-sm ${
                  message.includes("success") || message.includes("sent") ? "cura-success" : "cura-error"
                }`}
              >
                {message}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full cura-btn-primary">
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>

          <div className="text-center mt-4">
            <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
