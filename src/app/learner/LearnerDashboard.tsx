"use client"

import { useEffect, useState } from "react"
import CoursesList from "./components/CoursesList"
import MyCourses from "./components/MyCourses"
import Progress from "./components/Progress"
import Badges from "./components/Badges"
import LearnerNavigationMenu from "@/components/ui/learner-nav-menu"
import { BookOpen, UserCircle2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useLearnerStore } from "@/store/learnerStore"

type User = {
  name: string
  email: string
}

export default function LearnerDashboard() {
  const router = useRouter()
  const { activeSection, setActiveSection } = useLearnerStore() 
  const [user, setUser] = useState<User | null>(null)

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Error cargando perfil")
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProfile()
    const savedSection = localStorage.getItem("learnerSection")
    if (savedSection) {
      setActiveSection(savedSection)
      localStorage.removeItem("learnerSection") // 👈 limpiamos después
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/auth/login")
  }

  const renderSection = () => {
    switch (activeSection) {
      case "Explorar":
        return <CoursesList />
      case "Mis cursos":
        return <MyCourses />
      case "Progreso":
        return <Progress />
      case "Insignias":
        return <Badges />
      default:
        return (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Selecciona una sección para comenzar 🚀
          </p>
        )
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 🎨 Fondo animado */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 dark:opacity-10"></div>
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* =====================
            Header Aprendiz
        ===================== */}
        <header className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between backdrop-blur-md bg-white/70 dark:bg-gray-800/50 border border-white/30 dark:border-gray-700/30 rounded-xl px-6 py-4 shadow-lg">
            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-lg text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-6 w-6" /> Mentora Platform (Aprendiz)
            </div>

            {/* Usuario */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <UserCircle2 className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Cerrar sesión
                </Button>
              </div>
            )}
          </nav>
        </header>

        {/* =====================
            Menú navegación
        ===================== */}
        <div className="container mx-auto mt-6">
          <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-xl shadow-lg p-3">
            <LearnerNavigationMenu onChangeSection={setActiveSection} />
          </div>
        </div>

        {/* =====================
            Contenido dinámico
        ===================== */}
        <main className="container mx-auto px-6 py-8 flex-1">
  {renderSection()}
</main>
      </div>
    </div>
  )
}