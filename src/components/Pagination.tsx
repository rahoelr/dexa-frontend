export default function Pagination({
  page,
  pageSize,
  total,
  onChange,
}: {
  page: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  function prev() {
    onChange(Math.max(1, page - 1))
  }
  function next() {
    onChange(Math.min(totalPages, page + 1))
  }
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={prev}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
      >
        Sebelumnya
      </button>
      <span className="text-sm text-gray-600">
        Halaman {page} dari {totalPages}
      </span>
      <button
        type="button"
        onClick={next}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
      >
        Selanjutnya
      </button>
    </div>
  )
}

