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
        <img
          src={src}
          alt="Foto bukti"
          className="max-h-[60vh] max-w-[80vw] object-contain"
          onError={(ev) => {
            try {
              console.log(
                JSON.stringify({
                  tag: "frontend-photo-error",
                  src,
                })
              )
            } catch {}
            ;(ev.currentTarget as HTMLImageElement).onerror = null
            ;(ev.currentTarget as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"180\"><rect width=\"100%\" height=\"100%\" fill=\"%23ddd\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" font-family=\"sans-serif\" font-size=\"16\" fill=\"%23666\">Gambar tidak tersedia</text></svg>'
          }}
        />
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
