export default function BackButton({ label = "Kembali", className = "" }: { label?: string; className?: string }) {
  function goBack() {
    if (typeof window === "undefined") return
    const len = window.history.length
    if (len > 1) {
      window.history.back()
    } else {
      window.location.href = "/"
    }
  }
  return (
    <button
      type="button"
      onClick={goBack}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border bg-white text-gray-800 hover:bg-gray-50 ${className}`}
    >
      <span>←</span>
      <span>{label}</span>
    </button>
  )
}
