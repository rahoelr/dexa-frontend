export type StatusFilterValue = "ALL" | "PRESENT_ON_TIME" | "PRESENT_LATE" | "ABSENT"

export default function StatusFilter({
  value,
  onChange,
}: {
  value: StatusFilterValue
  onChange: (v: StatusFilterValue) => void
}) {
  return (
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
        Status
      </label>
      <select
        id="status"
        value={value}
        onChange={(e) => onChange(e.target.value as StatusFilterValue)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="ALL">Semua</option>
        <option value="PRESENT_ON_TIME">Tepat Waktu</option>
        <option value="PRESENT_LATE">Terlambat</option>
        <option value="ABSENT">Absen</option>
      </select>
    </div>
  )
}

