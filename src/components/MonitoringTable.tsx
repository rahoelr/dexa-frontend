import type { AttendanceAdminRecord } from "../types"

function StatusBadge({ status }: { status: AttendanceAdminRecord["status"] }) {
  const map: Record<AttendanceAdminRecord["status"], string> = {
    ON_TIME: "bg-green-100 text-green-800",
    LATE: "bg-yellow-100 text-yellow-800",
    ABSENT: "bg-red-100 text-red-800",
  }
  const label: Record<AttendanceAdminRecord["status"], string> = {
    ON_TIME: "Tepat Waktu",
    LATE: "Terlambat",
    ABSENT: "Absen",
  }
  return <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>{label[status]}</span>
}

export default function MonitoringTable({
  records,
  onOpenPhoto,
}: {
  records: AttendanceAdminRecord[]
  onOpenPhoto: (src: string) => void
}) {
  return (
    <div className="rounded-lg border bg-white">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">Jam</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Keterlambatan</th>
            <th className="px-4 py-2">Foto</th>
            <th className="px-4 py-2">Catatan</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={`${r.employee.id}-${r.date}`} className="border-t">
              <td className="px-4 py-2">{r.employee.name}</td>
              <td className="px-4 py-2">{r.date}</td>
              <td className="px-4 py-2">{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : "-"}</td>
              <td className="px-4 py-2">
                <StatusBadge status={r.status} />
              </td>
              <td className="px-4 py-2">{r.lateMinutes ? `${r.lateMinutes} menit` : "-"}</td>
              <td className="px-4 py-2">
                {r.photoUrl ? (
                  <img
                    src={r.photoUrl}
                    alt="Foto"
                    className="h-12 w-12 object-cover rounded border cursor-pointer"
                    onClick={() => onOpenPhoto(r.photoUrl!)}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2">{r.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
