import type { Metadata } from "next"
import { Inter, Roboto_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
})

export const metadata: Metadata = {
  title: "Mentora Platform",
  description: "Plataforma de cursos CoE",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      {/* 👇 el flag va aquí */}
      <body className="antialiased" suppressHydrationWarning>
        <div
          className={`${inter.variable} ${robotoMono.variable} min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800`}
        >
          {children}
        </div>
      </body>
    </html>
  )
}