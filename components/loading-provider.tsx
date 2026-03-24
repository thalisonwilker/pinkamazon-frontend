import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface LoadingContextType {
  isActive: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [activeRequests, setActiveRequests] = useState(0)

  useEffect(() => {
    const start = () => setActiveRequests((prev) => prev + 1)
    const stop = () => setActiveRequests((prev) => Math.max(0, prev - 1))

    window.addEventListener("api-loading-start", start)
    window.addEventListener("api-loading-stop", stop)

    return () => {
      window.removeEventListener("api-loading-start", start)
      window.removeEventListener("api-loading-stop", stop)
    }
  }, [])

  const isActive = activeRequests > 0

  return (
    <LoadingContext.Provider value={{ isActive }}>
      {/* Neon Pink Progress Bar */}
      <div
        className={`fixed top-0 left-0 z-50 h-[3px] bg-[#E91E7B] shadow-[0_5px_15px_#E91E7B] transition-all duration-300 ease-in-out ${
          isActive ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
      />
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
