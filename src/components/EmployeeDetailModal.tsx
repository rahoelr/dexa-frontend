import { useEffect, useState } from "react"
import { getEmployee } from "../lib/api"

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
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Detail Karyawan</h2>
          <button className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>
            Tutup
          </button>
        </div>
        <div className="px-4 py-3 space-y-2">
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
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
