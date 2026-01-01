import axios from "axios"

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

http.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("auth")
    if (raw) {
      const parsed = JSON.parse(raw) as { token?: string }
      if (parsed?.token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    }
  } catch {}
  return config
})

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401) {
      try {
        localStorage.removeItem("auth")
      } catch {}
      if (typeof window !== "undefined") {
        const { location } = window
        try {
          window.dispatchEvent(new CustomEvent("dexAuthUnauthorized"))
        } catch {}
        if (location.pathname !== "/login") {
          location.replace("/login")
        }
      }
    }
    return Promise.reject(err)
  }
)

export default http
