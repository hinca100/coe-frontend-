"use client"

import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api"
import { Award, Loader2 } from "lucide-react"

type Badge = {
  _id: string
  name: string
  icon: string
  courseId: string
  createdAt: string
}

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_URL}/badges/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBadges(data)
    } catch (err) {
      console.error("❌ Error cargando insignias:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBadges()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Award className="h-6 w-6 text-indigo-600" /> Mis insignias
      </h2>

      {badges.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          Todavía no tienes insignias 🏅. Completa cursos para obtenerlas.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge._id}
              className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:shadow-lg transition"
            >
              <img
                src={badge.icon}
                alt={badge.name}
                className="h-16 w-16 object-contain mb-3"
              />
              <h3 className="text-lg font-semibold">{badge.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Obtenida el {new Date(badge.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}