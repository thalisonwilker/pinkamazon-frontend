"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"

import {
  DEFAULT_PUBLIC_SETTINGS,
  getPublicSettings,
  type PublicSettings,
} from "@/lib/admin-settings"

type PublicSettingsContextValue = {
  settings: PublicSettings
  isLoading: boolean
}

const PublicSettingsContext = createContext<PublicSettingsContextValue | null>(null)

function syncInlineScript(parent: HTMLElement, id: string, content: string) {
  const existing = document.getElementById(id)

  if (!content.trim()) {
    existing?.remove()
    return
  }

  const script = existing ?? document.createElement("script")
  script.id = id
  script.textContent = content

  if (!existing) {
    parent.appendChild(script)
  }
}

export function PublicSettingsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = !pathname?.startsWith("/admin")
  const [settings, setSettings] = useState<PublicSettings>(DEFAULT_PUBLIC_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadSettings = async () => {
      if (!isPublicPage) {
        setIsLoading(false)
        return
      }

      try {
        const data = await getPublicSettings()
        if (isMounted) {
          setSettings(data)
        }
      } catch {
        if (isMounted) {
          setSettings(DEFAULT_PUBLIC_SETTINGS)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadSettings()

    return () => {
      isMounted = false
    }
  }, [isPublicPage, pathname])

  useEffect(() => {
    if (!isPublicPage) {
      return
    }

    syncInlineScript(document.head, "pinkamazon-public-head-script", settings.custom_head_script)
    syncInlineScript(document.body, "pinkamazon-public-body-script", settings.custom_body_script)
  }, [isPublicPage, settings.custom_body_script, settings.custom_head_script])

  const value = useMemo(
    () => ({ settings, isLoading }),
    [isLoading, settings]
  )

  return (
    <PublicSettingsContext.Provider value={value}>
      {children}
    </PublicSettingsContext.Provider>
  )
}

export function usePublicSettings() {
  const context = useContext(PublicSettingsContext)

  if (!context) {
    throw new Error("usePublicSettings must be used inside PublicSettingsProvider")
  }

  return context
}