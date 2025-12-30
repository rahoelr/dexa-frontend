import { listDatesInRange, computeStatus } from "../utils/attendanceCalc"
import type { AttendanceAdminRecord, Employee, AttendanceStatus } from "../types"

export type AdminFilters = {
  startDate: string
  endDate: string
  status?: "ALL" | "ON_TIME" | "LATE" | "ABSENT"
  department?: string
  search?: string
  page?: number
  pageSize?: number
}

const EMPLOYEES: Employee[] = [
  { id: "E-001", name: "Andi", nip: "10001", department: "Engineering", position: "Developer" },
  { id: "E-002", name: "Budi", nip: "10002", department: "Engineering", position: "QA" },
  { id: "E-003", name: "Citra", nip: "10003", department: "HRD", position: "HR Staff" },
  { id: "E-004", name: "Dewi", nip: "10004", department: "Finance", position: "Accountant" },
  { id: "E-005", name: "Eko", nip: "10005", department: "Operations", position: "Ops Lead" },
]

export function listDepartments() {
  const set = new Set(EMPLOYEES.map((e) => e.department))
  return Array.from(set)
}

function toAttendanceStatus(s: "PRESENT_ON_TIME" | "PRESENT_LATE" | "ABSENT"): AttendanceStatus {
  if (s === "PRESENT_ON_TIME") return "ON_TIME"
  if (s === "PRESENT_LATE") return "LATE"
  return "ABSENT"
}

function randomRecord(date: string, employee: Employee): AttendanceAdminRecord {
  const r = Math.random()
  if (r < 0.6) {
    const hour = r < 0.45 ? 8 : 9
    const minute = r < 0.5 ? Math.floor(Math.random() * 30) : Math.floor(30 + Math.random() * 60)
    const checkIn = new Date(`${date}T00:00:00`)
    checkIn.setHours(hour, minute, 0, 0)
    const { status, lateMinutes } = computeStatus(checkIn.toISOString())
    return {
      employee,
      date,
      checkIn: checkIn.toISOString(),
      status: toAttendanceStatus(status),
      lateMinutes,
      photoUrl: "data:image/png;base64,AAA",
      description: r < 0.3 ? "WFH Jakarta" : undefined,
    }
  }
  return { employee, date, status: "ABSENT" }
}

export function listAttendanceAdmin(filters: AdminFilters) {
  const { startDate, endDate, status = "ALL", department, search = "", page = 1, pageSize = 10 } = filters
  const dates = listDatesInRange(startDate, endDate)
  const byDept = department ? EMPLOYEES.filter((e) => e.department === department) : EMPLOYEES
  const bySearch = search
    ? byDept.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.nip.includes(search))
    : byDept

  const all: AttendanceAdminRecord[] = []
  for (const d of dates) {
    for (const e of bySearch) {
      all.push(randomRecord(d, e))
    }
  }

  const filtered = status === "ALL" ? all : all.filter((r) => r.status === status)

  const total = filtered.length
  const startIdx = (page - 1) * pageSize
  const data = filtered.slice(startIdx, startIdx + pageSize)
  return {
    data,
    pagination: { page, pageSize, total },
  }
}
