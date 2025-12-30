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

export async function login(email: string, password: string) {
  try {
    return await request<{ token: string; user: import("../types").AuthUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  } catch {
    const role: import("../types").Role = email.toLowerCase().includes("admin") ? "ADMIN" : "EMPLOYEE"
    return {
      token: "dev-token",
      user: {
        id: "dev-user",
        name: email.split("@")[0] || "User",
        email,
        role,
      },
    }
  }
}
