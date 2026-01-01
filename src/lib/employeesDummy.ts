import type { Employee } from "../types"

export type EmployeeFilters = {
  department?: string
  search?: string
  page?: number
  pageSize?: number
}

let EMPLOYEES: Employee[] = [
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

export function listEmployees(filters: EmployeeFilters) {
  const { department, search = "", page = 1, pageSize = 10 } = filters
  const byDept = department ? EMPLOYEES.filter((e) => e.department === department) : EMPLOYEES
  const bySearch = search
    ? byDept.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.nip.includes(search))
    : byDept
  const total = bySearch.length
  const startIdx = (page - 1) * pageSize
  const data = bySearch.slice(startIdx, startIdx + pageSize)
  return {
    data,
    pagination: { page, pageSize, total },
  }
}

function nextId() {
  const max = EMPLOYEES.reduce((m, e) => {
    const n = Number(e.id.replace("E-", "")) || 0
    return Math.max(m, n)
  }, 0)
  const next = (max + 1).toString().padStart(3, "0")
  return `E-${next}`
}

export function createEmployee(payload: { name: string; nip: string; department: string; position?: string }) {
  if (!payload.name || !payload.nip || !payload.department) throw new Error("Nama, NIP, dan Departemen wajib")
  if (EMPLOYEES.some((e) => e.nip === payload.nip)) throw new Error("NIP sudah terdaftar")
  const emp: Employee = { id: nextId(), ...payload }
  EMPLOYEES = [emp, ...EMPLOYEES]
  return emp
}

export function updateEmployee(id: string, payload: Partial<Omit<Employee, "id">>) {
  const idx = EMPLOYEES.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error("Karyawan tidak ditemukan")
  const exists = EMPLOYEES[idx]
  // Validasi NIP unik jika diubah
  if (payload.nip && payload.nip !== exists.nip && EMPLOYEES.some((e) => e.nip === payload.nip)) {
    throw new Error("NIP sudah terdaftar")
  }
  const updated: Employee = { ...exists, ...payload }
  EMPLOYEES = [...EMPLOYEES.slice(0, idx), updated, ...EMPLOYEES.slice(idx + 1)]
  return updated
}

export function deleteEmployee(id: string) {
  const idx = EMPLOYEES.findIndex((e) => e.id === id)
  if (idx === -1) throw new Error("Karyawan tidak ditemukan")
  EMPLOYEES = [...EMPLOYEES.slice(0, idx), ...EMPLOYEES.slice(idx + 1)]
}

