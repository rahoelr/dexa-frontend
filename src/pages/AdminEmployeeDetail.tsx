import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEmployee } from "../lib/api"

export default function AdminEmployeeDetail() {
  const navigate = useNavigate()
  const params = useParams()
  const id = Number(params.id)
  const [data, setData] = useState<import("../types").AdminEmployee | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Detail Karyawan</h1>
      {error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="mt-3 text-sm text-gray-600">Memuat...</p>
      ) : !data ? (
        <p className="mt-3 text-sm text-gray-600">Tidak ada data</p>
      ) : (
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
      )}
    </div>
  )
}
