"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, AlertCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

interface Medicine {
    _id: string
    name: string
    description: string
    price: number
    category: string
    stock: number
    requiresPrescription: boolean
    images: Array<{
        url: string
        isPrimary: boolean
    }>
    manufacturer: string
}

interface MedicineCardProps {
    medicine: Medicine
}

export default function MedicineCard({ medicine }: MedicineCardProps) {
    const { addToCart } = useCart()

    const primaryImage = medicine.images?.find((img) => img.isPrimary) || medicine.images?.[0]
    const imageUrl = primaryImage?.url || `/placeholder.svg?height=200&width=280`

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart({
            _id: medicine._id,
            name: medicine.name,
            price: medicine.price,
            image: imageUrl,
            stock: medicine.stock,
            requiresPrescription: medicine.requiresPrescription,
        })
    }

    return (
        <Link href={`/medicines/${medicine._id}`}>
            <div className="cura-medicine-card">
                <div className="relative">
                    <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={medicine.name}
                        width={280}
                        height={200}
                        className="cura-medicine-image"
                    />
                    {medicine.stock < 10 && medicine.stock > 0 && (
                        <div className="absolute top-2 right-2">
                            <span className="cura-stock-badge">Low Stock</span>
                        </div>
                    )}
                    {medicine.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="cura-medicine-content">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="cura-category-badge">{medicine.category}</span>
                        {medicine.requiresPrescription && (
                            <span className="cura-prescription-badge">
                                <AlertCircle className="w-3 h-3 inline mr-1" />
                                Prescription
                            </span>
                        )}
                    </div>

                    <h3 className="cura-medicine-title">{medicine.name}</h3>
                    <p className="cura-medicine-description">
                        {medicine.description.length > 100 ? `${medicine.description.substring(0, 100)}...` : medicine.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">by {medicine.manufacturer}</p>

                    <div className="flex items-center justify-between">
                        <span className="cura-medicine-price">₹{medicine.price}</span>
                        <button
                            onClick={handleAddToCart}
                            disabled={medicine.stock === 0}
                            className={`cura-btn-primary ${medicine.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">Stock: {medicine.stock} units</p>
                </div>
            </div>
        </Link>
    )
}
