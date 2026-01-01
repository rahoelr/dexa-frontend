let navigatorFn: (path: string, opts?: { replace?: boolean }) => void = (path, opts) => {
  if (typeof window === "undefined") return
  if (opts?.replace) {
    window.location.replace(path)
  } else {
    window.location.href = path
  }
}

export function registerNavigate(fn: (path: string, opts?: { replace?: boolean }) => void) {
  navigatorFn = fn
}

export function navigate(path: string, opts?: { replace?: boolean }) {
  navigatorFn(path, opts)
}

