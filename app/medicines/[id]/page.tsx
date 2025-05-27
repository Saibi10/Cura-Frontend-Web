"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Heart, AlertCircle, Package, Calendar, Building } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import LoadingSpinner from "@/components/ui/loading-spinner"

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
  expiryDate: string
}

export default function MedicineDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [medicine, setMedicine] = useState<Medicine | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchMedicine(params.id as string)
    }
  }, [params.id])

  const fetchMedicine = async (id: string) => {
    try {
      // Mock data for demo - replace with actual API call
      const mockMedicine: Medicine = {
        _id: id,
        name: "Paracetamol 500mg",
        description:
          "Paracetamol is a widely used over-the-counter pain reliever and fever reducer. It is effective for treating mild to moderate pain including headaches, muscle aches, arthritis, backaches, toothaches, colds, and fevers. This medication works by blocking the production of certain natural substances in your body that cause inflammation. Paracetamol is generally safe when used as directed and is suitable for most adults and children over 12 years of age.",
        price: 25,
        category: "Pain Relief",
        stock: 150,
        requiresPrescription: false,
        images: [
          { url: "/placeholder.svg?height=400&width=400", isPrimary: true },
          { url: "/placeholder.svg?height=400&width=400", isPrimary: false },
          { url: "/placeholder.svg?height=400&width=400", isPrimary: false },
        ],
        manufacturer: "HealthCorp Pharmaceuticals",
        expiryDate: "2025-12-31",
      }

      setMedicine(mockMedicine)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching medicine:", error)
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (medicine) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          _id: medicine._id,
          name: medicine.name,
          price: medicine.price,
          image: medicine.images[0]?.url || "/placeholder.svg?height=200&width=280",
          stock: medicine.stock,
          requiresPrescription: medicine.requiresPrescription,
        })
      }
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (medicine?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Medicine Not Found</h2>
          <button onClick={() => router.back()} className="cura-btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="cura-container">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Medicines
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="cura-card p-4">
              <Image
                src={medicine.images[selectedImage]?.url || "/placeholder.svg?height=400&width=400"}
                alt={medicine.name}
                width={400}
                height={400}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {medicine.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {medicine.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-green-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`${medicine.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="cura-category-badge">{medicine.category}</span>
                {medicine.requiresPrescription && (
                  <span className="cura-prescription-badge">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Prescription Required
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
              <p className="text-xl text-green-600 font-bold mb-4">₹{medicine.price}</p>
            </div>

            <div className="cura-card p-6">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Manufacturer:</span>
                  <span className="font-medium">{medicine.manufacturer}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{medicine.stock} units available</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Expiry Date:</span>
                  <span className="font-medium">{new Date(medicine.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="cura-card p-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{medicine.description}</p>
            </div>

            {medicine.requiresPrescription && (
              <div className="cura-card p-6 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Prescription Required</h4>
                    <p className="text-red-700 text-sm">
                      This medicine requires a valid prescription from a licensed healthcare provider. You will need to
                      upload your prescription during checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="cura-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium">Quantity:</label>
                <div className="cura-quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="cura-quantity-btn"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="cura-quantity-input"
                    min="1"
                    max={medicine.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="cura-quantity-btn"
                    disabled={quantity >= medicine.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total: ₹{medicine.price * quantity}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={medicine.stock === 0}
                  className={`flex-1 cura-btn-primary ${medicine.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {medicine.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button className="cura-btn-secondary">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
