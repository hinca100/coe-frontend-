// src/app/learner/page.tsx
"use client"

import LearnerDashboard from "./LearnerDashboard"
import Badges from "./components/Badges"

export default function LearnerPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Panel principal del aprendiz */}
      <LearnerDashboard />

      {/* Sección de insignias */}
      <Badges />
    </div>
  )
}