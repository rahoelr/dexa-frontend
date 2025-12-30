export default function QuickActions({
  onGoAbsen,
  onGoRiwayat,
}: {
  onGoAbsen: () => void
  onGoRiwayat: () => void
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        onClick={onGoAbsen}
        className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
      >
        Absen WFH
      </button>
      <button
        onClick={onGoRiwayat}
        className="w-full py-2 px-4 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
      >
        Riwayat Absen
      </button>
    </div>
  )
}

