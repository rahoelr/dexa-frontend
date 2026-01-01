import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function ProtectedRoute({
  role = "ADMIN",
  children,
}: {
  role?: import("../types").Role
  children: React.ReactNode
}) {
  const { auth } = useAuth()
  const location = useLocation()
  if (!auth.user || !auth.token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (role && auth.user.role !== role) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
