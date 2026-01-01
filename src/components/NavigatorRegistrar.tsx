import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { registerNavigate } from "../lib/navigation"

export default function NavigatorRegistrar() {
  const navigate = useNavigate()
  useEffect(() => {
    registerNavigate((path, opts) => {
      navigate(path, { replace: !!opts?.replace })
    })
  }, [navigate])
  return null
}

