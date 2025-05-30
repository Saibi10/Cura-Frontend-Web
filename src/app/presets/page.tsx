"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Package, ShoppingCart, Trash2, Edit } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface MedicinePreset {
    _id: string
    name: string
    medicines: Array<{
        medicine: {
            _id: string
            name: string
            price: number
            images: Array<{ url: string; isPrimary: boolean }>
        }
        quantity: number
    }>
}

export default function PresetsPage() {
    const [presets, setPresets] = useState<MedicinePreset[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
    const { user } = useAuth()
    const { addToCart } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            fetchPresets()
        } else {
            router.push("/login")
        }
    }, [user, router])

    const fetchPresets = async () => {
        try {
            // Mock data for demo - replace with actual API call
            const mockPresets: MedicinePreset[] = [
                {
                    _id: "1",
                    name: "Daily Vitamins",
                    medicines: [
                        {
                            medicine: {
                                _id: "3",
                                name: "Vitamin D3 1000 IU",
                                price: 180,
                                images: [{ url: "/placeholder.svg?height=80&width=80", isPrimary: true }],
                            },
                            quantity: 1,
                        },
                        {
                            medicine: {
                                _id: "6",
                                name: "Multivitamin Complex",
                                price: 250,
                                images: [{ url: "/placeholder.svg?height=80&width=80", isPrimary: true }],
                            },
                            quantity: 1,
                        },
                    ],
                },
                {
                    _id: "2",
                    name: "Pain Relief Kit",
                    medicines: [
                        {
                            medicine: {
                                _id: "1",
                                name: "Paracetamol 500mg",
                                price: 25,
                                images: [{ url: "/placeholder.svg?height=80&width=80", isPrimary: true }],
                            },
                            quantity: 2,
                        },
                        {
                            medicine: {
                                _id: "5",
                                name: "Ibuprofen 400mg",
                                price: 45,
                                images: [{ url: "/placeholder.svg?height=80&width=80", isPrimary: true }],
                            },
                            quantity: 1,
                        },
                    ],
                },
            ]

            setPresets(mockPresets)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching presets:", error)
            setLoading(false)
        }
    }

    const handleOrderFromPreset = async (presetId: string) => {
        setSelectedPreset(presetId)

        try {
            const preset = presets.find((p) => p._id === presetId)
            if (!preset) return

            // Add all medicines from preset to cart
            preset.medicines.forEach((item) => {
                for (let i = 0; i < item.quantity; i++) {
                    addToCart({
                        _id: item.medicine._id,
                        name: item.medicine.name,
                        price: item.medicine.price,
                        image: item.medicine.images[0]?.url || "/placeholder.svg?height=80&width=80",
                        stock: 100, // Mock stock
                        requiresPrescription: false,
                    })
                }
            })

            // Redirect to cart
            router.push("/cart")
        } catch (error) {
            console.error("Error ordering from preset:", error)
        } finally {
            setSelectedPreset(null)
        }
    }

    const handleDeletePreset = async (presetId: string) => {
        try {
            // Mock API call - replace with actual API
            setPresets((prev) => prev.filter((preset) => preset._id !== presetId))
        } catch (error) {
            console.error("Error deleting preset:", error)
        }
    }

    const calculatePresetTotal = (preset: MedicinePreset) => {
        return preset.medicines.reduce((total, item) => total + item.medicine.price * item.quantity, 0)
    }

    if (!user) {
        return null
    }

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="cura-container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Medicine Presets</h1>
                        <p className="text-gray-600 mt-2">Save your frequently ordered medicines for quick reordering</p>
                    </div>
                    <button className="cura-btn-primary">
                        <Plus className="w-5 h-5" />
                        Create Preset
                    </button>
                </div>

                {presets.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">No Presets Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Create your first preset by placing an order. Your order will automatically become a preset.
                        </p>
                        <button onClick={() => router.push("/medicines")} className="cura-btn-primary">
                            Browse Medicines
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {presets.map((preset) => (
                            <div key={preset._id} className="cura-preset-card">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">{preset.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDeletePreset(preset._id)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {preset.medicines.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <img
                                                src={item.medicine.images[0]?.url || "/placeholder.svg?height=40&width=40"}
                                                alt={item.medicine.name}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.medicine.name}</p>
                                                <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium">₹{item.medicine.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-semibold">Total: ₹{calculatePresetTotal(preset)}</span>
                                        <span className="text-sm text-gray-600">{preset.medicines.length} items</span>
                                    </div>

                                    <button
                                        onClick={() => handleOrderFromPreset(preset._id)}
                                        disabled={selectedPreset === preset._id}
                                        className="w-full cura-btn-primary"
                                    >
                                        {selectedPreset === preset._id ? (
                                            "Adding to Cart..."
                                        ) : (
                                            <>
                                                <ShoppingCart className="w-4 h-4" />
                                                Order This Preset
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
