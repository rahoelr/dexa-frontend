import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import DateRangePicker from "../components/DateRangePicker"
import StatusFilter, { StatusFilterValue } from "../components/StatusFilter"
import AttendanceTable from "../components/AttendanceTable"
import Pagination from "../components/Pagination"
import PhotoModal from "../components/PhotoModal"
import { getMyAttendance } from "../lib/api"
import type { AttendanceRecord } from "../types"

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AttendanceHistory() {
  const { logout } = useAuth()
  const [startDate, setStartDate] = useState(todayStr())
  const [endDate, setEndDate] = useState(todayStr())
  const [status, setStatus] = useState<StatusFilterValue>("ALL")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [total, setTotal] = useState(0)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)

  function refetch() {
    setLoading(true)
    setError(null)
    getMyAttendance({ from: startDate, to: endDate, page, pageSize })
      .then((res) => {
        const items: AttendanceRecord[] = res.items.map((it) => {
          const mapStatus: Record<string, AttendanceRecord["status"]> = {
            ON_TIME: "PRESENT_ON_TIME",
            LATE: "PRESENT_LATE",
            ABSENT: "ABSENT",
          }
          return {
            date: it.date.slice(0, 10),
            checkInTime: it.checkIn,
            checkOutTime: it.checkOut,
            status: mapStatus[it.status] ?? "ABSENT",
            lateMinutes: undefined,
            photoUrl: it.photoUrl,
            notes: it.description,
          }
        })
        const filtered = status === "ALL" ? items : items.filter((r) => r.status === status)
        setRecords(filtered)
        setTotal(res.total)
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          logout()
          setError("Sesi berakhir, silakan login ulang")
        } else if (e?.response?.status === 503) {
          setError("Layanan tidak tersedia, coba lagi")
        } else {
          setError("Gagal memuat riwayat absensi")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, status, page])

  return (
    <div className="p-6">
      <header>
        <h1 className="text-xl font-semibold">Riwayat Absensi</h1>
        <p className="text-sm text-gray-600">Lihat riwayat absen Anda berdasarkan tanggal.</p>
      </header>
      <main className="mt-6 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : loading ? (
          <p className="text-sm text-gray-600">Memuat...</p>
        ) : records.length === 0 ? (
          <div className="rounded-lg border bg-white p-4">
            <p className="text-gray-700">Tidak ada data untuk rentang ini.</p>
          </div>
        ) : (
          <>
            <AttendanceTable records={records} onOpenPhoto={(src) => setPhotoSrc(src)} />
            <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
          </>
        )}
      </main>
      {photoSrc ? <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} /> : null}
    </div>
  )
}
