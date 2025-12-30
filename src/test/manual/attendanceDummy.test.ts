import { readAttendanceToday, writeAttendanceToday, clearAttendanceToday } from "../../utils/attendanceToday"

function assert(name: string, condition: boolean) {
  const status = condition ? "PASS" : "FAIL"
  console.log(`[${status}] ${name}`)
}

clearAttendanceToday()
assert("initial today is null", readAttendanceToday() === null)

const now = new Date().toISOString()
writeAttendanceToday({
  id: Date.now(),
  userId: 1,
  date: now.slice(0, 10),
  checkIn: now,
  status: new Date(now).getHours() < 9 ? "ON_TIME" : "LATE",
  photoUrl: "data:image/png;base64,AAA",
  description: "Test",
  createdAt: now,
})
const t = readAttendanceToday()
assert("today present after write", t?.status === "ON_TIME" || t?.status === "LATE")
assert("checkIn persisted", t?.checkIn === now)
assert("photoUrl persisted", !!t?.photoUrl)
// add checkout
const checkout = new Date().toISOString()
writeAttendanceToday({ ...t!, checkOut: checkout })
const t2 = readAttendanceToday()
assert("checkout persisted", t2?.checkOut === checkout)
