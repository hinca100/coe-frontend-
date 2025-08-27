"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminDashboard from "../admin/AdminDashboard"
import LearnerDashboard from "../learner/LearnerDashboard"

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.replace("/auth/login")
      return
    }

    try {
      const parsed = JSON.parse(user)
      if (parsed.role) {
        setRole(parsed.role)
      } else {
        router.replace("/auth/login")
      }
    } catch {
      router.replace("/auth/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (role === "admin") {
    return <AdminDashboard />
  }

  if (role === "learner" || role === "aprendiz") {
    return <LearnerDashboard />
  }

  // fallback: si el rol no es válido
  router.replace("/auth/login")
  return null
}