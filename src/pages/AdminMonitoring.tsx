import { useEffect, useState } from "react"
import DateRangePicker from "../components/DateRangePicker"
import StatusFilter, { StatusFilterValue } from "../components/StatusFilter"
import EmployeeFilter from "../components/EmployeeFilter"
import MonitoringTable from "../components/MonitoringTable"
import Pagination from "../components/Pagination"
import PhotoModal from "../components/PhotoModal"
import CardStat from "../components/CardStat"
import { listAttendanceAdmin, listDepartments } from "../lib/adminDummy"
import { summarize } from "../utils/adminSummary"
import type { AttendanceAdminRecord } from "../types"

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminMonitoring() {
  const [startDate, setStartDate] = useState(todayStr())
  const [endDate, setEndDate] = useState(todayStr())
  const [status, setStatus] = useState<StatusFilterValue>("ALL")
  const [department, setDepartment] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<AttendanceAdminRecord[]>([])
  const [total, setTotal] = useState(0)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    setDepartments(listDepartments())
  }, [])

  function refetch() {
    try {
      setLoading(true)
      setError(null)
      const res = listAttendanceAdmin({
        startDate,
        endDate,
        status,
        department: department || undefined,
        search,
        page,
        pageSize,
      })
      setRecords(res.data)
      setTotal(res.pagination.total)
    } catch {
      setError("Gagal memuat data monitoring")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, status, department, search, page])

  const summary = summarize(records)

  return (
    <div className="p-6">
      <header>
        <h1 className="text-xl font-semibold">Monitoring Absensi Karyawan</h1>
        <p className="text-sm text-gray-600">Pantau kehadiran berdasarkan tanggal, departemen, dan status.</p>
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
          <EmployeeFilter
            departmentOptions={departments}
            department={department}
            search={search}
            onChange={(next) => {
              setDepartment(next.department)
              setSearch(next.search)
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

