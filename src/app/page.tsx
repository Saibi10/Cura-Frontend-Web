"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Heart, Shield, Truck, Clock } from "lucide-react"
import MedicineCard from "../components/ui/medicine-card"
import LoadingSpinner from "../components/ui/loading-spinner"
import Header from "../components/layout/header"
import { medicineApi, Medicine } from "@/api"

const categories = ["All", "Pain Relief", "Antibiotics", "Vitamins", "First Aid", "Prescription", "Other"]

export default function HomePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    fetchMedicines()
  }, [])

  useEffect(() => {
    filterMedicines()
  }, [medicines, searchTerm, selectedCategory])

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineApi.getAllMedicines();
      console.log("API Response:", response); // For debugging

      if (response.success && response.data) {
        setMedicines(response.data);
      } else {
        console.error("Error fetching medicines:", response.message || "Unexpected response structure");
        setMedicines([]);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMedicines = () => {
    let filtered = medicines

    if (selectedCategory !== "All") {
      filtered = filtered.filter((medicine) => medicine.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredMedicines(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="cura-container text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Your Health, Our Priority</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get your medicines delivered safely and quickly to your doorstep
          </p>
          <Link href="/medicines" className="cura-btn-primary text-lg px-8 py-3">
            Shop Medicines
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="cura-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Medicines</h3>
              <p className="text-gray-600">All medicines are verified and sourced from licensed pharmacies</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer support for your queries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Health First</h3>
              <p className="text-gray-600">Your health and safety is our top priority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Medicines Section */}
      <section className="py-16">
        <div className="cura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Medicines</h2>
            <p className="text-xl text-gray-600">Find the medicines you need from our extensive catalog</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cura-input pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Medicines Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="cura-medicine-grid">
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine._id} medicine={medicine} />
              ))}
            </div>
          )}

          {!loading && filteredMedicines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No medicines found matching your criteria.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/medicines" className="cura-btn-primary">
              View All Medicines
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
