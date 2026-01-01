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
    const url: string | undefined = err?.config?.url
    const headers: any = err?.config?.headers
    const hasAuthHeader = !!headers?.Authorization
    const isLoginEndpoint = typeof url === "string" && url.includes("/auth/login")
    if (status === 401 && hasAuthHeader && !isLoginEndpoint) {
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
