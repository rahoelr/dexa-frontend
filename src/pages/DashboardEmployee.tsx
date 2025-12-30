import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import CardStat from "../components/CardStat"
import QuickActions from "../components/QuickActions"
import { getAttendanceToday } from "../lib/api"
import type { AttendanceToday } from "../types"

export default function DashboardEmployee({
  onGoAbsen,
  onGoRiwayat,
}: {
  onGoAbsen: () => void
  onGoRiwayat: () => void
}) {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AttendanceToday | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await getAttendanceToday()
        if (mounted) setData(res)
      } catch {
        if (mounted) setError("Gagal memuat status absensi")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const statValue =
    loading ? "Memuat..." : error ? "Error" : data?.status === "PRESENT" ? "Hadir" : "Belum Absen"
  const statDesc =
    loading
      ? "Mengambil status terbaru"
      : data?.status === "PRESENT" && data?.checkInTime
      ? `Check-in: ${data.checkInTime}`
      : undefined

  return (
    <div className="p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard Karyawan</h1>
          <p className="text-sm text-gray-600">Selamat datang, {auth.user?.name}.</p>
        </div>
      </header>
      <main className="mt-6 space-y-6">
        <section>
          <CardStat title="Status Hari Ini" value={statValue} description={statDesc} />
        </section>
        <section>
          <QuickActions onGoAbsen={onGoAbsen} onGoRiwayat={onGoRiwayat} />
        </section>
      </main>
    </div>
  )
}

