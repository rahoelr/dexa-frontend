import type { AttendanceToday } from "../types"

function keyForToday() {
  const d = new Date()
  const day = d.toISOString().slice(0, 10)
  return `attendance:today:${day}`
}

export function readToday(): AttendanceToday | null {
  try {
    const raw = localStorage.getItem(keyForToday())
    if (!raw) return null
    return JSON.parse(raw) as AttendanceToday
  } catch {
    return null
  }
}

export function writeToday(data: AttendanceToday) {
  localStorage.setItem(keyForToday(), JSON.stringify(data))
}

export function clearToday() {
  localStorage.removeItem(keyForToday())
}

