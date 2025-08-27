import api from "./axios";

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}