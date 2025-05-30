"use client"

import Link from "next/link"
import { ShoppingCart, User, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useState, useRef, useEffect } from "react"

export default function Header() {
    const { cartItems } = useCart()
    const { user, logout } = useAuth()

    const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const profileMenuRef = useRef<HTMLDivElement>(null)

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen)
    }

    const closeProfileMenu = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileMenuOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", closeProfileMenu)
        return () => {
            document.removeEventListener("mousedown", closeProfileMenu)
        }
    }, [])

    return (
        <header className="cura-header">
            <div className="cura-container">
                <nav className="cura-nav flex justify-between items-center py-4">
                    <Link href="/" className="cura-logo text-2xl font-bold text-green-600">
                        CURA
                    </Link>

                    <ul className="cura-nav-links flex gap-6">
                        <li>
                            <Link href="/" className="cura-nav-link hover:text-green-600 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/medicines" className="cura-nav-link hover:text-green-600 transition-colors">
                                Medicines
                            </Link>
                        </li>
                        {user && (
                            <>
                                <li>
                                    <Link href="/presets" className="cura-nav-link flex items-center gap-1 hover:text-green-600 transition-colors">
                                        Presets
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/orders" className="cura-nav-link hover:text-green-600 transition-colors">
                                        Orders
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                <Link href="/cart" className="relative">
                                    <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" />
                                    {cartItemsCount > 0 && <span className="cura-badge absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">{cartItemsCount}</span>}
                                </Link>
                                <div className="relative" ref={profileMenuRef}>
                                    <button onClick={toggleProfileMenu} className="flex items-center gap-1 cursor-pointer focus:outline-none">
                                        <User className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" /> {/* Generic Profile Icon */}
                                        {/* Add an <img> tag here if you have user profile pictures */}
                                    </button>

                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                                            <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link href="/login" className="cura-btn-secondary px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                                    Login
                                </Link>
                                <Link href="/signup" className="cura-btn-primary px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
