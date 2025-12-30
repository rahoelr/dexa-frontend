export type User = {
  id: string
  name: string
}

export type Role = "EMPLOYEE" | "ADMIN"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
}
