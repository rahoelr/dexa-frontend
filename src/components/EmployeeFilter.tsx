export default function EmployeeFilter({
  departmentOptions,
  department,
  search,
  onChange,
}: {
  departmentOptions: string[]
  department: string
  search: string
  onChange: (next: { department: string; search: string }) => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Departemen
        </label>
        <select
          id="department"
          value={department}
          onChange={(e) => onChange({ department: e.target.value, search })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Semua</option>
          {departmentOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Cari (Nama/NIP)
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => onChange({ department, search: e.target.value })}
          placeholder="Contoh: rahul atau 10001"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  )
}
