import { apiPost } from '@/lib/api'

/** Matches Swagger `LoginResponse`. */
export type AuthUser = {
  userId: number
  email: string
  role: string
  token: string
}

/** Candidate login — email or mobile + password. */
export type UserLoginRequest = {
  email?: string
  mobile?: string
  password: string
}

/** Admin / recruiter login — email + password. */
export type AdminLoginRequest = {
  email: string
  password: string
}

export function loginUser(payload: UserLoginRequest) {
  return apiPost<AuthUser>('/api/auth/user/login', payload)
}

export function loginAdmin(payload: AdminLoginRequest) {
  return apiPost<AuthUser>('/api/auth/admin/login', payload)
}

/** Candidate register — Swagger `UserRegisterRequest` → `POST /api/auth/user/register`. */
export type UserRegisterRequest = {
  email: string
  /** Optional; send `""` when unused (Swagger pattern `^$|^\\+?[0-9]{10,15}$`). */
  mobile?: string
  password: string
  firstName: string
  lastName: string
}

/** Admin / recruiter register — returns the same session payload as login. */
export type AdminRegisterRequest = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export function registerUser(payload: UserRegisterRequest) {
  return apiPost<AuthUser>('/api/auth/user/register', {
    email: payload.email,
    mobile: payload.mobile?.trim() ?? '',
    password: payload.password,
    firstName: payload.firstName,
    lastName: payload.lastName,
  })
}

export function registerAdmin(payload: AdminRegisterRequest) {
  return apiPost<AuthUser>('/api/auth/admin/register', payload)
}

/** Clears the HttpOnly auth cookie on the server. */
export function logoutRequest() {
  return apiPost<null>('/api/auth/logout', undefined, { allowEmpty: true })
}

/**
 * Map the login form identifier to the candidate auth contract.
 * Backend accepts email OR mobile (not roll numbers).
 */
export function toUserLoginPayload(identifier: string, password: string): UserLoginRequest {
  const value = identifier.trim()
  if (/^\+?[0-9]{10,15}$/.test(value)) {
    return { mobile: value, password }
  }
  return { email: value, password }
}
