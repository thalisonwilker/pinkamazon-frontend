export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://10.0.0.204:8000"
const AUTH_STORAGE_CHANGED_EVENT = "pinkamazon-auth-storage-changed"

export type ApiFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: Record<string, unknown> | string | FormData
  headers?: Record<string, string>
  requiresAuth?: boolean
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data: any = null
  ) {
    super(message)
    this.name = "ApiError"
  }
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null
  if (!refreshToken) return null

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    })
    if (!res.ok) return null
    const json = await res.json()
    const newAccess = json?.data?.access ?? json?.access
    if (newAccess && typeof window !== "undefined") {
      localStorage.setItem("accessToken", newAccess)
    }
    return newAccess ?? null
  } catch {
    return null
  }
}

function clearStoredCredentials() {
  if (typeof window === "undefined") {
    return
  }

  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("userId")
  window.dispatchEvent(new CustomEvent(AUTH_STORAGE_CHANGED_EVENT))
}

export async function apiFetch<T = unknown>(
  path: string,
  { body, requiresAuth, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData

  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) ?? {}),
  }

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  if (requiresAuth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }

  // Trigger loading start
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("api-loading-start"))
  }

  try {
    let response = await fetch(url, {
      ...init,
      headers,
      body: body ? (isFormData ? body : typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    })

    if (response.status === 401 && requiresAuth) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null })
      }
      const newToken = await refreshPromise
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`
        response = await fetch(url, {
          ...init,
          headers,
          body: body ? (isFormData ? body : typeof body === "string" ? body : JSON.stringify(body)) : undefined,
        })
      }

      if (!newToken) {
        clearStoredCredentials()
      }
    }

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? ""
      const text = await response.text()
      let message = ""
      let data = null

      // Try to parse as JSON regardless of content-type if it looks like JSON
      if (contentType.includes("application/json") || text.trim().startsWith("{")) {
        try {
          data = JSON.parse(text)
          if (data && typeof data === "object") {
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
              message = data.errors.map((e: any) => e.message || JSON.stringify(e)).join(" ")
            } else if (data.detail) {
              message = data.detail
            } else if (data.message) {
              message = data.message
            } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
              message = data.non_field_errors.join(" ")
            } else {
              // Extract all other field errors
              const fieldErrors = Object.entries(data)
                .filter(([key]) => !["success", "data", "errors"].includes(key))
                .map(([key, val]) => {
                  const valStr = Array.isArray(val) ? val.join(" ") : String(val)
                  return valStr
                })
              if (fieldErrors.length > 0) message = fieldErrors.join(" ")
            }
          }
        } catch {
          // ignore parsing error
          console.error("Error parsing JSON response", text)
        }
      }

      if (!message) message = text || `Request failed (${response.status})`

      if (response.status === 401 && requiresAuth) {
        clearStoredCredentials()
      }

      throw new ApiError(message, response.status, data)
    }

    const json = (await response.json()) as any
    
    // Auto-unwrap the 'data' key if it exists in a successful response
    if (json && typeof json === "object" && json.success === true && "data" in json) {
      return json.data as T
    }

    return json as T
  } finally {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("api-loading-stop"))
    }
  }
}
