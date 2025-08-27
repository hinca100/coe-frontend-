"use client"

import * as React from "react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { BookOpen, GraduationCap, BarChart3, User, Award } from "lucide-react" // 👈 importamos Award

type Props = {
  onChangeSection?: (section: string) => void
}

const navItems = [
  { label: "Explorar", icon: BookOpen },
  { label: "Mis cursos", icon: GraduationCap },
  { label: "Progreso", icon: BarChart3 },
  { label: "Insignias", icon: Award }, // 👈 nuevo
]

export default function LearnerNavigationMenu({ onChangeSection }: Props) {
  return (
    <div className="w-full flex justify-center mt-6">
      <NavigationMenu.Root>
        <NavigationMenu.List className="flex gap-6 px-8 py-4 rounded-xl shadow-lg bg-gradient-to-r from-indigo-500 via-violet-600 to-purple-600">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavigationMenu.Item key={item.label}>
                <button
                  onClick={() => onChangeSection?.(item.label)}
                  className="flex items-center gap-2 text-lg font-semibold px-4 py-2 text-white hover:bg-white/20 rounded-md transition"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              </NavigationMenu.Item>
            )
          })}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  )
}