import type { AttendanceRecord } from "../types"

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="100%" height="100%" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%23666">No Photo</text></svg>'

function StatusBadge({ status }: { status: AttendanceRecord["status"] }) {
  const map: Record<AttendanceRecord["status"], string> = {
    PRESENT_ON_TIME: "bg-green-100 text-green-800",
    PRESENT_LATE: "bg-yellow-100 text-yellow-800",
    ABSENT: "bg-red-100 text-red-800",
  }
  const label: Record<AttendanceRecord["status"], string> = {
    PRESENT_ON_TIME: "Tepat Waktu",
    PRESENT_LATE: "Terlambat",
    ABSENT: "Absen",
  }
  return <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>{label[status]}</span>
}

export default function AttendanceTable({
  records,
  onOpenPhoto,
}: {
  records: AttendanceRecord[]
  onOpenPhoto: (src: string) => void
}) {
  return (
    <div className="rounded-lg border bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">Check-In</th>
            <th className="px-4 py-2">Check-Out</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Foto</th>
            <th className="px-4 py-2">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.date} className="border-t">
              <td className="px-4 py-2">{r.date}</td>
              <td className="px-4 py-2">
                {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "-"}
              </td>
              <td className="px-4 py-2">
                {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "-"}
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-2">
                {r.photoUrl ? (
                  <img
                    src={r.photoUrl}
                    alt="Foto"
                    loading="lazy"
                    className="h-12 w-12 object-cover rounded border cursor-pointer"
                    onError={(ev) => {
                      try {
                        console.log(
                          JSON.stringify({
                            tag: "frontend-photo-error",
                            src: r.photoUrl,
                            date: r.date,
                          })
                        )
                      } catch {}
                      ;(ev.currentTarget as HTMLImageElement).onerror = null
                      ;(ev.currentTarget as HTMLImageElement).src = FALLBACK_IMG
                    }}
                    onClick={() => onOpenPhoto(r.photoUrl!)}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2">{r.notes || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
