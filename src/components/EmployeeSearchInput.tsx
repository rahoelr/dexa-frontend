import { useEffect, useMemo, useState } from "react"
import { listEmployees } from "../lib/api"

export default function EmployeeSearchInput({
  value,
  onChange,
  onSelect,
  placeholder = "Cari nama karyawan",
}: {
  value: string
  onChange: (v: string) => void
  onSelect: (emp: import("../types").AdminEmployee | null) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<import("../types").AdminEmployee[]>([])
  const debounced = useDebounce(value, 250)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!debounced.trim()) {
        setItems([])
        return
      }
      try {
        setLoading(true)
        const res = await listEmployees({ search: debounced, page: 1, limit: 5 })
        if (!cancelled) {
          setItems(res.items)
          setOpen(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [debounced])

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          if (items.length > 0) setOpen(true)
        }}
        placeholder={placeholder}
        className="mt-1 block w-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {open ? (
        <div className="absolute z-10 mt-1 w-64 rounded-md border bg-white shadow">
          {loading ? (
            <div className="px-3 py-2 text-sm text-gray-600">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-600">Tidak ada hasil</div>
          ) : (
            items.map((it) => (
              <button
                key={it.id}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  onSelect(it)
                  setOpen(false)
                }}
              >
                <span className="text-gray-800">{it.name}</span>
                <span className="ml-2 text-gray-500">{it.email}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

function useDebounce<T>(value: T, ms: number) {
  const [v, setV] = useState(value)
  const timeout = useMemo(() => ({ id: 0 as any }), [])
  useEffect(() => {
    clearTimeout(timeout.id as any)
    timeout.id = setTimeout(() => setV(value), ms) as any
    return () => clearTimeout(timeout.id as any)
  }, [value, ms])
  return v
}
