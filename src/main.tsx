import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { AuthProvider } from "./auth/AuthContext"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)

if (import.meta.env.DEV && import.meta.env.VITE_RUN_MANUAL_TESTS === "true") {
  import("./test/manual/loginValidation.test")
  import("./test/manual/attendanceDummy.test")
}
