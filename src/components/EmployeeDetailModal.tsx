import { useEffect, useState } from "react"
import { getEmployee, getAdminAttendance } from "../lib/api"
import MonitoringTable from "./MonitoringTable"
import Pagination from "./Pagination"
import PhotoModal from "./PhotoModal"

export default function EmployeeDetailModal({
  open,
  id,
  onClose,
}: {
  open: boolean
  id: number | null
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<import("../types").AdminEmployee | null>(null)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [attLoading, setAttLoading] = useState(false)
  const [attError, setAttError] = useState<string | null>(null)
  const [records, setRecords] = useState<import("../types").AttendanceAdminRecord[]>([])
  const [total, setTotal] = useState(0)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  useEffect(() => {
    if (!open || !id) return
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getEmployee(id)
        setData(res)
      } catch (e: any) {
        const msg = e instanceof Error ? e.message : "Gagal memuat detail"
        setError(msg)
      } finally {
        setLoading(false)
      }
    })()
  }, [open, id])
  useEffect(() => {
    if (!open || !id) return
    ;(async () => {
      try {
        setAttLoading(true)
        setAttError(null)
        const res = await getAdminAttendance({
          from: startDate,
          to: endDate,
          page,
          pageSize,
          userId: id,
        })
        const employee = {
          id: String(data?.id ?? id),
          name: data?.name ?? `User ${id}`,
          nip: "-",
          department: "-",
          position: undefined,
        }
        const mapped: import("../types").AttendanceAdminRecord[] = res.items.map((it) => ({
          date: it.date.slice(0, 10),
          checkIn: it.checkIn,
          checkOut: it.checkOut,
          status: it.status,
          lateMinutes: undefined,
          photoUrl: it.photoUrl,
          description: it.description,
          employee,
        }))
        setRecords(mapped)
        setTotal(res.total)
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
  }, [open, id, startDate, endDate, page, pageSize, data])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl mx-4 rounded-lg bg-white shadow-lg">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Detail Karyawan</h2>
          <div className="flex gap-2">
            <button className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
        <div className="px-4 py-3 space-y-2 max-h-[80vh] overflow-y-auto">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {loading ? <p className="text-sm text-gray-600">Memuat...</p> : null}
          {!loading && data ? (
            <>
              <p className="text-sm"><span className="text-gray-500">Nama:</span> {data.name}</p>
              <p className="text-sm"><span className="text-gray-500">Email:</span> {data.email}</p>
              <p className="text-sm"><span className="text-gray-500">Role:</span> {data.role}</p>
              <p className="text-sm">
                <span className="text-gray-500">Status:</span> {data.isActive ? "Aktif" : "Nonaktif"}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Dibuat:</span> {new Date(data.createdAt).toLocaleString()}
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold">Riwayat Absensi</p>
                <div className="flex flex-wrap items-end gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Dari</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value)
                        setPage(1)
                      }}
                      className="mt-1 block w-40 rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Sampai</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value)
                        setPage(1)
                      }}
                      className="mt-1 block w-40 rounded-md border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                </div>
                {attError ? <p className="text-sm text-red-600">{attError}</p> : null}
                {attLoading ? <p className="text-sm text-gray-600">Memuat riwayat...</p> : null}
                {!attLoading && records.length === 0 ? (
                  <p className="text-sm text-gray-700">Tidak ada absensi untuk tanggal ini.</p>
                ) : !attLoading ? (
                  <>
                    <div className="overflow-x-auto">
                      <MonitoringTable records={records} onOpenPhoto={(src) => setPhotoSrc(src)} />
                    </div>
                    <div className="mt-2">
                      <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        {photoSrc ? <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} /> : null}
      </div>
    </div>
  )
}
