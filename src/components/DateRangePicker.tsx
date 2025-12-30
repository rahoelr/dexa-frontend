export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
}) {
  function onStartChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value, endDate)
  }
  function onEndChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(startDate, e.target.value)
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          Dari Tanggal
        </label>
        <input
          id="startDate"
          type="date"
          value={startDate}
          onChange={onStartChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          Sampai Tanggal
        </label>
        <input
          id="endDate"
          type="date"
          value={endDate}
          onChange={onEndChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  )
}

