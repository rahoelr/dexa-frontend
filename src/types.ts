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
  checkOutTime?: string
  status: "PRESENT_ON_TIME" | "PRESENT_LATE" | "ABSENT"
  lateMinutes?: number
  photoUrl?: string
  notes?: string
}

export type Employee = {
  id: string
  name: string
  nip: string
  department: string
  position?: string
}

export type AttendanceAdminRecord = {
  date: string
  checkIn?: string
  checkOut?: string
  status: AttendanceStatus
  lateMinutes?: number
  photoUrl?: string
  description?: string
  employee: Employee
}

export type AttendanceSummary = {
  presentOnTime: number
  presentLate: number
  absent: number
}

export type AttendanceStatus = "ON_TIME" | "LATE" | "ABSENT"

export type Attendance = {
  id: number
  userId: number
  date: string
  checkIn?: string
  checkOut?: string
  photoUrl?: string
  status: AttendanceStatus
  description?: string
  createdAt?: string
}
