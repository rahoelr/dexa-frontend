import type { Attendance } from "../types"

function keyForToday() {
  const d = new Date()
  const day = d.toISOString().slice(0, 10)
  return `attendance:model:${day}`
}

export function readAttendanceToday(): Attendance | null {
  try {
    const raw = localStorage.getItem(keyForToday())
    if (!raw) return null
    return JSON.parse(raw) as Attendance
  } catch {
    return null
  }
}

export function writeAttendanceToday(data: Attendance) {
  localStorage.setItem(keyForToday(), JSON.stringify(data))
}

export function clearAttendanceToday() {
  localStorage.removeItem(keyForToday())
}

