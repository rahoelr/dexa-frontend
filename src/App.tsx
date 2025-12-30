import { useAuth } from "./auth/AuthContext"
import Login from "./pages/Login"

function App() {
  const { auth, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {!auth.user ? (
        <Login />
      ) : auth.user.role === "EMPLOYEE" ? (
        <div className="p-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Dashboard Karyawan</h1>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              Keluar
            </button>
          </header>
          <main className="mt-6">
            <div className="rounded-lg border bg-white p-4">
              <p>Selamat datang, {auth.user.name}.</p>
              <p className="mt-2 text-sm text-gray-600">
                Ini placeholder dashboard. Setelah login siap, kita tambahkan halaman Absen WFH dan
                Riwayat.
              </p>
            </div>
          </main>
        </div>
      ) : (
        <div className="p-6">
          <header className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Admin HRD</h1>
            <button
              onClick={logout}
              className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300"
            >
              Keluar
            </button>
          </header>
          <main className="mt-6">
            <div className="rounded-lg border bg-white p-4">
              <p>Masuk sebagai Admin.</p>
              <p className="mt-2 text-sm text-gray-600">
                Ini placeholder halaman Admin. Setelah login siap, kita tambahkan Master Karyawan
                dan Monitoring Absensi.
              </p>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}

export default App
