"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { apiFetch } from "./api"

export interface User {
  id?: string
  username?: string
  first_name?: string
  last_name?: string
  name: string
  email: string
  phone?: string
  cpf?: string
  birthdate?: string
  is_active?: boolean
  is_staff?: boolean
  promo_emails?: boolean
  order_updates?: boolean
  wishlist_notifications?: boolean
  document?: {
    doc_type: string
    doc_number: string
    country: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (data: any) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  fetchMe: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const ACCESS_TOKEN_KEY = "accessToken"
const REFRESH_TOKEN_KEY = "refreshToken"

function getStoredToken(key: string) {
  if (typeof window === "undefined") return null
  return localStorage.getItem(key)
}

function setStoredToken(key: string, value: string | null) {
  if (typeof window === "undefined") return
  if (value === null) localStorage.removeItem(key)
  else localStorage.setItem(key, value)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const fetchMe = async () => {
    try {
      const data = await apiFetch<User>("/api/users/me/", { requiresAuth: true })
      setUser(data)
    } catch (error) {
      console.error("Session recovery failed:", error)
      setUser(null)
      // If unauthorized, clear tokens
      setStoredToken(ACCESS_TOKEN_KEY, null)
      setStoredToken(REFRESH_TOKEN_KEY, null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = getStoredToken(ACCESS_TOKEN_KEY)
    if (token) {
      void fetchMe()
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { access, refresh } = await apiFetch<{ access: string; refresh: string }>(
        "/api/auth/token/",
        {
          method: "POST",
          body: {
            username: email,
            password,
          },
        }
      )

      setStoredToken(ACCESS_TOKEN_KEY, access)
      setStoredToken(REFRESH_TOKEN_KEY, refresh)

      const userData = await apiFetch<User>("/api/users/me/", { requiresAuth: true })
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const register = async (data: any) => {
    try {
      await apiFetch("/api/users/", {
        method: "POST",
        body: data,
      })
      
      // Optionally auto-login after register
      if (data.email && data.password) {
        return await login(data.email, data.password)
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }

  const logout = () => {
    setUser(null)
    setStoredToken(ACCESS_TOKEN_KEY, null)
    setStoredToken(REFRESH_TOKEN_KEY, null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, fetchMe, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
