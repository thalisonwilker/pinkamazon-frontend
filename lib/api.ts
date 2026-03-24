export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type ApiFetchOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: Record<string, unknown> | string
  headers?: Record<string, string>
  requiresAuth?: boolean
}

export async function apiFetch<T = unknown>(
  path: string,
  { body, requiresAuth, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
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
    const response = await fetch(url, {
      ...init,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? ""
      let message = await response.text()

      if (contentType.includes("application/json")) {
        try {
          const json = await response.json()
          if (json && typeof json === "object") {
            if ("detail" in json) message = (json as any).detail
            else message = JSON.stringify(json)
          }
        } catch {
          // keep original text if parsing fails
        }
      }

      throw new Error(`Request failed (${response.status}): ${message}`)
    }

    return (await response.json()) as T
  } finally {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("api-loading-stop"))
    }
  }
}
