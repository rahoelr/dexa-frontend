export default function PhotoModal({
  src,
  onClose,
}: {
  src: string
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow p-4">
        <img src={src} alt="Foto bukti" className="max-h-[60vh] max-w-[80vw] object-contain" />
        <div className="mt-3 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

