import { validateLogin } from "../../utils/validateLogin"
import { login } from "../../lib/api"

function assert(name: string, condition: boolean) {
  // minimal test runner: log pass/fail to console
  const status = condition ? "PASS" : "FAIL"
  console.log(`[${status}] ${name}`)
}

assert("reject empty email", validateLogin("", "secret") === "Email harus diisi")
assert(
  "reject bad email format",
  validateLogin("user@", "secret") === "Format email tidak valid"
)
assert("reject short password", validateLogin("user@corp.com", "123") === "Password minimal 6 karakter")
assert("accept valid inputs", validateLogin("user@corp.com", "secret") === null)

async function testLoginRoles() {
  const admin = await login("admin@corp.com", "secret")
  assert("admin role detected", admin.user.role === "ADMIN")
  const emp = await login("user@corp.com", "secret")
  assert("employee role detected", emp.user.role === "EMPLOYEE")
}

testLoginRoles()

