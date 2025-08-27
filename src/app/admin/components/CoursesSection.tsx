"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/lib/api";
import {
  Plus,
  CheckCircle,
  BookOpen,
  XCircle,
  Paperclip,
  BookMarked,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// =====================
// Helper Cloudinary
// =====================
async function uploadToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("❌ Error subiendo archivo a Cloudinary");
  return res.json(); // { secure_url, public_id, ... }
}

// =====================
// Tipos de datos
// =====================
type Resource = {
  resourceType: "pdf" | "image" | "video" | "link";
  url: string;
};

type Chapter = {
  _id: string;
  title: string;
  description?: string;
  order: number;
  resourceType?: string;
  resourceUrl?: string;
};

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  coverImage?: string;
  resources?: Resource[];
  chapters?: Chapter[];
};

// =====================
// Componente principal
// =====================
export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "Fullstack",
    coverImage: null as File | null,
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newResource, setNewResource] = useState<{ file: File | null; link: string }>({
    file: null,
    link: "",
  });
  const [newChapter, setNewChapter] = useState<{ title: string; description: string; order: number; file: File | null }>({
    title: "",
    description: "",
    order: 1,
    file: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  // =====================
  // Cargar cursos
  // =====================
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // =====================
  // Crear curso
  // =====================
  const handleCreateCourse = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      let coverImageUrl = "";

      if (newCourse.coverImage) {
        const uploadRes = await uploadToCloudinary(newCourse.coverImage);
        coverImageUrl = uploadRes.secure_url;
      }

      const res = await fetch(`${API_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newCourse.title,
          description: newCourse.description,
          category: newCourse.category,
          coverImage: coverImageUrl,
        }),
      });

      if (!res.ok) throw new Error("Error creando curso");

      toast.success("✅ Curso creado con éxito");
      setNewCourse({ title: "", description: "", category: "Fullstack", coverImage: null });
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Error al crear curso");
    }
  };

  // =====================
  // Publicar / Despublicar
  // =====================
  const handlePublish = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/courses/${id}/publish`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error publicando curso");
      toast.success("🚀 Curso publicado");
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/courses/${id}/unpublish`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error despublicando curso");
      toast.success("❌ Curso despublicado");
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // =====================
  // Agregar recurso
  // =====================
  const handleAddResource = async () => {
    if (!selectedCourse) return;
    try {
      const token = localStorage.getItem("accessToken");
      let resourceUrl = newResource.link;
      let resourceType: "image" | "pdf" | "video" | "link" = "link";
  
      // 1️⃣ Si hay archivo, primero súbelo a Cloudinary
      if (newResource.file) {
        const formData = new FormData();
        formData.append("file", newResource.file);
        formData.append("upload_preset", "coe-backend"); // 👈 tu preset
  
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/dmbzgusff/auto/upload`,
          { method: "POST", body: formData }
        );
  
        if (!uploadRes.ok) throw new Error("Error subiendo archivo a Cloudinary");
        const uploadData = await uploadRes.json();
        resourceUrl = uploadData.secure_url;
  
        // Detectamos tipo según MIME
        const mime = newResource.file.type;
        if (mime.startsWith("image")) resourceType = "image";
        else if (mime.startsWith("video")) resourceType = "video";
        else if (mime.includes("pdf")) resourceType = "pdf";
        else resourceType = "link";
      }
  
      // 2️⃣ Enviar al backend
      const res = await fetch(`${API_URL}/courses/${selectedCourse._id}/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resourceType,
          url: resourceUrl,
        }),
      });
  
      if (!res.ok) throw new Error("Error guardando recurso en backend");
      const data = await res.json();
  
      toast.success("📎 Recurso agregado con éxito");
      setSelectedCourse({
        ...selectedCourse,
        resources: [...(selectedCourse.resources || []), data.resource],
      });
      setNewResource({ file: null, link: "" });
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Error al subir recurso");
    }
  };

  // =====================
  // Agregar capítulo
  // =====================
  const handleAddChapter = async () => {
    if (!selectedCourse) return;
    try {
      const token = localStorage.getItem("accessToken");
      let resourceUrl: string | null = null;
      let resourceType: "image" | "pdf" | "video" | "link" = "link";
  
      // 1️⃣ Subir archivo a Cloudinary si viene
      if (newChapter.file) {
        const formData = new FormData();
        formData.append("file", newChapter.file);
        formData.append("upload_preset", "coe-backend");
  
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/dmbzgusff/auto/upload`,
          { method: "POST", body: formData }
        );
  
        if (!uploadRes.ok) throw new Error("Error subiendo capítulo a Cloudinary");
        const uploadData = await uploadRes.json();
        resourceUrl = uploadData.secure_url;
  
        // Detectamos tipo
        const mime = newChapter.file.type;
        if (mime.startsWith("image")) resourceType = "image";
        else if (mime.startsWith("video")) resourceType = "video";
        else if (mime.includes("pdf")) resourceType = "pdf";
        else resourceType = "link";
      }
  
      // 2️⃣ Mandar capítulo al backend
      const res = await fetch(`${API_URL}/courses/${selectedCourse._id}/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newChapter.title,
          description: newChapter.description,
          order: newChapter.order,
          resourceType,
          resourceUrl,
        }),
      });
  
      if (!res.ok) throw new Error("Error guardando capítulo en backend");
      const data = await res.json();
  
      toast.success("📘 Capítulo agregado");
      setSelectedCourse({
        ...selectedCourse,
        chapters: [...(selectedCourse.chapters || []), data],
      });
      setNewChapter({ title: "", description: "", order: 1, file: null });
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Error al crear capítulo");
    }
  };

  // =====================
  // Eliminar curso
  // =====================
  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/courses/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando curso");
      toast.success(`🗑 Curso "${deleteTarget.title}" eliminado`);
      setDeleteTarget(null);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Error al eliminar curso");
    }
  };

  // =====================
  // UI
  // =====================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* ===================== Header ===================== */}
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <BookOpen className="h-7 w-7 text-indigo-500" /> Cursos
        </h2>

        {/* Crear curso */}
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
              <Plus className="mr-2 h-4 w-4" /> Nuevo curso
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-[50%] left-[50%] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Crear curso
              </Dialog.Title>

              <div className="space-y-4">
                <Input
                  placeholder="Título"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                />
                <Input
                  placeholder="Descripción"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                >
                  <option value="Fullstack">Fullstack</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud">Cloud</option>
                </select>

                {/* Input de archivo con estilo */}
                <div className="space-y-2">
                  <label
                    htmlFor="courseFile"
                    className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
                  >
                    Seleccionar portada
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {newCourse.coverImage ? newCourse.coverImage.name : "Ningún archivo seleccionado"}
                  </span>
                  <input
                    id="courseFile"
                    type="file"
                    accept="image/*,application/pdf,video/*"
                    className="hidden"
                    onChange={(e) => setNewCourse({ ...newCourse, coverImage: e.target.files?.[0] || null })}
                  />
                </div>

                <Button className="bg-green-600 hover:bg-green-700 w-full" onClick={handleCreateCourse}>
                  Crear curso
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* ===================== Tabla ===================== */}
      <div className="overflow-x-auto rounded-xl shadow-xl bg-white/70 dark:bg-gray-800/70">
        <table className="min-w-full border border-gray-200 dark:border-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Título</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t">
                <td className="px-4 py-2">{course.title}</td>
                <td className="px-4 py-2">{course.category}</td>
                <td className="px-4 py-2">
                  {course.status === "published" ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Publicado
                    </span>
                  ) : (
                    <span className="text-gray-500">Borrador</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  {/* Publicar / Despublicar */}
                  {course.status !== "published" ? (
                    <Button size="sm" onClick={() => handlePublish(course._id)} className="bg-purple-600">
                      Publicar
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleUnpublish(course._id)} className="bg-red-600">
                      <XCircle className="h-4 w-4" /> Despublicar
                    </Button>
                  )}

                  {/* Recursos */}
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <Button size="sm" className="bg-indigo-500" onClick={() => setSelectedCourse(course)}>
                        <Paperclip className="h-4 w-4" /> Recursos
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                      <Dialog.Content className="fixed top-[50%] left-[50%] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
                        <Dialog.Title className="text-lg font-semibold mb-4">Recursos de {selectedCourse?.title}</Dialog.Title>

                        <ul className="mb-4 space-y-2">
                          {selectedCourse?.resources?.map((r, idx) => (
                            <li key={idx} className="text-sm flex items-center gap-2">
                              {r.resourceType === "pdf" && "📄"}
                              {r.resourceType === "video" && "🎬"}
                              {r.resourceType === "image" && "🖼️"}
                              {r.resourceType === "link" && "🔗"}
                              <a href={r.url} target="_blank" className="text-blue-600 hover:underline">
                                {r.url}
                              </a>
                            </li>
                          ))}
                        </ul>

                        {/* Input de archivo con estilo */}
                        <div className="space-y-2 mb-3">
                          <label
                            htmlFor="resourceFile"
                            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
                          >
                            Seleccionar archivo
                          </label>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {newResource.file ? newResource.file.name : "Ningún archivo seleccionado"}
                          </span>
                          <input
                            id="resourceFile"
                            type="file"
                            accept="image/*,application/pdf,video/*"
                            className="hidden"
                            onChange={(e) => setNewResource({ file: e.target.files?.[0] || null, link: "" })}
                          />
                        </div>

                        <Input
                          placeholder="O pega un link aquí"
                          value={newResource.link}
                          onChange={(e) => setNewResource({ file: null, link: e.target.value })}
                        />
                        <Button className="bg-green-600 w-full mt-3" onClick={handleAddResource}>
                          Agregar recurso
                        </Button>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>

                  {/* Capítulos */}
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <Button size="sm" className="bg-blue-500" onClick={() => setSelectedCourse(course)}>
                        <BookMarked className="h-4 w-4" /> Capítulos
                      </Button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                      <Dialog.Content className="fixed top-[50%] left-[50%] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
                        <Dialog.Title className="text-lg font-semibold mb-4">Capítulos de {selectedCourse?.title}</Dialog.Title>

                        <ul className="mb-4 space-y-2">
                          {selectedCourse?.chapters?.map((c, idx) => (
                            <li key={idx} className="text-sm">
                              #{c.order} - <b>{c.title}</b> ({c.resourceType || "sin recurso"})
                            </li>
                          ))}
                        </ul>

                        {/* Inputs para nuevo capítulo */}
                        <div className="space-y-3">
                          <Input
                            placeholder="Título del capítulo"
                            value={newChapter.title}
                            onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                          />
                          <Input
                            placeholder="Descripción"
                            value={newChapter.description}
                            onChange={(e) => setNewChapter({ ...newChapter, description: e.target.value })}
                          />
                          <Input
                            type="number"
                            placeholder="Orden"
                            value={newChapter.order}
                            onChange={(e) => setNewChapter({ ...newChapter, order: Number(e.target.value) })}
                          />

                          {/* Input de archivo con estilo */}
                          <div className="space-y-2">
                            <label
                              htmlFor="chapterFile"
                              className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700 transition"
                            >
                              Seleccionar archivo
                            </label>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {newChapter.file ? newChapter.file.name : "Ningún archivo seleccionado"}
                            </span>
                            <input
                              id="chapterFile"
                              type="file"
                              accept="image/*,application/pdf,video/*"
                              className="hidden"
                              onChange={(e) => setNewChapter({ ...newChapter, file: e.target.files?.[0] || null })}
                            />
                          </div>

                          <Button
                            className="bg-green-600 w-full"
                            onClick={handleAddChapter}
                            disabled={!newChapter.title || !newChapter.description || !newChapter.order || !newChapter.file}
                          >
                            Agregar capítulo
                          </Button>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>

                  {/* Eliminar con confirmación */}
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <Button size="sm" className="bg-gray-700 hover:bg-gray-800" onClick={() => setDeleteTarget(course)}>
                        <Trash2 className="h-4 w-4" /> Eliminar
                      </Button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />
                      <AlertDialog.Content className="fixed top-[50%] left-[50%] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl">
                        <AlertDialog.Title className="text-lg font-bold">¿Eliminar curso?</AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          Esta acción no se puede deshacer. El curso <b>{deleteTarget?.title}</b> será eliminado permanentemente.
                        </AlertDialog.Description>
                        <div className="mt-4 flex justify-end gap-3">
                          <AlertDialog.Cancel asChild>
                            <Button variant="outline">Cancelar</Button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <Button className="bg-red-600 hover:bg-red-700" onClick={handleDeleteCourse}>
                              Eliminar
                            </Button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}