import { useAuth } from "../auth/AuthContext"
import Login from "../pages/Login"

export default function ProtectedView({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth()
  if (!auth.user) return <Login />
  return <>{children}</>
}

