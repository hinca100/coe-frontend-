"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { API_URL } from "@/lib/api"
import { BookOpen, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as Dialog from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { useLearnerStore } from "@/store/learnerStore"

// =====================
// Helpers
// =====================
const detectResourceType = (url: string): "pdf" | "video" | "image" => {
  if (!url) return "pdf"
  if (url.endsWith(".pdf")) return "pdf"
  if (url.match(/\.(mp4|mov|avi|mkv)$/i)) return "video"
  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return "image"
  return "pdf"
}

type Chapter = {
  _id: string
  title: string
  description?: string
  order: number
  resourceType?: string
  resourceUrl?: string
}

type Course = {
  _id: string
  title: string
  description: string
  category: string
  coverImage?: string
  chapters?: Chapter[]
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { setActiveSection } = useLearnerStore()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<Chapter | null>(null)
  const [completedChapters, setCompletedChapters] = useState<string[]>([])

  // =====================
  // Fetch curso + progreso
  // =====================
  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem("accessToken")

      const resCourse = await fetch(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const courseData = await resCourse.json()
      setCourse(courseData)

      const resProgress = await fetch(`${API_URL}/progress/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const progressData = await resProgress.json()
      if (progressData.completedChapters) {
        setCompletedChapters(progressData.completedChapters)
      }
    } catch (err) {
      console.error("Error cargando curso/progreso", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!course) {
    return <p className="text-center mt-10 text-gray-600">Curso no encontrado ❌</p>
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
      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 py-10 flex-1">
        {/* Botón volver */}
        <Button
          variant="outline"
          onClick={() => {
            setActiveSection("Explorar") // 👈 ahora vuelve a explorar cursos
            router.push("/learner")
          }}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a cursos
        </Button>

        {/* Caja principal */}
        <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/70 border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-xl p-6">
          {/* Portada */}
          <img
            src={course.coverImage || `https://picsum.photos/seed/${course.title}/800/400`}
            alt={course.title}
            className="w-full h-60 object-cover rounded-xl shadow mb-6"
          />

          {/* Info */}
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-700/40 dark:text-indigo-300 rounded-full text-sm">
            {course.category}
          </span>

          {/* Capítulos */}
          <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <BookOpen className="h-6 w-6 text-indigo-600" /> Contenido del curso
          </h2>
          {course.chapters && course.chapters.length > 0 ? (
            <ul className="space-y-3">
              {course.chapters.map((ch) => {
                const isCompleted = completedChapters.includes(ch._id)
                const realType = detectResourceType(ch.resourceUrl || "")
                return (
                  <li
                    key={ch._id}
                    className={`p-4 rounded-lg shadow flex justify-between items-center ${
                      isCompleted
                        ? "bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500"
                        : "bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm"
                    }`}
                  >
                    <div>
                      <h3 className="font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {ch.order}. {ch.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{ch.description}</p>
                    </div>

                    <div className="flex gap-2">
                      {/* 📄 Si es PDF 👉 abrir en pestaña nueva */}
                      {realType === "pdf" && (
                        <Button
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => window.open(ch.resourceUrl, "_blank")}
                        >
                          Ver PDF
                        </Button>
                      )}

                      {/* 🎥 o 🖼️ si es video/imagen 👉 modal */}
                      {(realType === "video" || realType === "image") && (
                        <Dialog.Root
                          open={selectedResource?._id === ch._id}
                          onOpenChange={(open) => {
                            if (!open) setSelectedResource(null)
                          }}
                        >
                          <Dialog.Trigger asChild>
                            <Button
                              size="sm"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                              onClick={() => setSelectedResource(ch)}
                            >
                              Ver recurso
                            </Button>
                          </Dialog.Trigger>
                          <Dialog.Portal>
                            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                            <Dialog.Content
                              className="fixed top-[50%] left-[50%] w-[90%] max-w-3xl h-[80%]
                                         -translate-x-1/2 -translate-y-1/2 
                                         bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 overflow-y-auto z-50"
                            >
                              <Dialog.Title className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                                {ch.title}
                              </Dialog.Title>

                              {realType === "video" && (
                                <video controls className="w-full h-[70vh] rounded-lg">
                                  <source src={ch.resourceUrl} />
                                  Tu navegador no soporta video.
                                </video>
                              )}

                              {realType === "image" && (
                                <img
                                  src={ch.resourceUrl}
                                  alt={ch.title}
                                  className="max-h-[70vh] w-auto mx-auto rounded-lg shadow"
                                />
                              )}

                              <div className="flex justify-end mt-4">
                                <Dialog.Close asChild>
                                  <Button variant="outline">Cerrar</Button>
                                </Dialog.Close>
                              </div>
                            </Dialog.Content>
                          </Dialog.Portal>
                        </Dialog.Root>
                      )}

                      {/* ✅ Botón marcar visto */}
                      <Button
                        size="sm"
                        variant={isCompleted ? "secondary" : "outline"}
                        disabled={isCompleted}
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("accessToken")
                            const res = await fetch(`${API_URL}/progress/mark`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                courseId: course._id,
                                chapterId: ch._id,
                              }),
                            })

                            if (!res.ok) throw new Error("Error guardando progreso")
                            const data = await res.json()

                            setCompletedChapters((prev) => [...prev, ch._id])

                            if (data.badge) {
                              toast.success(`🏅 Completaste el curso "${course.title}". Revisa tu correo 🎉`)
                            } else {
                              toast.success(`✅ Marcaste como visto: ${ch.title}`)
                            }
                          } catch (err: any) {
                            toast.error(err.message)
                          }
                        }}
                      >
                        {isCompleted ? "Visto" : "Marcar visto"}
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Este curso aún no tiene capítulos.</p>
          )}
        </div>
      </div>
    </div>
  )
}