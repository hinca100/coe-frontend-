export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export async function createUser(payload: RegisterPayload) {
  const response = await fetch("http://localhost:8080/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Error al registrar usuario")
  }

  return await response.json()
}

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("accessToken")
    const res = await fetch("http://localhost:8080/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {revalidate: 0},
    })

    if (!res.ok) {
      throw new Error("Error al obtener los usuarios")
    }

    const data = await res.json()
    return data.users || []
  } catch (error) {
    console.error(error)
    return []
  }
}


