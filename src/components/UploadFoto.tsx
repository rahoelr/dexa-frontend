import { useEffect, useState } from "react"

const MAX_SIZE = 5 * 1024 * 1024
const ACCEPT = ["image/jpeg", "image/png"]

export default function UploadFoto({
  onChange,
}: {
  onChange: (file: File | null, previewUrl: string | null, error: string | null) => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function validate(file: File): string | null {
    if (!ACCEPT.includes(file.type)) return "Foto harus JPEG atau PNG"
    if (file.size > MAX_SIZE) return "Ukuran foto maksimal 5MB"
    return null
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    if (!file) {
      setPreview(null)
      setError(null)
      onChange(null, null, null)
      return
    }
    const err = validate(file)
    if (err) {
      setError(err)
      setPreview(null)
      onChange(null, null, err)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    setError(null)
    onChange(file, url, null)
  }

  function reset() {
    setPreview(null)
    setError(null)
    onChange(null, null, null)
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="block w-full text-sm text-gray-700"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {preview ? (
        <div className="flex items-center gap-3">
          <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded border" />
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      ) : null}
    </div>
  )
}

