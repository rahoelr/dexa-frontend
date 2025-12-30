const API_BASE = import.meta.env.VITE_API_BASE_URL

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

export function getUsers() {
  return request<import("../types").User[]>("/users")
}

export function createUser(payload: Partial<import("../types").User>) {
  return request<import("../types").User>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
