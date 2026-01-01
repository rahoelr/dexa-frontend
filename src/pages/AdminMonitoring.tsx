import { useEffect, useState } from "react"
import DateRangePicker from "../components/DateRangePicker"
import StatusFilter, { StatusFilterValue } from "../components/StatusFilter"
import MonitoringTable from "../components/MonitoringTable"
import Pagination from "../components/Pagination"
import PhotoModal from "../components/PhotoModal"
import CardStat from "../components/CardStat"
import { getAdminAttendance, getEmployee } from "../lib/api"
import { summarize } from "../utils/adminSummary"
import type { AttendanceAdminRecord } from "../types"
import BackButton from "../components/BackButton"

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminMonitoring() {
  const [startDate, setStartDate] = useState(todayStr())
  const [endDate, setEndDate] = useState(todayStr())
  const [status, setStatus] = useState<StatusFilterValue>("ALL")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<AttendanceAdminRecord[]>([])
  const [total, setTotal] = useState(0)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)

  function refetch() {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getAdminAttendance({
          from: startDate,
          to: endDate,
          page,
          pageSize,
        })
        const items = res.items
        const uniqUserIds = Array.from(new Set(items.map((it) => it.userId)))
        const cache = new Map<number, { id: number; name: string; email: string }>()
        for (const uid of uniqUserIds) {
          try {
            const emp = await getEmployee(uid)
            cache.set(uid, { id: emp.id, name: emp.name, email: emp.email })
          } catch {
            cache.set(uid, { id: uid, name: `User ${uid}`, email: "-" })
          }
        }
        const mapped: AttendanceAdminRecord[] = items
          .filter((it) => {
            if (status === "ALL") return true
            if (status === "PRESENT_ON_TIME") return it.status === "ON_TIME"
            if (status === "PRESENT_LATE") return it.status === "LATE"
            return it.status === "ABSENT"
          })
          .map((it) => {
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
        setRecords(mapped)
        setTotal(res.total)
      } catch {
        setError("Gagal memuat data monitoring")
      } finally {
        setLoading(false)
      }
    })()
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, status, page])

  const summary = summarize(records)

  return (
    <div className="p-6">
      <header>
        <div className="flex items-center justify-between">
          <BackButton />
          <h1 className="text-xl font-semibold">Monitoring Absensi Karyawan</h1>
        </div>
        <p className="text-sm text-gray-600">Pantau kehadiran berdasarkan tanggal dan status.</p>
      </header>
      <main className="mt-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => {
              setStartDate(s)
              setEndDate(e)
              setPage(1)
            }}
          />
          <StatusFilter
            value={status}
            onChange={(v) => {
              setStatus(v)
              setPage(1)
            }}
          />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardStat title="Hadir Tepat Waktu" value={`${summary.presentOnTime}`} />
          <CardStat title="Terlambat" value={`${summary.presentLate}`} />
          <CardStat title="Absen" value={`${summary.absent}`} />
        </section>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : loading ? (
          <p className="text-sm text-gray-600">Memuat...</p>
        ) : records.length === 0 ? (
          <div className="rounded-lg border bg-white p-4">
            <p className="text-gray-700">Tidak ada data untuk kombinasi filter ini.</p>
          </div>
        ) : (
          <>
            <MonitoringTable records={records} onOpenPhoto={(src) => setPhotoSrc(src)} />
            <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
          </>
        )}
      </main>
      {photoSrc ? <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} /> : null}
    </div>
  )
}
