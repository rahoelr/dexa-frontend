import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Pagination from "../components/Pagination"
import { listEmployees, deleteEmployee, updateEmployee } from "../lib/api"
import Toast from "../components/Toast"
import ConfirmModal from "../components/ConfirmModal"
import AddEmployeeModal from "../components/AddEmployeeModal"
import EmployeeDetailModal from "../components/EmployeeDetailModal"
import BackButton from "../components/BackButton"

export default function AdminEmployees() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [employees, setEmployees] = useState<import("../types").AdminEmployee[]>([])
  const [allEmployees, setAllEmployees] = useState<import("../types").AdminEmployee[]>([])
  const [total, setTotal] = useState(0)
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [confirmSoftId, setConfirmSoftId] = useState<number | null>(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [detailId, setDetailId] = useState<number | null>(null)

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function refetch() {
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await listEmployees({ page: 1, limit: 1000 })
        setAllEmployees(res.items)
        applyFilterAndPaginate(res.items, search, page, pageSize)
      } catch (e: any) {
        const status: number | undefined = e?.response?.status
        if (status === 403) {
          setError("Admin only")
        } else {
          setError("Gagal memuat data karyawan")
        }
      } finally {
        setLoading(false)
      }
    })()
  }

  function applyFilterAndPaginate(
    source: import("../types").AdminEmployee[],
    q: string,
    p: number,
    size: number
  ) {
    const term = q.trim().toLowerCase()
    const filtered = term
      ? source.filter((e) => {
          const name = e.name?.toLowerCase() || ""
          const email = e.email?.toLowerCase() || ""
          return name.includes(term) || email.includes(term)
        })
      : source
    const totalItems = filtered.length
    const start = (p - 1) * size
    const pageItems = filtered.slice(start, start + size)
    setEmployees(pageItems)
    setTotal(totalItems)
  }

  function handleSoftDelete(id: number) {
    setConfirmSoftId(id)
  }

  function handleActivate(id: number) {
    ;(async () => {
      try {
        await updateEmployee(id, { isActive: true })
        refetch()
        setToast({ type: "success", message: "Karyawan diaktifkan" })
      } catch (e: any) {
        const status: number | undefined = e?.response?.status
        if (status === 403) {
          setError("Admin only")
        } else {
          setError(e instanceof Error ? e.message : "Gagal mengaktifkan karyawan")
        }
        setToast({ type: "error", message: "Gagal mengaktifkan" })
      }
    })()
  }

  function handleHardDelete(id: number) {
    const ok = window.confirm("Hapus permanen karyawan ini?")
    if (!ok) return
    ;(async () => {
      try {
        await deleteEmployee(id, { hard: true })
        refetch()
        setToast({ type: "success", message: "Karyawan dihapus permanen" })
      } catch (e: any) {
        const status: number | undefined = e?.response?.status
        if (status === 403) {
          setError("Admin only")
        } else {
          setError(e instanceof Error ? e.message : "Gagal menghapus permanen karyawan")
        }
        setToast({ type: "error", message: "Gagal menghapus permanen" })
      }
    })()
  }

  return (
    <div className="p-6">
      <header>
        <div className="flex items-center justify-between">
          <BackButton />
          <h1 className="text-xl font-semibold">Manajemen Karyawan</h1>
        </div>
      </header>
      <main className="mt-6 space-y-6">
        <section className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cari nama/email</label>
              <input
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={(e) => {
                  const value = e.target.value
                  const nextPage = 1
                  setSearch(value)
                  setPage(nextPage)
                  applyFilterAndPaginate(allEmployees, value, nextPage, pageSize)
                }}
                placeholder="Misal: Alice atau alice@example.com"
              />
            </div>
          </div>
          <div>
            <button
              className="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setOpenAdd(true)}
            >
              Tambah Karyawan
            </button>
          </div>
        </section>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : loading ? (
          <p className="text-sm text-gray-600">Memuat...</p>
        ) : employees.length === 0 ? (
          <div className="rounded-lg border bg-white p-4">
            <p className="text-gray-700">Tidak ada karyawan untuk filter ini.</p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border bg-white overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nama</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Role</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dibuat</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4 py-2 text-sm text-gray-800">{e.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{e.email}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{e.role}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 ${
                            e.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {e.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <div className="flex gap-2">
                          <button className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setDetailId(e.id)}>
                            Detail
                          </button>
                          <button
                            className="px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                            onClick={() => navigate(`/admin/employees/${e.id}/edit`)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-2 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                            onClick={() => (e.isActive ? handleSoftDelete(e.id) : handleActivate(e.id))}
                          >
                            {e.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                          <button
                            className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                            onClick={() => handleHardDelete(e.id)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={page}
              pageSize={pageSize}
              total={total}
              onChange={(newPage) => {
                setPage(newPage)
                applyFilterAndPaginate(allEmployees, search, newPage, pageSize)
              }}
            />
          </>
        )}
      </main>
      {toast ? <Toast type={toast.type} message={toast.message} /> : null}
      <ConfirmModal
        open={confirmSoftId !== null}
        title="Nonaktifkan Karyawan"
        message="Apakah Anda yakin ingin menonaktifkan karyawan ini?"
        onCancel={() => setConfirmSoftId(null)}
        onConfirm={() => {
          const id = confirmSoftId
          setConfirmSoftId(null)
          if (!id) return
          ;(async () => {
            try {
              await updateEmployee(id, { isActive: false })
              refetch()
              setToast({ type: "success", message: "Karyawan dinonaktifkan" })
            } catch (e: any) {
              const status: number | undefined = e?.response?.status
              if (status === 403) {
                setError("Admin only")
              } else {
                setError(e instanceof Error ? e.message : "Gagal menonaktifkan karyawan")
              }
              setToast({ type: "error", message: "Gagal menonaktifkan" })
            }
          })()
        }}
      />
      <AddEmployeeModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          refetch()
          setToast({ type: "success", message: "Karyawan ditambahkan" })
        }}
      />
      <EmployeeDetailModal open={detailId !== null} id={detailId} onClose={() => setDetailId(null)} />
    </div>
  )
}
