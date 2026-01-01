import { useEffect, useState } from "react"
import { navigate } from "../lib/navigation"
import { listEmployees, getAdminAttendance, getEmployee, getAdminAttendanceToday } from "../lib/api"
import MonitoringTable from "../components/MonitoringTable"
import Pagination from "../components/Pagination"
import PhotoModal from "../components/PhotoModal"
import CardStat from "../components/CardStat"

export default function AdminOverview() {
  const [activeCount, setActiveCount] = useState<number>(0)
  const [latest, setLatest] = useState<import("../types").AdminEmployee[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState(new Date().toISOString().slice(0, 10))
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10))
  const [filterUserId, setFilterUserId] = useState<string>("")
  const [attLoading, setAttLoading] = useState(false)
  const [attError, setAttError] = useState<string | null>(null)
  const [attRecords, setAttRecords] = useState<import("../types").AttendanceAdminRecord[]>([])
  const [attTotal, setAttTotal] = useState(0)
  const [attPage, setAttPage] = useState(1)
  const [attPageSize] = useState(10)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [todayLoading, setTodayLoading] = useState(false)
  const [todayError, setTodayError] = useState<string | null>(null)
  const [todaySummary, setTodaySummary] = useState<{ onTime: number; late: number; absent: number }>({
    onTime: 0,
    late: 0,
    absent: 0,
  })

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await listEmployees({ page: 1, limit: 5 })
        setActiveCount(res.total)
        const items = [...res.items].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setLatest(items.slice(0, 5))
      } catch (e) {
        setError("Gagal memuat ringkasan")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        setAttLoading(true)
        setAttError(null)
        const userId = filterUserId.trim() ? Number(filterUserId.trim()) : undefined
        const res = await getAdminAttendance({
          from: fromDate,
          to: toDate,
          page: attPage,
          pageSize: attPageSize,
          userId,
        })
        const items = res.items
        const uniqUserIds = Array.from(new Set(items.map((it) => it.userId)))
        const cache = new Map<number, { id: number; name: string; email: string }>()
        for (const uid of uniqUserIds) {
          try {
            const emp = await getEmployee(uid)
            cache.set(uid, { id: emp.id, name: emp.name, email: emp.email })
          } catch (e: any) {
            const status: number | undefined = e?.response?.status
            if (status === 403) {
              setAttError("Admin only")
            }
            cache.set(uid, { id: uid, name: `User ${uid}`, email: "-" })
          }
        }
        const mapped: import("../types").AttendanceAdminRecord[] = items.map((it) => {
          const emp = cache.get(it.userId)
          const employee = {
            id: String(emp?.id ?? it.userId),
            name: emp?.name ?? `User ${it.userId}`,
            nip: "-",
            department: "-",
            position: undefined,
          }
          return {
            date: it.date.slice(0, 10),
            checkIn: it.checkIn,
            checkOut: it.checkOut,
            status: it.status,
            lateMinutes: undefined,
            photoUrl: it.photoUrl,
            description: it.description,
            employee,
          }
        })
        setAttRecords(mapped)
        setAttTotal(res.total)
      } catch (e: any) {
        const status: number | undefined = e?.response?.status
        if (status === 403) {
          setAttError("Admin only")
        } else if (status === 503) {
          setAttError("Layanan tidak tersedia, coba lagi nanti")
        } else {
          setAttError("Gagal memuat riwayat absensi")
        }
      } finally {
        setAttLoading(false)
      }
    })()
  }, [fromDate, toDate, filterUserId, attPage, attPageSize])

  useEffect(() => {
    ;(async () => {
      try {
        setTodayLoading(true)
        setTodayError(null)
        const res = await getAdminAttendanceToday()
        let onTime = 0
        let late = 0
        let absent = 0
        for (const it of res.items) {
          if (it.status === "ON_TIME") onTime++
          else if (it.status === "LATE") late++
          else if (it.status === "ABSENT") absent++
        }
        setTodaySummary({ onTime, late, absent })
      } catch (e: any) {
        const status: number | undefined = e?.response?.status
        if (status === 403) {
          setTodayError("Admin only")
        } else if (status === 503) {
          setTodayError("Layanan tidak tersedia, coba lagi nanti")
        } else {
          setTodayError("Gagal memuat ringkasan hari ini")
        }
      } finally {
        setTodayLoading(false)
      }
    })()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Dashboard Admin</h1>
      <p className="text-sm text-gray-600">Ringkasan karyawan aktif dan terbaru.</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CardStat title="Hadir Tepat Waktu (Hari Ini)" value={`${todaySummary.onTime}`} />
        <CardStat title="Terlambat (Hari Ini)" value={`${todaySummary.late}`} />
        <CardStat title="Absen (Hari Ini)" value={`${todaySummary.absent}`} />
      </div>
      {todayError ? <p className="mt-2 text-sm text-red-600">{todayError}</p> : null}
      {todayLoading ? <p className="mt-2 text-sm text-gray-600">Memuat ringkasan...</p> : null}
      {error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="mt-4 text-sm text-gray-600">Memuat...</p>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-600">Jumlah Karyawan</p>
            <p className="mt-2 text-3xl font-bold">{activeCount}</p>
            <div className="mt-4">
              <button
                onClick={() => navigate("/admin/karyawan")}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Kelola Karyawan
              </button>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-600">List Karyawan</p>
            <ul className="mt-2 space-y-2">
              {latest.map((e) => (
                <li key={e.id} className="flex justify-between text-sm">
                  <span className="text-gray-800">{e.name}</span>
                  <span className="text-gray-500">{new Date(e.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
              {latest.length === 0 ? <li className="text-gray-600">Tidak ada data</li> : null}
            </ul>
          </div>
          <div className="rounded-lg border bg-white p-4 md:col-span-2">
            <div className="flex items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value)
                    setAttPage(1)
                  }}
                  className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value)
                    setAttPage(1)
                  }}
                  className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Filter User ID (opsional)</label>
                <input
                  type="number"
                  value={filterUserId}
                  onChange={(e) => {
                    setFilterUserId(e.target.value)
                    setAttPage(1)
                  }}
                  placeholder="Contoh: 2"
                  className="mt-1 block w-36 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-4">
              {attError ? (
                <p className="text-sm text-red-600" role="alert">
                  {attError}
                </p>
              ) : attLoading ? (
                <p className="text-sm text-gray-600">Memuat...</p>
              ) : attRecords.length === 0 ? (
                <p className="text-sm text-gray-700">Tidak ada absensi untuk tanggal ini.</p>
              ) : (
                <>
                  <MonitoringTable records={attRecords} onOpenPhoto={(src) => setPhotoSrc(src)} />
                  <div className="mt-3">
                    <Pagination
                      page={attPage}
                      pageSize={attPageSize}
                      total={attTotal}
                      onChange={setAttPage}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {photoSrc ? <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} /> : null}
    </div>
  )
}
