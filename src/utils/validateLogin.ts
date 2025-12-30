export function validateLogin(email: string, password: string): string | null {
  if (!email) return "Email harus diisi"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid"
  if (!password) return "Password harus diisi"
  if (password.length < 6) return "Password minimal 6 karakter"
  return null
}

