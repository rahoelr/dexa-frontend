import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { login as apiLogin } from "../lib/api"
import type { AuthUser } from "../types"
import { navigate } from "../lib/navigation"

type AuthState = {
  user: AuthUser | null
  token: string | null
}

type AuthContextValue = {
  auth: AuthState
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readStorage(): AuthState {
  try {
    const raw = localStorage.getItem("auth")
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw) as { user: AuthUser; token: string }
    return { user: parsed.user ?? null, token: parsed.token ?? null }
  } catch {
    return { user: null, token: null }
  }
}

function writeStorage(state: AuthState) {
  localStorage.setItem("auth", JSON.stringify(state))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => readStorage())

  useEffect(() => {
    writeStorage(auth)
  }, [auth])
  useEffect(() => {
    function onUnauthorized() {
      setAuth({ user: null, token: null })
    }
    if (typeof window !== "undefined") {
      window.addEventListener("dexAuthUnauthorized", onUnauthorized)
      return () => window.removeEventListener("dexAuthUnauthorized", onUnauthorized)
    }
    return
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      async login(email: string, password: string) {
        const res = await apiLogin(email, password)
        setAuth({ user: res.user, token: res.token })
      },
      logout() {
        setAuth({ user: null, token: null })
        try {
          localStorage.removeItem("auth")
        } catch {}
        navigate("/login", { replace: true })
      },
    }),
    [auth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
