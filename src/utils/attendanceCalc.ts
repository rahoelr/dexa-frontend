import type { AttendanceRecord } from "../types"

function toLocalDateString(date: Date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function computeStatus(checkInIso?: string, thresholdHour = 9) {
  if (!checkInIso) {
    return { status: "ABSENT" as const, lateMinutes: undefined }
  }
  const d = new Date(checkInIso)
  const local = new Date(d)
  const threshold = new Date(local)
  threshold.setHours(thresholdHour, 0, 0, 0)
  if (local <= threshold) {
    return { status: "PRESENT_ON_TIME" as const, lateMinutes: 0 }
  }
  const diffMs = local.getTime() - threshold.getTime()
  const lateMinutes = Math.ceil(diffMs / 60000)
  return { status: "PRESENT_LATE" as const, lateMinutes }
}

export function listDatesInRange(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const dates: string[] = []
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(toLocalDateString(d))
  }
  return dates
}

export function toRecord(date: string, checkInIso?: string, photoUrl?: string, notes?: string): AttendanceRecord {
  const { status, lateMinutes } = computeStatus(checkInIso)
  return { date, checkInTime: checkInIso, status, lateMinutes, photoUrl, notes }
}

