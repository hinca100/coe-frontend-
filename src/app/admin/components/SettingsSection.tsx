"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as Switch from "@radix-ui/react-switch"
import { Cog, Bell, FolderPlus } from "lucide-react"

export default function SettingsSection() {
  const [darkMode, setDarkMode] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [categories, setCategories] = useState(["Backend", "Frontend", "DevOps", "Cloud"])
  const [newCategory, setNewCategory] = useState("")

  // 🔹 Leer preferencia al cargar
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme")
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    }
  }, [])

  // 🔹 Cambiar tema
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked)
    if (checked) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <Cog className="h-6 w-6 text-indigo-600" /> Configuración
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tema */}
        <Card className="p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Tema oscuro</h3>
            <p className="text-sm text-gray-500">Forzar la plataforma en modo oscuro</p>
          </div>
          <Switch.Root
            checked={darkMode}
            onCheckedChange={toggleDarkMode}
            className="w-12 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-indigo-600"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-6" />
          </Switch.Root>
        </Card>

        {/* Notificaciones */}
        <Card className="p-6 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" /> Notificaciones por email
            </h3>
            <p className="text-sm text-gray-500">Enviar alertas al crear usuarios o cursos</p>
          </div>
          <Switch.Root
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            className="w-12 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-600"
          >
            <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-6" />
          </Switch.Root>
        </Card>

        {/* Categorías */}
        <Card className="p-6 col-span-1 md:col-span-2">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <FolderPlus className="h-5 w-5 text-green-500" /> Categorías de cursos
          </h3>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nueva categoría"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={addCategory} className="bg-green-600 hover:bg-green-700">
              Agregar
            </Button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <li
                key={cat}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md text-sm"
              >
                {cat}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}