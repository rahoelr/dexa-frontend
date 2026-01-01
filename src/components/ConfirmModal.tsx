import { PropsWithChildren } from "react"

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
}: PropsWithChildren<{
  open: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}>) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">{title || "Konfirmasi"}</h2>
        </div>
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700">{message || "Apakah Anda yakin?"}</p>
        </div>
        <div className="px-4 py-3 flex justify-end gap-2 border-t">
          <button
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
