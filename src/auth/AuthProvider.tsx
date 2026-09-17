import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import {
  loginAdmin,
  loginUser,
  logoutRequest,
  registerAdmin,
  registerUser,
  toUserLoginPayload,
  type AdminRegisterRequest,
  type AuthUser,
  type UserRegisterRequest,
} from '@/api/auth'
import {
  clearSession,
  getSession,
  setSessionFromLogin,
  subscribeSession,
  type AuthSession,
} from '@/auth/session'

type AuthContextValue = {
  user: AuthSession | null
  isAuthenticated: boolean
  loginAsStudent: (identifier: string, password: string) => Promise<AuthUser>
  loginAsRecruiter: (email: string, password: string) => Promise<AuthUser>
  registerAsStudent: (payload: UserRegisterRequest) => Promise<AuthUser>
  registerAsRecruiter: (payload: AdminRegisterRequest) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(subscribeSession, getSession, () => null)

  const loginAsStudent = useCallback(async (identifier: string, password: string) => {
    const result = await loginUser(toUserLoginPayload(identifier, password))
    setSessionFromLogin(result)
    return result
  }, [])

  const loginAsRecruiter = useCallback(async (email: string, password: string) => {
    const result = await loginAdmin({ email: email.trim(), password })
    setSessionFromLogin(result)
    return result
  }, [])

  const registerAsStudent = useCallback(async (payload: UserRegisterRequest) => {
    const result = await registerUser(payload)
    setSessionFromLogin(result)
    return result
  }, [])

  const registerAsRecruiter = useCallback(async (payload: AdminRegisterRequest) => {
    const result = await registerAdmin(payload)
    setSessionFromLogin(result)
    return result
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      /* Always clear local session — cookie may already be gone. */
    } finally {
      clearSession()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user != null,
      loginAsStudent,
      loginAsRecruiter,
      registerAsStudent,
      registerAsRecruiter,
      logout,
    }),
    [user, loginAsStudent, loginAsRecruiter, registerAsStudent, registerAsRecruiter, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
