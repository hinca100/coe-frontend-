"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import AdminNavigationMenu from "@/components/ui/admin-nav-menu"
import CoursesSection from "@/app/admin/components/CoursesSection"
import UsersSection from "@/app/admin/components/UsersSection"
import StatsSection from "@/app/admin/components/StatsSection"
import SettingsSection from "@/app/admin/components/SettingsSection"
import * as Avatar from "@radix-ui/react-avatar"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      if (parsed.role === "admin") {
        setUser(parsed)
      } else {
        router.replace("/dashboard")
      }
    } else {
      router.replace("/auth/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/auth/login")
  }

  const renderSection = () => {
    switch (activeSection) {
      case "Cursos":
        return <CoursesSection />
      case "Usuarios":
        return <UsersSection />
      case "Estadísticas":
        return <StatsSection />
      case "Configuración":
        return <SettingsSection />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BookOpen className="h-12 w-12 text-indigo-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Bienvenido Administrador 👑
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Selecciona una opción del menú superior para comenzar 🚀
            </p>
          </div>
        )
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 🎨 Fondo animado difuminado */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 dark:opacity-10"></div>
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"></div>

      {/* Contenido */}
      <div className="relative flex flex-col min-h-screen">
        {/* Header con efecto glass */}
        <header className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between backdrop-blur-md bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-xl px-6 py-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-full shadow-md">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Mentora Platform (Admin)
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Avatar.Root className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-md">
                <Avatar.Fallback delayMs={600}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </Avatar.Fallback>
              </Avatar.Root>

              {/* Nombre + correo */}
              <span className="text-gray-800 dark:text-white font-medium">
                {user.name}{" "}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({user.email})
                </span>
              </span>

              {/* Logout */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
              >
                Cerrar sesión
              </Button>
            </div>
          </nav>
        </header>

        {/* Menú superior con glass */}
        <div className="container mx-auto mt-6">
          <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-xl shadow-lg p-3">
            <AdminNavigationMenu onChangeSection={setActiveSection} />
          </div>
        </div>

        {/* Contenido dinámico */}
        <main className="container mx-auto px-6 py-8 flex-grow">
          <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  )
}