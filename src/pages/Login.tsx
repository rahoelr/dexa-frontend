import { FormEvent, useState } from "react"
import { useAuth } from "../auth/AuthContext"
import { validateLogin } from "../utils/validateLogin"
import { useNavigate } from "react-router-dom"

type Status = "idle" | "loading" | "error"

export default function Login() {
  const { auth, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage("")
    const err = validateLogin(email, password)
    if (err) {
      setErrorMessage(err)
      setStatus("error")
      return
    }
    try {
      setStatus("loading")
      await login(email, password)
      try {
        const raw = localStorage.getItem("auth")
        const parsed = raw ? (JSON.parse(raw) as { user?: { role?: import("../types").Role } }) : null
        const role = parsed?.user?.role ?? auth.user?.role
        navigate(role === "ADMIN" ? "/admin" : "/", { replace: true })
      } catch {
        navigate("/", { replace: true })
      }
      setStatus("idle")
    } catch (err) {
      setErrorMessage("Kredensial salah atau server tidak tersedia")
      setStatus("error")
    }
  }

  const isLoading = status === "loading"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Masuk</h1>
        <p className="mt-2 text-sm text-gray-500 text-center">Aplikasi Absensi WFH</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit} aria-busy={isLoading}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="email@contoh.com"
              aria-invalid={status === "error" && !!errorMessage}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••"
              required
            />
          </div>
          {status === "error" && errorMessage && (
            <div role="alert" className="text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
        {auth.user && (
          <p className="mt-2 text-xs text-green-600 text-center">Masuk sebagai {auth.user.role}</p>
        )}
      </div>
    </div>
  )
}
