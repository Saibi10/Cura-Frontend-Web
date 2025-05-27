"use client"

import Link from "next/link"
import { ShoppingCart, User, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const { cartItems } = useCart()
  const { user, logout } = useAuth()

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="cura-header">
      <div className="cura-container">
        <nav className="cura-nav">
          <Link href="/" className="cura-logo">
            CURA
          </Link>

          <ul className="cura-nav-links">
            <li>
              <Link href="/" className="cura-nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link href="/medicines" className="cura-nav-link">
                Medicines
              </Link>
            </li>
            {user && (
              <>
                <li>
                  <Link href="/presets" className="cura-nav-link">
                    <Package className="w-4 h-4" />
                    Presets
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="cura-nav-link">
                    Orders
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" />
                  {cartItemsCount > 0 && <span className="cura-badge absolute -top-2 -right-2">{cartItemsCount}</span>}
                </Link>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{user.name}</span>
                  <button onClick={logout} className="text-sm text-red-600 hover:text-red-700 ml-2">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="cura-btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="cura-btn-primary">
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
