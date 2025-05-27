"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  role: "customer" | "rider" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (
    email: string,
    password: string,
    otp?: string,
  ) => Promise<{ success: boolean; message?: string; requiresOTP?: boolean }>
  register: (userData: any) => Promise<{ success: boolean; message?: string; user?: any }>
  verifyOTP: (userId: string, otp: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const register = async (userData: any) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, user: data.User }
      } else {
        return { success: false, message: data.message || "Registration failed" }
      }
    } catch (error) {
      return { success: false, message: "Network error occurred" }
    }
  }

  const verifyOTP = async (userId: string, otp: string) => {
    try {
      const response = await fetch("/api/users/verify-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      })

      const data = await response.json()
      return { success: data.success, message: data.message }
    } catch (error) {
      return { success: false, message: "Network error occurred" }
    }
  }

  const login = async (email: string, password: string, otp?: string) => {
    try {
      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, otp }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("token", data.token)
        // For demo purposes, we'll create a mock user object
        const mockUser = {
          _id: "1",
          name: "Demo User",
          email: email,
          role: "customer" as const,
        }
        localStorage.setItem("user", JSON.stringify(mockUser))
        setUser(mockUser)
        return { success: true }
      } else {
        if (data.message === "OTP sent to email") {
          return { success: false, requiresOTP: true, message: "OTP sent to your email" }
        }
        return { success: false, message: data.message || "Login failed" }
      }
    } catch (error) {
      return { success: false, message: "Network error occurred" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        verifyOTP,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
