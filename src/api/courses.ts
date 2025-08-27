import api from "./axios";

// 🔹 Tipado de capítulos
export interface Chapter {
  _id: string;
  title: string;
  order: number;
  resourceType: string;
  resourceUrl: string;
  courseId?: string;
}

// 🔹 Tipado de cursos
export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string; // "draft" | "published"
  chapters: Chapter[];
  createdAt?: string;
  updatedAt?: string;
}

// 📌 Obtener cursos con filtros opcionales
export async function getCourses(filters?: { category?: string; status?: string }) {
  const { data } = await api.get<Course[]>("/courses", { params: filters });
  return data;
}

// 📌 Obtener un curso por ID
export async function getCourseById(id: string) {
  const { data } = await api.get<Course>(`/courses/${id}`);
  return data;
}

// 📌 Crear un nuevo curso
export async function createCourse(course: Omit<Course, "_id" | "chapters">) {
  const { data } = await api.post<Course>("/courses", course);
  return data;
}

// 📌 Publicar un curso
export async function publishCourse(id: string) {
  const { data } = await api.patch<Course>(`/courses/${id}/publish`);
  return data;
}