"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle } from "lucide-react"
import { API_URL } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Course = {
  _id: string
  title: string
  description: string
  category: string
  status: string
  coverImage?: string
}

export default function CoursesList() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolledIds, setEnrolledIds] = useState<string[]>([])

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses?status=published`)
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      console.error("Error cargando cursos", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_URL}/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setEnrolledIds(data.map((e: any) => e.courseId?._id || e._id))
    } catch (err) {
      console.error("Error cargando inscripciones", err)
    }
  }

  useEffect(() => {
    fetchCourses()
    fetchEnrollments()
  }, [])

  const handleEnroll = async (courseId: string) => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(`${API_URL}/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      })

      if (!res.ok) throw new Error("Error al inscribirse en el curso")

      toast.success("✅ Te inscribiste en el curso")
      setEnrolledIds((prev) => [...prev, courseId])
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-2 text-white drop-shadow">
        <BookOpen className="h-8 w-8 text-yellow-300" /> Explorar Cursos 🚀
      </h2>

      {courses.length === 0 ? (
        <p className="text-white/80 text-center text-lg">
          No hay cursos publicados por el momento. 📭
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="p-4 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-800/80 
                         backdrop-blur-md hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <img
                src={
                  course.coverImage
                    ? course.coverImage
                    : `https://picsum.photos/seed/${encodeURIComponent(course.title)}/600/400`
                }
                alt={course.title}
                className="h-40 w-full object-cover rounded-xl mb-3"
              />

              <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {course.description}
              </p>

              <span className="inline-block text-xs px-2 py-1 rounded-full bg-indigo-100 
                               text-indigo-700 dark:bg-indigo-700/40 dark:text-indigo-300 mb-3">
                {course.category}
              </span>

              <div className="flex items-center justify-between mt-2">
                <span className="text-green-600 text-sm flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" /> Disponible
                </span>

                {enrolledIds.includes(course._id) ? (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => router.push(`/learner/courses/${course._id}`)}
                  >
                    Ir al curso
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Inscribirme
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}