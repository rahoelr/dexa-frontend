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

export type AttendanceToday = {
  status: "ABSENT" | "PRESENT"
  checkInTime?: string
  photoUrl?: string
}

export type AttendanceRecord = {
  date: string
  checkInTime?: string
  status: "PRESENT_ON_TIME" | "PRESENT_LATE" | "ABSENT"
  lateMinutes?: number
  photoUrl?: string
  notes?: string
}
