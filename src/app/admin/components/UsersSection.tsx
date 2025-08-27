"use client"

import { useEffect, useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Shield, Mail, UserCircle2, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import { API_URL } from "@/lib/api"

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  instructor: "Instructor",
  learner: "Aprendiz",
}
const roleValues: Record<string, string> = {
  Administrador: "admin",
  Instructor: "instructor",
  Aprendiz: "learner",
}

type User = {
  _id: string
  name: string
  email: string
  role: "admin" | "instructor" | "learner"
}

export default function UsersSection() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" })
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // 🔹 Cargar usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch("https://coe-backend-l1tt.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 🔹 Crear usuario
  const handleCreateUser = async () => {
    try {
      const res = await fetch("https://coe-backend-l1tt.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!res.ok) throw new Error("Error creando usuario")
      toast.success("✅ Usuario creado con éxito")
      setNewUser({ name: "", email: "", password: "" })
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // 🔹 Editar usuario completo
  const handleEditUser = async () => {
    if (!editUser) return
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(
        `${API_URL}/users/${editUser._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: editUser.name,
            email: editUser.email,
            role: editUser.role,
          }),
        }
      )
      if (!res.ok) throw new Error("Error editando usuario")
      toast.success("✏️ Usuario actualizado")
      setEditUser(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // 🔹 Eliminar usuario
  const handleDeleteUser = async () => {
    if (!deleteTarget) return
    try {
      const token = localStorage.getItem("accessToken")
      const res = await fetch(
        `${API_URL}/users/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!res.ok) throw new Error("Error eliminando usuario")
      toast.success(`🗑 Usuario "${deleteTarget.name}" eliminado`)
      setDeleteTarget(null)
      fetchUsers()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  // 🔹 Filtrar usuarios
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p className="text-center py-10">Cargando usuarios...</p>

  return (
    <div>
      {/* =====================
          Header
      ===================== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserCircle2 className="h-6 w-6 text-blue-600" /> Usuarios
        </h2>

        {/* Botón crear usuario */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" /> Nuevo usuario
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed top-[50%] left-[50%] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
              <Dialog.Title className="text-xl font-semibold mb-4">Crear usuario</Dialog.Title>
              <div className="space-y-4">
                <Input placeholder="Nombre" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <Input type="password" placeholder="Contraseña" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                <Button className="bg-green-600 hover:bg-green-700 w-full" onClick={handleCreateUser}>
                  Crear usuario
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* =====================
          Tabla
      ===================== */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{roleLabels[user.role]}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  {/* Botón Editar */}
                  <Button size="sm" variant="outline" onClick={() => setEditUser(user)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  {/* Botón Eliminar */}
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setDeleteTarget(user)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =====================
          Modal Editar Usuario
      ===================== */}
      <Dialog.Root open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-[50%] left-[50%] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">Editar usuario</Dialog.Title>
            <Input className="mb-2" placeholder="Nombre" value={editUser?.name || ""} onChange={(e) => setEditUser((prev) => prev ? { ...prev, name: e.target.value } : null)} />
            <Input className="mb-2" placeholder="Email" value={editUser?.email || ""} onChange={(e) => setEditUser((prev) => prev ? { ...prev, email: e.target.value } : null)} />
            <select className="w-full border rounded px-3 py-2 mb-4" value={editUser?.role || "learner"} onChange={(e) => setEditUser((prev) => prev ? { ...prev, role: e.target.value as any } : null)}>
              <option value="admin">Administrador</option>
              <option value="instructor">Instructor</option>
              <option value="learner">Aprendiz</option>
            </select>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={handleEditUser}>
              Guardar cambios
            </Button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* =====================
          Modal Eliminar
      ===================== */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          <Dialog.Content className="fixed top-[50%] left-[50%] w-[350px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg text-center">
            <Dialog.Title className="text-lg font-semibold mb-4">Eliminar usuario</Dialog.Title>
            <p className="mb-4">¿Seguro que deseas eliminar a <b>{deleteTarget?.name}</b>?</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteUser}>Eliminar</Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}