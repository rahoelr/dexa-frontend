export default function Toast({
  type = "info",
  message,
}: {
  type?: "success" | "error" | "info"
  message: string
}) {
  const base = "fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow text-sm"
  const style =
    type === "success"
      ? "bg-green-600 text-white"
      : type === "error"
      ? "bg-red-600 text-white"
      : "bg-gray-800 text-white"
  return <div className={`${base} ${style}`}>{message}</div>
}
