"use client"

import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api"
import { BookOpen } from "lucide-react"

type Course = {
  _id: string
  title: string
  description: string
  category: string
  coverImage?: string
  chapters: { _id: string }[]
}

export default function Progress() {
  const [courses, setCourses] = useState<Course[]>([])
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false) // 👈 para evitar hydration error

  // =====================
  // Fetch cursos inscritos + progreso
  // =====================
  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      // 1️⃣ Traer cursos inscritos
      const resEnrollments = await fetch(`${API_URL}/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const enrolledCourses = await resEnrollments.json()
      setCourses(enrolledCourses)

      // 2️⃣ Para cada curso, pedir progreso
      const progressMap: Record<string, number> = {}
      for (const course of enrolledCourses) {
        const resProgress = await fetch(`${API_URL}/progress/${course._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const progressData: { completedChapters: string[] } = await resProgress.json()

        const completed = progressData.completedChapters?.length || 0
        const total = course.chapters?.length || 1
        const percent = Math.round((completed / total) * 100)

        progressMap[course._id] = percent
      }

      setProgress(progressMap)
    } catch (err) {
      console.error("Error cargando progreso", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)   // 👈 evita mismatch SSR vs cliente
    fetchProgress()
  }, [])

  if (!mounted) {
    return null // 👈 evita renderizar en SSR
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-indigo-600" /> Mi progreso
      </h2>

      {courses.length === 0 ? (
        <p className="text-gray-500">Aún no te has inscrito en ningún curso.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition"
            >
              <img
                src={
                  course.coverImage ||
                  `https://picsum.photos/seed/${encodeURIComponent(course.title)}/600/400`
                }
                alt={course.title}
                className="h-32 w-full object-cover rounded-md mb-3"
              />

              <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {course.description}
              </p>

              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress[course._id] || 0}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {progress[course._id] || 0}% completado
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}