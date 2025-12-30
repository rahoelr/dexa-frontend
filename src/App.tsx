import { useAuth } from "./auth/AuthContext"
import { useState } from "react"
import Login from "./pages/Login"
import DashboardEmployee from "./pages/DashboardEmployee"
import AttendanceHistory from "./pages/AttendanceHistory"

function App() {
  const { auth, logout } = useAuth()
  const [view, setView] = useState<"dashboard" | "history">("dashboard")

  return (
    <div className="min-h-screen bg-gray-50">
      {!auth.user ? (
        <Login />
      ) : auth.user.role === "EMPLOYEE" ? (
        <div>
          <div className="p-3 flex justify-end">
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              Keluar
            </button>
          </div>
          {view === "dashboard" ? (
            <DashboardEmployee
              onGoRiwayat={() => {
                setView("history")
              }}
            />
          ) : (
            <AttendanceHistory />
          )}
        </div>
      ) : (
        <div className="p-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Admin HRD</h1>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              Keluar
            </button>
          </header>
          <main className="mt-6">
            <div className="rounded-lg border bg-white p-4">
              <p>Masuk sebagai Admin.</p>
              <p className="mt-2 text-sm text-gray-600">
                Ini placeholder halaman Admin. Setelah login siap, kita tambahkan Master Karyawan
                dan Monitoring Absensi.
              </p>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

export default App
