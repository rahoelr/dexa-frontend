import { listDatesInRange, toRecord } from "../utils/attendanceCalc"
import { readToday } from "../utils/attendanceLocal"
import type { AttendanceRecord } from "../types"

export type ListAttendanceFilters = {
  startDate: string
  endDate: string
  status?: "ALL" | "PRESENT_ON_TIME" | "PRESENT_LATE" | "ABSENT"
  page?: number
  pageSize?: number
}

export function listAttendanceDummy(filters: ListAttendanceFilters) {
  const { startDate, endDate, status = "ALL", page = 1, pageSize = 10 } = filters
  const dates = listDatesInRange(startDate, endDate)

  const todayData = readToday()
  const today = todayData
    ? toRecord(new Date().toISOString().slice(0, 10), todayData.checkInTime, todayData.photoUrl)
    : null

  const records: AttendanceRecord[] = dates.map((d) => {
    if (today && today.date === d) return today
    return toRecord(d) // ABSENT
  })

  const filtered =
    status === "ALL" ? records : records.filter((r) => r.status === status || (status === "PRESENT" && r.status.startsWith("PRESENT")))

  const total = filtered.length
  const startIdx = (page - 1) * pageSize
  const pageItems = filtered.slice(startIdx, startIdx + pageSize)
  return {
    data: pageItems,
    pagination: { page, pageSize, total },
  }
}

