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
        console.log('[AuthProvider] Initial mount - checking for existing auth')
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        console.log(`[AuthProvider] Found token: ${token ? 'yes' : 'no'}, userData:`, userData)

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData)
                console.log('[AuthProvider] Parsed user data:', parsedUser)
                setUser(parsedUser)
            } catch (error) {
                console.error('[AuthProvider] Error parsing user data:', error)
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        }
        setLoading(false)
    }, [])

    const register = async (userData: any) => {
        console.log('[AuthProvider] Register called with data:', userData)
        try {
            const response = await fetch("http://localhost:5000/api/v1/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })

            console.log('[AuthProvider] Register response status:', response.status)
            const data = await response.json()
            console.log('[AuthProvider] Register response data:', data)

            if (data.success) {
                console.log('[AuthProvider] Registration successful, user:', data.User)
                return { success: true, user: data.User }
            } else {
                console.log('[AuthProvider] Registration failed:', data.message)
                return { success: false, message: data.message || "Registration failed" }
            }
        } catch (error) {
            console.error('[AuthProvider] Registration error:', error)
            return { success: false, message: "Network error occurred" }
        }
    }

    const verifyOTP = async (userId: string, otp: string) => {
        console.log(`[AuthProvider] verifyOTP called with userId: ${userId}, otp: ${otp}`)
        try {
            const response = await fetch("http://localhost:5000/api/v1/users/verify-email-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, otp }),
            })

            console.log('[AuthProvider] verifyOTP response status:', response.status)
            const data = await response.json()
            console.log('[AuthProvider] verifyOTP response data:', data)

            return { success: data.success, message: data.message }
        } catch (error) {
            console.error('[AuthProvider] verifyOTP error:', error)
            return { success: false, message: "Network error occurred" }
        }
    }

    const login = async (email: string, password: string, otp?: string) => {
        console.log(`[AuthProvider] login called with email: ${email}, otp: ${otp || 'none'}`)
        try {
            const payload = { email, password, otp }
            console.log('[AuthProvider] Sending login payload:', payload)

            // Changed to POST and properly structured the request
            const response = await fetch("http://localhost:5000/api/v1/users/me", {
                method: "POST", // Changed from GET to POST
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })

            console.log('[AuthProvider] login response status:', response.status)
            const data = await response.json()
            console.log('[AuthProvider] login response data:', data)

            if (data.success) {
                console.log('[AuthProvider] Login successful, setting token and user')
                localStorage.setItem("token", data.token)
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
                    console.log('[AuthProvider] OTP required')
                    return { success: false, requiresOTP: true, message: "OTP sent to your email" }
                }
                console.log('[AuthProvider] Login failed:', data.message)
                return { success: false, message: data.message || "Login failed" }
            }
        } catch (error) {
            console.error('[AuthProvider] Login error:', error)
            return { success: false, message: "Network error occurred" }
        }
    }

    const logout = () => {
        console.log('[AuthProvider] logout called')
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