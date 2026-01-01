import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEmployee, getAdminAttendance } from "../lib/api"
import BackButton from "../components/BackButton"
import MonitoringTable from "../components/MonitoringTable"
import Pagination from "../components/Pagination"
import PhotoModal from "../components/PhotoModal"

export default function AdminEmployeeDetail() {
  const navigate = useNavigate()
  const params = useParams()
  const id = Number(params.id)
  const [data, setData] = useState<import("../types").AdminEmployee | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [attPage, setAttPage] = useState(1)
  const [attPageSize] = useState(10)
  const [attLoading, setAttLoading] = useState(false)
  const [attError, setAttError] = useState<string | null>(null)
  const [attRecords, setAttRecords] = useState<import("../types").AttendanceAdminRecord[]>([])
  const [attTotal, setAttTotal] = useState(0)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getEmployee(id)
        setData(res)
      } catch (e: any) {
        const msg: string | undefined = e?.response?.data?.message || e?.message
        const status: number | undefined = e?.response?.status
        if (status === 403) {
          setError("Admin only")
        } else
        if (msg === "not_found") {
          setError("Data tidak ditemukan")
        } else {
          setError("Gagal memuat detail karyawan")
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        setAttLoading(true)
        setAttError(null)
        const res = await getAdminAttendance({
          from: startDate,
          to: endDate,
          page: attPage,
          pageSize: attPageSize,
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
  }, [id, startDate, endDate, attPage, attPageSize, data])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-xl font-semibold">Detail Karyawan</h1>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="mt-3 text-sm text-gray-600">Memuat...</p>
      ) : !data ? (
        <p className="mt-3 text-sm text-gray-600">Tidak ada data</p>
      ) : (
        <>
          <div className="mt-4 rounded-lg border bg-white p-4 max-w-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama</span>
                <span className="text-gray-800">{data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span className="text-gray-800">{data.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role</span>
                <span className="text-gray-800">{data.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-gray-800">{data.isActive ? "Aktif" : "Nonaktif"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dibuat</span>
                <span className="text-gray-800">{new Date(data.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                onClick={() => navigate("/admin/employees")}
              >
                Kembali
              </button>
              <button
                className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => navigate(`/admin/employees/${id}/edit`)}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold">Riwayat Absensi</h2>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value)
                    setAttPage(1)
                  }}
                  className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value)
                    setAttPage(1)
                  }}
                  className="mt-1 block w-48 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
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
                <div className="overflow-x-auto">
                  <MonitoringTable records={attRecords} onOpenPhoto={(src) => setPhotoSrc(src)} />
                </div>
                <div className="mt-3">
                  <Pagination page={attPage} pageSize={attPageSize} total={attTotal} onChange={setAttPage} />
                </div>
              </>
            )}
            {photoSrc ? <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} /> : null}
          </div>
        </>
      )}
    </div>
  )
}
