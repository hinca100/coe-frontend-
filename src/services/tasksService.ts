export const fetchTasks = async () => {
  try {
    const token = localStorage.getItem("accessToken")
    const res = await fetch("http://localhost:8080/v1/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error("Error al obtener las tareas");
    }

    const data = await res.json();
    return data.tasks;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export type CreateTaskPayload = {
  title: string
  description: string
  priority: "low" | "medium" | "high"
  assignee: string
  deliveryDate: string
  dueDate: string
  sprint: string
  status: "todo" | "inProgress" | "done"
}

export async function createTask(task: CreateTaskPayload) {
  const token = localStorage.getItem("accessToken")
  const res = await fetch("http://localhost:8080/v1/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  })

  if (res.status === 403) {
    throw { status: 403, message: "No tienes permisos para crear tareas" };
  }
  if (!res.ok) {
    throw { status: res.status, message: "Error creando la tarea" };
  }

  return res.json()
}

