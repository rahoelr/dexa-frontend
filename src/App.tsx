import { useAuth } from "./auth/AuthContext"
import { useState } from "react"
import Login from "./pages/Login"
import DashboardEmployee from "./pages/DashboardEmployee"
import AttendanceHistory from "./pages/AttendanceHistory"
import AdminMonitoring from "./pages/AdminMonitoring"

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
        <div>
          <div className="p-3 flex justify-end">
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              Keluar
            </button>
          </div>
          <AdminMonitoring />
        </div>
      )}
    </div>
  )
}

export default App
