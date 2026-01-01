import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getEmployee, updateEmployee } from "../lib/api"
import BackButton from "../components/BackButton"

export default function AdminEmployeeEdit() {
  const navigate = useNavigate()
  const params = useParams()
  const id = Number(params.id)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldError, setFieldError] = useState<{ email?: string; password?: string }>({})

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getEmployee(id)
        setName(res.name)
        setEmail(res.email)
        setIsActive(res.isActive)
      } catch (e: any) {
        const msg: string | undefined = e?.response?.data?.message || e?.message
        if (msg === "not_found") {
          setError("Data tidak ditemukan")
        } else {
          setError("Gagal memuat data karyawan")
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function submit() {
    setFieldError({})
    if (email && !email.includes("@")) {
      setFieldError((f) => ({ ...f, email: "Format email tidak valid" }))
      return
    }
    if (password && password.length < 6) {
      setFieldError((f) => ({ ...f, password: "Minimal 6 karakter" }))
      return
    }
    try {
      setLoading(true)
      setError(null)
      await updateEmployee(id, {
        name: name || undefined,
        email: email || undefined,
        password: password || undefined,
        isActive,
      })
      navigate(`/admin/employees/${id}`)
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
        setError(msg || "Gagal mengubah karyawan")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <BackButton />
        <h1 className="text-xl font-semibold">Edit Karyawan</h1>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : loading ? (
        <p className="mt-3 text-sm text-gray-600">Memuat...</p>
      ) : (
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
              placeholder="Kosongkan bila tidak diubah"
            />
            {fieldError.password ? <p className="mt-1 text-xs text-red-600">{fieldError.password}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Aktif
            </label>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => navigate(`/admin/employees/${id}`)}
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
      )}
    </div>
  )
}
