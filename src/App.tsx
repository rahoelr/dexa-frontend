import { useState } from "react"
import reactLogo from "./assets/react.svg"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center gap-8">
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="h-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="h-16 animate-spin" alt="React logo" />
          </a>
        </div>
        <h1 className="mt-6 text-3xl font-bold">Vite + React</h1>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            onClick={() => setCount((c) => c + 1)}
          >
            Count is {count}
          </button>
        </div>
        <p className="mt-4 text-gray-600">Edit src/App.tsx dan simpan untuk reload.</p>
        <p className="mt-2 text-gray-500">Klik logo untuk dokumentasi.</p>
      </div>
    </div>
  )
}

export default App
