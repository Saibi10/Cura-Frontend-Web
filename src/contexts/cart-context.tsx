"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItem {
    _id: string
    name: string
    price: number
    quantity: number
    image: string
    stock: number
    requiresPrescription: boolean
}

interface CartContextType {
    cartItems: CartItem[]
    addToCart: (item: Omit<CartItem, "quantity">) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("cura-cart")
        if (savedCart) {
            try {
                setCartItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Error loading cart from localStorage:", error)
            }
        }
    }, [])

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cura-cart", JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((cartItem) => cartItem._id === item._id)

            if (existingItem) {
                // If item already exists, increase quantity
                return prevItems.map((cartItem) =>
                    cartItem._id === item._id ? { ...cartItem, quantity: Math.min(cartItem.quantity + 1, item.stock) } : cartItem,
                )
            } else {
                // Add new item to cart
                return [...prevItems, { ...item, quantity: 1 }]
            }
        })
    }

    const removeFromCart = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item._id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id)
            return
        }

        setCartItems((prevItems) =>
            prevItems.map((item) => (item._id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item)),
        )
    }

    const clearCart = () => {
        setCartItems([])
    }

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
