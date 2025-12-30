import { useEffect, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import CardStat from "../components/CardStat"
import UploadFoto from "../components/UploadFoto"
import ResultCard from "../components/ResultCard"
import { readAttendanceToday, writeAttendanceToday } from "../utils/attendanceToday"
import type { Attendance, AttendanceStatus } from "../types"

export default function DashboardEmployee({
  onGoRiwayat,
}: {
  onGoRiwayat: () => void
}) {
  const { auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Attendance | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    try {
      setLoading(true)
      const res = readAttendanceToday()
      if (mounted) setData(res)
    } catch {
      if (mounted) setError("Gagal memuat status absensi")
    } finally {
      if (mounted) setLoading(false)
    }
    return () => {
      mounted = false
    }
  }, [])

  const statValue =
    loading
      ? "Memuat..."
      : error
      ? "Error"
      : data?.status === "ON_TIME"
      ? "Hadir Tepat Waktu"
      : data?.status === "LATE"
      ? "Terlambat"
      : "Belum Absen"
  const statDesc =
    loading
      ? "Mengambil status terbaru"
      : data?.checkIn
      ? `Check-in: ${data.checkIn}`
      : undefined

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (data && data.status !== "ABSENT") {
      setSubmitError("Anda sudah absen hari ini")
      setSubmitStatus("error")
      return
    }
    if (!photoFile) {
      setSubmitError("Foto wajib diunggah")
      setSubmitStatus("error")
      return
    }
    try {
      setSubmitStatus("loading")
      const photoUrl = await fileToDataUrl(photoFile)
      const nowIso = new Date().toISOString()
      const status: AttendanceStatus = new Date(nowIso).getHours() < 9 ? "ON_TIME" : "LATE"
      const payload: Attendance = {
        id: Date.now(),
        userId: 1,
        date: nowIso.slice(0, 10),
        checkIn: nowIso,
        photoUrl,
        status,
        description: notes || undefined,
        createdAt: nowIso,
      }
      writeAttendanceToday(payload)
      setData(payload)
      setSubmitStatus("success")
    } catch {
      setSubmitError("Gagal menyimpan absensi")
      setSubmitStatus("error")
    }
  }

  function onCheckout() {
    if (!data || !data.checkIn) return
    if (data.checkOut) return
    const nowIso = new Date().toISOString()
    const updated: Attendance = { ...data, checkOut: nowIso }
    writeAttendanceToday(updated)
    setData(updated)
  }

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
        {data?.status === "ABSENT" || !data ? (
          <section>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="rounded-lg border bg-white p-4 space-y-4">
                <h2 className="text-lg font-semibold">Absen WFH</h2>
                <UploadFoto
                  onChange={(file, preview, err) => {
                    setPhotoFile(file)
                    setPhotoPreview(preview)
                    setSubmitError(err)
                  }}
                />
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Catatan (opsional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="Catatan pekerjaan hari ini"
                  />
                </div>
                {submitError ? (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitStatus === "loading" ? "Memproses..." : "Submit Absen"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section>
            <ResultCard
              checkInTime={data.checkIn!}
              checkOutTime={data.checkOut}
              photoUrl={data.photoUrl || photoPreview || undefined}
              onCheckout={onCheckout}
              canCheckout={!!data.checkIn}
            />
            <div className="mt-3">
              <button
                type="button"
                onClick={onGoRiwayat}
                className="px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Lihat Riwayat
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
