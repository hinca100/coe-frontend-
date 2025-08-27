import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../api/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await registerRequest(name, email, password);
      setSuccess("✅ Usuario creado con éxito, redirigiendo...");
      setTimeout(() => navigate("/login"), 2000); // redirige al login
    } catch (err: any) {
      setError("⚠️ No se pudo registrar. Intenta con otro correo.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-emerald-600">
          Registro
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}