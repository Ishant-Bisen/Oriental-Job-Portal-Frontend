import { getAuthToken, setAuthToken } from '@/lib/api'
import type { AuthUser } from '@/api/auth'

const SESSION_KEY = 'tb.auth.session'

export type AuthSession = {
  userId: number
  email: string
  role: string
}

type Listener = () => void

let session: AuthSession | null = readSession()
const listeners = new Set<Listener>()

function readSession(): AuthSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession & { token?: string }
    if (!parsed?.userId || !parsed.email || !parsed.role) return null
    if (typeof parsed.token === 'string' && parsed.token) {
      setAuthToken(parsed.token)
    }
    return { userId: parsed.userId, email: parsed.email, role: parsed.role }
  } catch {
    return null
  }
}

function writeSession(next: AuthSession | null, token?: string | null) {
  session = next
  if (!next) {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthToken(null)
  } else {
    const tokenToStore = token === undefined ? getAuthToken() : token
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify(tokenToStore ? { ...next, token: tokenToStore } : next),
    )
    if (token !== undefined) setAuthToken(token)
  }
  listeners.forEach((listener) => listener())
}

export function getSession() {
  return session
}

export function subscribeSession(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setSessionFromLogin(user: AuthUser) {
  writeSession(
    {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    user.token || null,
  )
}

export function clearSession() {
  writeSession(null, null)
}

export function isAdminRole(role: string) {
  return /admin|recruiter|placement/i.test(role)
}
