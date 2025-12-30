import type { AttendanceAdminRecord, AttendanceSummary } from "../types"

export function summarize(records: AttendanceAdminRecord[]): AttendanceSummary {
  let presentOnTime = 0
  let presentLate = 0
  let absent = 0
  for (const r of records) {
    if (r.status === "ON_TIME") presentOnTime++
    else if (r.status === "LATE") presentLate++
    else absent++
  }
  return { presentOnTime, presentLate, absent }
}
