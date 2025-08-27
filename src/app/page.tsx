import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 🎨 Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 dark:opacity-10"></div>
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"></div>

      {/* Contenido */}
      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Mentora Platform</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  Registrarse
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl font-extrabold text-white drop-shadow mb-4">
            Aprende, crece y gana insignias digitales 🏅
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mb-6">
            Mentora Platform es el espacio donde los colaboradores del CoE pueden acceder a{" "}
            <span className="font-semibold text-yellow-300">capacitaciones técnicas</span>, 
            seguir su progreso en tiempo real y obtener{" "}
            <span className="font-semibold text-yellow-300">insignias</span> por cada curso completado.  
            ¡Centraliza tu aprendizaje y destaca tus logros!
          </p>
          <div className="flex gap-4">
            <Link href="/auth/register">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 text-lg">
                ¡Empieza ahora!
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 text-lg">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-gray-300 py-6 text-sm">
          © {new Date().getFullYear()} Mentora Platform · Plataforma de capacitaciones del CoE
        </footer>
      </div>
    </div>
  );
}