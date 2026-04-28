"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { apiFetch } from "./api"

const AUTH_STORAGE_CHANGED_EVENT = "pinkamazon-auth-storage-changed"

export interface User {
  id?: string
  username?: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  birthdate?: string
  document?: string | {
    doc_type: string
    doc_number: string
    country: string
  }
  vip_points?: number
  is_active?: boolean
  is_staff?: boolean
  date_joined?: string
  created_at?: string
  updated_at?: string
  preferences?: {
    promotional_emails?: boolean
    order_updates?: boolean
    wishlist_notifications?: boolean
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: any }>
  register: (data: any) => Promise<{ success: boolean; user?: User; error?: any }>
  logout: () => void
  fetchMe: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"
const USER_ID_KEY = "userId"

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("JWT Decode error:", error)
    return null
  }
}

function getStoredToken(key: string) {
  if (typeof window === "undefined") return null
  return localStorage.getItem(key)
}

function hasSavedCredentials() {
  return !!(getStoredToken(ACCESS_TOKEN_KEY) || getStoredToken(REFRESH_TOKEN_KEY))
}

function setStoredToken(key: string, value: string | null) {
  if (typeof window === "undefined") return
  if (value === null) localStorage.removeItem(key)
  else localStorage.setItem(key, value)
  window.dispatchEvent(new CustomEvent(AUTH_STORAGE_CHANGED_EVENT))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const clearSession = () => {
    setUser(null)
    setToken(null)
    setStoredToken(ACCESS_TOKEN_KEY, null)
    setStoredToken(REFRESH_TOKEN_KEY, null)
    setStoredToken(USER_ID_KEY, null)
  }

  const fetchMe = async () => {
    try {
      const storedToken = getStoredToken(ACCESS_TOKEN_KEY)
      if (!storedToken || !hasSavedCredentials()) throw new Error("No saved credentials")
      
      setToken(storedToken)

      let userId = getStoredToken(USER_ID_KEY)
      
      if (!userId && storedToken) {
        const decoded = decodeJwt(storedToken)
        userId = decoded?.user_id || decoded?.id || decoded?.sub
      }

      if (!userId) {
        // Fallback to /me if no ID can be found, or handle as error
        console.warn("Could not determine user ID from token, falling back to /me")
      }

      const url = userId ? `/api/v1/users/${userId}/` : "/api/v1/users/me/"
      const data = await apiFetch<User>(url, { requiresAuth: true })
      
      setUser(data)
      
      // Persist the ID if we just got it
      if (data.id) {
        setStoredToken(USER_ID_KEY, data.id.toString())
      }
    } catch (error) {
      console.error("Session recovery failed:", error)
      clearSession()
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updatedFields: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : null)
  }

  useEffect(() => {
    if (hasSavedCredentials() && getStoredToken(ACCESS_TOKEN_KEY)) {
      void fetchMe()
    } else {
      clearSession()
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const syncSessionWithStorage = () => {
      if (!hasSavedCredentials()) {
        setUser(null)
        setToken(null)
        setIsLoading(false)
      } else {
        setToken(getStoredToken(ACCESS_TOKEN_KEY))
      }
    }

    window.addEventListener("storage", syncSessionWithStorage)
    window.addEventListener(AUTH_STORAGE_CHANGED_EVENT, syncSessionWithStorage)

    return () => {
      window.removeEventListener("storage", syncSessionWithStorage)
      window.removeEventListener(AUTH_STORAGE_CHANGED_EVENT, syncSessionWithStorage)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { access, refresh } = await apiFetch<{ access: string; refresh: string }>(
        "/api/v1/auth/login/",
        {
          method: "POST",
          body: {
            email, // Use email instead of username
            password,
          },
        }
      )

      setStoredToken(ACCESS_TOKEN_KEY, access)
      setStoredToken(REFRESH_TOKEN_KEY, refresh)
      setToken(access)

      // Get user ID from token to call the right endpoint
      const decoded = decodeJwt(access)
      const userId = decoded?.user_id || decoded?.id || decoded?.sub
      
      const url = userId ? `/api/v1/users/${userId}/` : "/api/v1/users/me/"
      const userData = await apiFetch<User>(url, { requiresAuth: true })
      
      setUser(userData)
      if (userData.id) {
        setStoredToken(USER_ID_KEY, userData.id.toString())
      }

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error as any }
    }
  }

  const register = async (data: any) => {
    try {
      // Use the new registration endpoint in v1
      const { confirmPassword, ...rest } = data
      const payload = {
        ...rest,
        password_confirm: confirmPassword,
        // Ensure username is present (fallback to email if not provided)
        username: data.username || data.email
      }

      const userData = await apiFetch<User>("/api/v1/users/", {
        method: "POST",
        body: payload,
      })

      if (userData.id) {
        setStoredToken(USER_ID_KEY, userData.id.toString())
      }

      // Optionally auto-login after register
      if (data.email && data.password) {
        return await login(data.email, data.password)
      }

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error as any }
    }
  }

  const logout = () => {
    clearSession()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      fetchMe, 
      isAuthenticated: !!user, 
      isLoading,
      token,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
