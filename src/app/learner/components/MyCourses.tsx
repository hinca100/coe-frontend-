"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import { BookMarked, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Course = {
  _id: string;
  title: string;
  description: string;
  category: string;
  coverImage?: string;
};

type Enrollment = {
  _id: string;
  courseId?: Course;
};

export default function MyCourses() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/enrollments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      console.error("Error cargando mis cursos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/70 
                      border border-white/30 dark:border-gray-700/30 
                      rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <BookMarked className="h-6 w-6 text-indigo-600" /> Mis cursos
        </h2>

        {enrollments.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No estás inscrito en ningún curso aún. Explora y elige uno 🚀
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => {
              const course: Course = enrollment.courseId || (enrollment as any);
              if (!course) return null;

              return (
                <div
                  key={enrollment._id || course._id}
                  className="p-4 rounded-xl shadow-md bg-white/80 dark:bg-gray-800/70 
                             backdrop-blur-sm hover:shadow-lg transition"
                >
                  <img
                    src={
                      course.coverImage
                        ? course.coverImage
                        : `https://picsum.photos/seed/${encodeURIComponent(
                            course.title || "curso"
                          )}/600/400`
                    }
                    alt={course.title}
                    className="h-32 w-full object-cover rounded-md mb-3"
                  />

                  <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {course.description}
                  </p>

                  <span className="inline-block text-xs px-2 py-1 rounded-full 
                                   bg-indigo-100 text-indigo-700 
                                   dark:bg-indigo-700/40 dark:text-indigo-300 mb-2">
                    {course.category}
                  </span>

                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => router.push(`/learner/courses/${course._id}`)}
                  >
                    Ir al curso
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}