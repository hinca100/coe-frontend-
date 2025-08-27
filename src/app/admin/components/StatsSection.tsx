"use client"

import { useEffect, useState } from "react"
import { BookOpen, Rocket, Users, ShieldCheck, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type Course = {
  _id: string
  title: string
  description: string
  status: string
}

type User = {
  _id: string
  name: string
  email: string
  role: string
}

type StatItem = {
  label: string
  value: number
  icon: any
  color: string
  file: string
  data: any[]
  fields: string[]
}

export default function StatsSection() {
  const [courses, setCourses] = useState<Course[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // 🔹 Cargar cursos y usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken")

        // cursos
        const resCourses = await fetch("https://coe-backend-l1tt.onrender.com/api/courses")
        const dataCourses = await resCourses.json()
        setCourses(dataCourses)

        // usuarios
        const resUsers = await fetch("https://coe-backend-l1tt.onrender.com/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const dataUsers = await resUsers.json()
        setUsers(dataUsers)
      } catch (err) {
        console.error("Error cargando estadísticas:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  // 🔹 Calcular métricas
  const totalCursos = courses.length
  const cursosPublicados = courses.filter((c) => c.status === "published").length
  const totalUsuarios = users.length
  const admins = users.filter((u) => u.role === "admin").length
  const aprendices = users.filter((u) => u.role === "learner").length

  // 🔹 Función para descargar JSON simplificado
  const downloadFile = (fileName: string, data: any[], fields: string[]) => {
    const simplified = data.map((item) => {
      const obj: Record<string, any> = {}
      fields.forEach((f) => {
        obj[f] = item[f]
      })
      return obj
    })

    const blob = new Blob([JSON.stringify(simplified, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  // 🔹 Definición de stats con campos visibles
  const stats: StatItem[] = [
    {
      label: "Total Cursos",
      value: totalCursos,
      icon: BookOpen,
      color: "from-blue-400 to-blue-600",
      file: "total-cursos.json",
      data: courses,
      fields: ["title", "description"],
    },
    {
      label: "Cursos Publicados",
      value: cursosPublicados,
      icon: Rocket,
      color: "from-green-400 to-green-600",
      file: "cursos-publicados.json",
      data: courses.filter((c) => c.status === "published"),
      fields: ["title", "description"],
    },
    {
      label: "Total Usuarios",
      value: totalUsuarios,
      icon: Users,
      color: "from-purple-400 to-purple-600",
      file: "total-usuarios.json",
      data: users,
      fields: ["name", "email", "role"], // 👈 añadí `name`
    },
    {
      label: "Admins",
      value: admins,
      icon: ShieldCheck,
      color: "from-red-400 to-red-600",
      file: "admins.json",
      data: users.filter((u) => u.role === "admin"),
      fields: ["name", "email", "role"],
    },
    {
      label: "Aprendices",
      value: aprendices,
      icon: Users,
      color: "from-indigo-400 to-indigo-600",
      file: "aprendices.json",
      data: users.filter((u) => u.role === "learner"),
      fields: ["name", "email", "role"],
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">📊 Estadísticas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`relative p-6 rounded-xl shadow-lg bg-gradient-to-br ${stat.color} text-white flex flex-col items-center justify-center transform hover:scale-105 transition-transform`}
            >
              <Icon className="h-10 w-10 mb-3" />
              <span className="text-3xl font-bold">{stat.value}</span>
              <span className="mt-1 text-sm opacity-90">{stat.label}</span>

              {/* Botón de descarga */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadFile(stat.file, stat.data, stat.fields)}
                className="absolute top-2 right-2 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}