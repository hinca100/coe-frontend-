import { useEffect, useState } from "react";
import { getMyProgress } from "../../api/progress";
import type { Progress } from "../../api/progress";
import { getMyBadges } from "../../api/badges";
import type { Badge } from "../../api/badges";

export default function Profile() {
  const [progress, setProgress] = useState<Progress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProgress(), getMyBadges()])
      .then(([p, b]) => {
        setProgress(p);
        setBadges(b);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Mi Perfil
      </h1>

      {/* Progreso */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">📊 Progreso en cursos</h2>
        {progress.length === 0 ? (
          <p className="text-gray-500">Aún no has completado capítulos.</p>
        ) : (
          <ul className="space-y-3">
            {progress.map((p) => (
              <li
                key={p._id}
                className="p-4 bg-white rounded-xl shadow border border-gray-200"
              >
                <p className="font-medium text-gray-800">
                  {p.courseId.title} → {p.chapterId.title}
                </p>
                <p className="text-sm text-gray-500">
                  Completado: {new Date(p.completedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Insignias */}
      <section>
        <h2 className="text-xl font-semibold mb-3">🏅 Mis Insignias</h2>
        {badges.length === 0 ? (
          <p className="text-gray-500">Aún no has ganado insignias.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {badges.map((b) => (
              <div
                key={b._id}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow border border-gray-200 w-32"
              >
                <img src={b.icon} alt={b.name} className="w-12 h-12 mb-2" />
                <p className="text-sm font-medium text-center">{b.name}</p>
                <p className="text-xs text-gray-500">{b.courseId.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}