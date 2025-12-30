import { listDatesInRange, toRecord } from "../utils/attendanceCalc"
import { readAttendanceToday } from "../utils/attendanceToday"
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

  const todayModel = readAttendanceToday()
  const today = todayModel
    ? {
        ...toRecord(new Date().toISOString().slice(0, 10), todayModel.checkIn, todayModel.photoUrl, todayModel.description),
        checkOutTime: todayModel.checkOut,
      }
    : null

  const records: AttendanceRecord[] = dates.map((d) => {
    if (today && today.date === d) return today
    return toRecord(d) // ABSENT
  })

  const filtered = status === "ALL" ? records : records.filter((r) => r.status === status)

  const total = filtered.length
  const startIdx = (page - 1) * pageSize
  const pageItems = filtered.slice(startIdx, startIdx + pageSize)
  return {
    data: pageItems,
    pagination: { page, pageSize, total },
  }
}
