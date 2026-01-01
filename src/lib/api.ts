import http from "./http"

export function getUsers() {
  return http.get<import("../types").User[]>("/users").then((r) => r.data)
}

export function createUser(payload: Partial<import("../types").User>) {
  return http.post<import("../types").User>("/users", payload).then((r) => r.data)
}

export async function login(email: string, password: string) {
  const { data } = await http.post<{ access_token: string }>("/auth/login", { email, password })
  const token = data.access_token
  const me = await http.get<{ sub?: number; email?: string; role?: import("../types").Role }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
  const emailAddr = me.data.email || email
  const name = emailAddr.split("@")[0] || "User"
  const user: import("../types").AuthUser = {
    id: String(me.data.sub ?? "unknown"),
    name,
    email: emailAddr,
    role: me.data.role ?? "EMPLOYEE",
  }
  return { token, user }
}

export async function getMe() {
  const { data } = await http.get<{ sub?: number; email?: string; role?: import("../types").Role }>("/auth/me")
  const emailAddr = data.email || ""
  const name = emailAddr ? emailAddr.split("@")[0] : "User"
  const user: import("../types").AuthUser = {
    id: String(data.sub ?? "unknown"),
    name,
    email: emailAddr,
    role: data.role ?? "EMPLOYEE",
  }
  return user
}

export async function getMyAttendance(params: {
  from: string
  to: string
  page?: number
  pageSize?: number
}) {
  const { from, to, page = 1, pageSize = 20 } = params
  const { data } = await http.get<{
    items: import("../types").Attendance[]
    page: number
    pageSize: number
    total: number
  }>("/attendance/me", {
    params: { from, to, page, pageSize },
  })
  return data
}

export async function checkIn(payload: { photo?: File | Blob; description?: string }) {
  if (payload.photo) {
    const form = new FormData()
    form.append("file", payload.photo)
    form.append("description", payload.description || "")
    try {
      const meta =
        payload.photo instanceof File
          ? { name: payload.photo.name, type: payload.photo.type, size: payload.photo.size }
          : { type: (payload.photo as any)?.type || "unknown", size: (payload.photo as any)?.size || 0 }
      console.log(
        JSON.stringify({
          tag: "frontend-check-in-formdata",
          descriptionLen: (payload.description || "").length,
          file: meta,
        })
      )
    } catch {}
    const { data } = await http.post<import("../types").Attendance>("/attendance/check-in", form)
    return data
  }
  const { data } = await http.post<import("../types").Attendance>("/attendance/check-in", {
    description: payload.description || undefined,
  })
  return data
}

export async function checkOut(payload: { description?: string }) {
  const { data } = await http.post<import("../types").Attendance>("/attendance/check-out", payload)
  return data
}

export async function getAdminAttendance(params: {
  from: string
  to: string
  page?: number
  pageSize?: number
  userId?: number
}) {
  const { from, to, page = 1, pageSize = 20, userId } = params
  const { data } = await http.get<{
    items: import("../types").Attendance[]
    page: number
    pageSize: number
    total: number
  }>("/admin/attendance", {
    params: { from, to, page, pageSize, userId },
  })
  return data
}

export async function getAdminAttendanceToday() {
  const { data } = await http.get<{
    items: import("../types").Attendance[]
    page: number
    pageSize: number
    total: number
  }>("/admin/attendance/today")
  return data
}

export async function listEmployees(params: { search?: string; page?: number; limit?: number }) {
  const { search = "", page = 1, limit = 10 } = params || {}
  const { data } = await http.get<import("../types").EmployeesList>("/employees", {
    params: { search, page, limit },
  })
  return data
}

export async function getEmployee(id: number) {
  const { data } = await http.get<import("../types").AdminEmployee>(`/employees/${id}`)
  return data
}

export async function createEmployee(payload: {
  name: string
  email: string
  password: string
  isActive?: boolean
}) {
  const { data } = await http.post<import("../types").AdminEmployee>("/employees", payload)
  return data
}

export async function updateEmployee(
  id: number,
  payload: { name?: string; email?: string; password?: string; isActive?: boolean }
) {
  const { data } = await http.put<import("../types").AdminEmployee>(`/employees/${id}`, payload)
  return data
}

export async function deleteEmployee(id: number, opts?: { hard?: boolean }) {
  const hard = opts?.hard ? "true" : undefined
  if (hard) {
    const { data } = await http.delete<{ success: boolean }>(`/employees/${id}`, { params: { hard } })
    return data
  }
  const { data } = await http.delete<import("../types").AdminEmployee>(`/employees/${id}`)
  return data
}
