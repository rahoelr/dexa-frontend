import { useEffect, useState } from "react"
import { navigate } from "../lib/navigation"
import { listEmployees } from "../lib/api"

export default function AdminOverview() {
  const [activeCount, setActiveCount] = useState<number>(0)
  const [latest, setLatest] = useState<import("../types").AdminEmployee[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Dashboard Admin</h1>
      <p className="text-sm text-gray-600">Ringkasan karyawan aktif dan terbaru.</p>
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
            <p className="text-sm text-gray-600">Karyawan Terbaru</p>
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
        </div>
      )}
    </div>
  )
}
