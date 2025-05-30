"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, User, Phone, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
        },
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1) // 1: signup form, 2: OTP verification
    const [userId, setUserId] = useState("")
    const [otp, setOtp] = useState("")
    const [message, setMessage] = useState("")

    const { register, verifyOTP } = useAuth()
    const router = useRouter()

    const validateForm = () => {
        const newErrors: any = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        setMessage("")

        try {
            const result = await register(formData)

            if (result.success) {
                setUserId(result.user._id)
                setStep(2)
                setMessage("OTP sent to your email. Please verify to complete registration.")
            } else {
                setMessage(result.message || "Registration failed")
            }
        } catch (error) {
            setMessage("An error occurred during registration")
        } finally {
            setLoading(false)
        }
    }

    const handleOTPVerification = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!otp.trim() || otp.length !== 6) {
            setMessage("Please enter a valid 6-digit OTP")
            return
        }

        setLoading(true)
        setMessage("")

        try {
            const result = await verifyOTP(userId, otp)

            if (result.success) {
                setMessage("Registration completed successfully! Redirecting to login...")
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                setMessage(result.message || "OTP verification failed")
            }
        } catch (error) {
            setMessage("An error occurred during OTP verification")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1]
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev: Record<string, string>) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full">
                    <div className="cura-card p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Verify Your Email</h2>
                            <p className="mt-2 text-gray-600">We've sent a 6-digit OTP to your email address</p>
                        </div>

                        <form onSubmit={handleOTPVerification} className="space-y-6">
                            <div className="cura-form-group">
                                <label htmlFor="otp" className="cura-label">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="cura-input text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                    required
                                />
                            </div>

                            {message && (
                                <div className={`text-center text-sm ${message.includes("success") ? "cura-success" : "cura-error"}`}>
                                    {message}
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="w-full cura-btn-primary">
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <button onClick={() => setStep(1)} className="text-green-600 hover:text-green-700 text-sm">
                                Back to registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="cura-card p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">Join CURA for easy medicine ordering</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="cura-form-group">
                            <label htmlFor="name" className="cura-label">
                                <User className="w-4 h-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="cura-input"
                                placeholder="Enter your full name"
                                required
                            />
                            {errors.name && <div className="cura-error">{errors.name}</div>}
                        </div>

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
                            {errors.email && <div className="cura-error">{errors.email}</div>}
                        </div>

                        <div className="cura-form-group">
                            <label htmlFor="phone" className="cura-label">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="cura-input"
                                placeholder="Enter your phone number"
                                required
                            />
                            {errors.phone && <div className="cura-error">{errors.phone}</div>}
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
                                    placeholder="Create a password"
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
                            {errors.password && <div className="cura-error">{errors.password}</div>}
                        </div>

                        <div className="cura-form-group">
                            <label htmlFor="confirmPassword" className="cura-label">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="cura-input pr-10"
                                    placeholder="Confirm your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <div className="cura-error">{errors.confirmPassword}</div>}
                        </div>

                        <div className="cura-form-group">
                            <label className="cura-label">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Address
                            </label>
                            <div className="space-y-3">
                                <input
                                    name="address.street"
                                    type="text"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                    className="cura-input"
                                    placeholder="Street address"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        name="address.city"
                                        type="text"
                                        value={formData.address.city}
                                        onChange={handleInputChange}
                                        className="cura-input"
                                        placeholder="City"
                                    />
                                    <input
                                        name="address.state"
                                        type="text"
                                        value={formData.address.state}
                                        onChange={handleInputChange}
                                        className="cura-input"
                                        placeholder="State"
                                    />
                                </div>
                                <input
                                    name="address.zipCode"
                                    type="text"
                                    value={formData.address.zipCode}
                                    onChange={handleInputChange}
                                    className="cura-input"
                                    placeholder="ZIP Code"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`text-center text-sm ${message.includes("success") ? "cura-success" : "cura-error"}`}>
                                {message}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full cura-btn-primary">
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
