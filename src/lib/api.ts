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

  constructor(message: string, httpStatus: number, status: string) {
    super(message)
    this.name = 'ApiError'
    this.httpStatus = httpStatus
    this.status = status
  }
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json', ...init?.headers },
  })

  let body: ApiEnvelope<T>
  try {
    body = (await response.json()) as ApiEnvelope<T>
  } catch {
    throw new ApiError(`Request failed (${response.status})`, response.status, 'INTERNAL_SERVER_ERROR')
  }

  if (!response.ok || body.data == null) {
    throw new ApiError(body.message || `Request failed (${response.status})`, body.httpStatus || response.status, body.status)
  }

  return body.data
}
