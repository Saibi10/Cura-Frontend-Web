"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface Order {
  _id: string
  items: Array<{
    medicine: {
      _id: string
      name: string
      price: number
    }
    quantity: number
    price: number
  }>
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "completed" | "failed" | "refunded"
  createdAt: string
}

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
}

const statusColors = {
  pending: "text-yellow-600 bg-yellow-100",
  processing: "text-blue-600 bg-blue-100",
  shipped: "text-purple-600 bg-purple-100",
  delivered: "text-green-600 bg-green-100",
  cancelled: "text-red-600 bg-red-100",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const success = searchParams.get("success")

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      router.push("/login")
    }
  }, [user, router])

  const fetchOrders = async () => {
    try {
      // Mock data for demo - replace with actual API call
      const mockOrders: Order[] = [
        {
          _id: "1",
          items: [
            {
              medicine: { _id: "1", name: "Paracetamol 500mg", price: 25 },
              quantity: 2,
              price: 25,
            },
            {
              medicine: { _id: "3", name: "Vitamin D3 1000 IU", price: 180 },
              quantity: 1,
              price: 180,
            },
          ],
          totalAmount: 230,
          status: "delivered",
          paymentStatus: "completed",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          _id: "2",
          items: [
            {
              medicine: { _id: "5", name: "Ibuprofen 400mg", price: 45 },
              quantity: 1,
              price: 45,
            },
          ],
          totalAmount: 45,
          status: "shipped",
          paymentStatus: "completed",
          createdAt: "2024-01-20T14:15:00Z",
        },
      ]

      setOrders(mockOrders)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoading(false)
    }
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
        {success && (
          <div className="cura-card p-6 mb-8 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Order Placed Successfully!</h3>
                <p className="text-green-700">Your order has been placed and will be processed soon.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <button onClick={() => router.push("/medicines")} className="cura-btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status]
              return (
                <div key={order._id} className="cura-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusColors[order.status]}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">{item.medicine.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">
                        Payment Status:
                        <span
                          className={`ml-1 font-medium ${
                            order.paymentStatus === "completed"
                              ? "text-green-600"
                              : order.paymentStatus === "failed"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">Total: ₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
