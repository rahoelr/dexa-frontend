import { readToday, writeToday, clearToday } from "../../utils/attendanceLocal"

function assert(name: string, condition: boolean) {
  const status = condition ? "PASS" : "FAIL"
  console.log(`[${status}] ${name}`)
}

clearToday()
assert("initial today is null", readToday() === null)

const now = new Date().toISOString()
writeToday({ status: "PRESENT", checkInTime: now, photoUrl: "data:image/png;base64,AAA" })
const t = readToday()
assert("today present after write", t?.status === "PRESENT")
assert("checkInTime persisted", t?.checkInTime === now)
assert("photoUrl persisted", !!t?.photoUrl)

