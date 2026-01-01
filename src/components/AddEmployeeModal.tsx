import { useState } from "react"
import { createEmployee } from "../lib/api"

export default function AddEmployeeModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  if (!open) return null
  function submit() {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        if (!name || !email || !password) {
          setError("Nama, email, dan password wajib diisi")
          setLoading(false)
          return
        }
        const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
        if (!emailValid) {
          setError("Format email tidak valid")
          setLoading(false)
          return
        }
        await createEmployee({ name, email, password, isActive })
        onSuccess()
        onClose()
      } catch (e: any) {
        const msg = e instanceof Error ? e.message : "Gagal menambah karyawan"
        setError(msg)
      } finally {
        setLoading(false)
      }
    })()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Tambah Karyawan</h2>
        </div>
        <div className="px-4 py-3 space-y-3">
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div className="flex items-center gap-2">
            <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Aktif
            </label>
          </div>
        </div>
        <div className="px-4 py-3 flex justify-end gap-2 border-t">
          <button className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  )
}
