import { useAuth } from "./auth/AuthContext"
import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import DashboardEmployee from "./pages/DashboardEmployee"
import AttendanceHistory from "./pages/AttendanceHistory"
import AdminMonitoring from "./pages/AdminMonitoring"
import AdminEmployees from "./pages/AdminEmployees"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminOverview from "./pages/AdminOverview"
import AdminEmployeeNew from "./pages/AdminEmployeeNew"
import AdminEmployeeDetail from "./pages/AdminEmployeeDetail"
import AdminEmployeeEdit from "./pages/AdminEmployeeEdit"
import NavigatorRegistrar from "./components/NavigatorRegistrar"

function App() {
  const { auth, logout } = useAuth()
  const [view, setView] = useState<"dashboard" | "history">("dashboard")
  const [adminView, setAdminView] = useState<"monitoring" | "employees">("monitoring")

  return (
    <div className="min-h-screen bg-gray-50">
      {!auth.user ? (
        <BrowserRouter>
          <NavigatorRegistrar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
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
        <BrowserRouter>
          <NavigatorRegistrar />
          <div className="p-3 flex justify-end">
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              Keluar
            </button>
          </div>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/karyawan"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees/new"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminEmployeeNew />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees/:id"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminEmployeeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees/:id/edit"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminEmployeeEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/monitoring"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminMonitoring />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<AdminOverview />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
