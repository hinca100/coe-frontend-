"use client"

import { Button } from "@/components/ui/button"

export default function CoursesSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestión de Cursos</h2>
      <p className="text-gray-600 mb-6">Aquí puedes crear, editar y publicar cursos.</p>

      <div className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Crear nuevo curso</Button>
        <Button variant="outline">Ver todos los cursos</Button>
      </div>
    </div>
  )
}