import { useAuth } from "./auth/AuthContext"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
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
import { navigate } from "./lib/navigation"

function App() {
  const { auth, logout } = useAuth()

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
              path="/"
              element={
                <ProtectedRoute role="EMPLOYEE">
                  <DashboardEmployee
                    onGoRiwayat={() => {
                      navigate("/employee/history")
                    }}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee"
              element={
                <ProtectedRoute role="EMPLOYEE">
                  <DashboardEmployee
                    onGoRiwayat={() => {
                      navigate("/employee/history")
                    }}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/history"
              element={
                <ProtectedRoute role="EMPLOYEE">
                  <AttendanceHistory />
                </ProtectedRoute>
              }
            />
            <Route path="/employee/*" element={<Navigate to="/employee" replace />} />
          </Routes>
        </BrowserRouter>
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
