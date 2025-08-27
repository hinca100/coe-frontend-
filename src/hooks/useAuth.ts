import { useEffect, useState } from "react";
import { me } from "../api/auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Revisar token al cargar
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    me()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ login: guarda token + usuario
  const login = (accessToken: string, user: AuthUser) => {
    localStorage.setItem("accessToken", accessToken);
    setUser(user);
  };

  // ✅ logout: limpia token + usuario
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return { user, loading, login, logout };
}