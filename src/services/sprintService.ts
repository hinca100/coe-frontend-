export async function fetchSprints() {
  const token = localStorage.getItem("accessToken")
  const res = await fetch("http://localhost:8080/v1/sprints", {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Error obteniendo sprints")
  return res.json()
}
