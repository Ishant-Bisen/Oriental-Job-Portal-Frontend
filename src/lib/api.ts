export type ApiEnvelope<T> = {
  status: string
  httpStatus: number
  message: string
  data: T
  errors?: Record<string, string>
  timestamp: string
}

export class ApiError extends Error {
  readonly httpStatus: number
  readonly status: string
  readonly fieldErrors?: Record<string, string>

  constructor(message: string, httpStatus: number, status: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.httpStatus = httpStatus
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type RequestOptions = RequestInit & {
  /** When true, a successful response may return `data: null` (e.g. logout). */
  allowEmpty?: boolean
}

let authToken: string | null = null

/** Used by the auth layer so API calls can send Bearer when the backend returns a JWT. */
export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken() {
  return authToken
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { allowEmpty = false, headers, ...init } = options

  const response = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      Accept: 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  })

  const raw = await response.text()
  let body: ApiEnvelope<T> | null = null
  if (raw) {
    try {
      body = JSON.parse(raw) as ApiEnvelope<T>
    } catch {
      const hint =
        response.status === 403 && /cors/i.test(raw)
          ? 'CORS blocked this request. Open the app at http://localhost:5173/'
          : raw.slice(0, 180)
      throw new ApiError(hint || `Request failed (${response.status})`, response.status, 'INTERNAL_SERVER_ERROR')
    }
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || `Request failed (${response.status})`,
      body?.httpStatus || response.status,
      body?.status || 'ERROR',
      body?.errors,
    )
  }

  if (body?.data == null && !allowEmpty) {
    throw new ApiError(body?.message || 'Empty response', body?.httpStatus || response.status, body?.status || 'ERROR')
  }

  return body!.data as T
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return request<T>(path, { ...init, method: 'GET' })
}

export function apiPost<T>(path: string, body?: unknown, init?: RequestOptions) {
  return request<T>(path, {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}
