import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createEmployee } from "../lib/api"
import BackButton from "../components/BackButton"

export default function AdminEmployeeNew() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string }>({})

  async function submit() {
    setFieldError({})
    if (!email.includes("@")) {
      setFieldError((f) => ({ ...f, email: "Format email tidak valid" }))
      return
    }
    if (password.length < 6) {
      setFieldError((f) => ({ ...f, password: "Minimal 6 karakter" }))
      return
    }
    try {
      setLoading(true)
      setError(null)
      await createEmployee({ name, email, password, isActive })
      navigate("/admin/employees")
    } catch (e: any) {
      const msg: string | undefined = e?.response?.data?.message || e?.message
      const status: number | undefined = e?.response?.status
      if (status === 403) {
        setError("Admin only")
        return
      }
      if (msg === "email_taken") {
        setFieldError((f) => ({ ...f, email: "Email sudah terpakai" }))
      } else {
        setError(msg || "Gagal menambah karyawan")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-xl font-semibold">Tambah Karyawan</h1>
      </div>
      <div className="mt-4 space-y-3 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama</label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          {fieldError.email ? <p className="mt-1 text-xs text-red-600">{fieldError.email}</p> : null}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Minimal 6 karakter"
          />
          {fieldError.password ? <p className="mt-1 text-xs text-red-600">{fieldError.password}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Aktif
          </label>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => navigate("/admin/employees")}
            disabled={loading}
          >
            Batal
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            onClick={submit}
            disabled={loading}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
