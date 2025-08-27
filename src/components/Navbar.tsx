import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition">
        CoE Platform
      </Link>
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400 transition">
          Cursos
        </Link>
        <Link to="/login" className="hover:text-blue-400 transition">
          Login
        </Link>
        <Link to="/register" className="hover:text-blue-400 transition">
          Registro
        </Link>
        <Link to="/profile" className="hover:text-blue-400 transition">
          Perfil
        </Link>
      </div>
    </nav>
  );
}