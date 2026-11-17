"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export interface AuthUser {
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "poster_gen_auth_user"
const CREDENTIALS_KEY = "poster_gen_registered_users"

const DEFAULT_ADMIN: AuthUser = {
  name: "Poster Gen Admin",
  email: "admin1@gmail.com",
  role: "Full Administrator",
  avatar: "/avatars/shadcn.jpg",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Initialize session from client storage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser
        setUser(parsed)
      } else {
        // First-time convenience: if no session, leave null so login screen displays
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login handler
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate network authentication latency
    await new Promise((r) => setTimeout(r, 350))

    const cleanEmail = email.trim().toLowerCase()

    // 1. Check default admin credentials: admin1@gmail.com / 0000
    if (cleanEmail === "admin1@gmail.com") {
      if (password === "0000") {
        const authUser: AuthUser = DEFAULT_ADMIN
        localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
        setUser(authUser)
        setIsLoading(false)
        router.push("/dashboard")
        return { success: true }
      } else {
        setIsLoading(false)
        return { success: false, error: "Incorrect password. Demo password is 0000" }
      }
    }

    // 2. Check previously registered user in client storage
    try {
      const registeredStr = localStorage.getItem(CREDENTIALS_KEY)
      if (registeredStr) {
        const registered = JSON.parse(registeredStr) as Record<string, { name: string; password: string }>
        if (registered[cleanEmail]) {
          if (registered[cleanEmail].password === password) {
            const authUser: AuthUser = {
              name: registered[cleanEmail].name || "Administrator",
              email: cleanEmail,
              role: "Full Administrator",
              avatar: "/avatars/shadcn.jpg",
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
            setUser(authUser)
            setIsLoading(false)
            router.push("/dashboard")
            return { success: true }
          } else {
            setIsLoading(false)
            return { success: false, error: "Incorrect password for this registered account." }
          }
        }
      }
    } catch {
      // fallback
    }

    // 3. Fallback: Accept standard demo credentials if provided
    if (password.length >= 4) {
      const authUser: AuthUser = {
        name: cleanEmail.split("@")[0].toUpperCase(),
        email: cleanEmail,
        role: "Full Administrator",
        avatar: "/avatars/shadcn.jpg",
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
      setUser(authUser)
      setIsLoading(false)
      router.push("/dashboard")
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: "Invalid credentials. Use demo: admin1@gmail.com / 0000" }
  }

  // Signup handler
  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    await new Promise((r) => setTimeout(r, 350))

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !password) {
      setIsLoading(false)
      return { success: false, error: "Email and password are required." }
    }

    // Store registration in localStorage for future logins
    try {
      const existing = localStorage.getItem(CREDENTIALS_KEY)
      const registered = existing ? (JSON.parse(existing) as Record<string, { name: string; password: string }>) : {}
      registered[cleanEmail] = { name: name || "Administrator", password }
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(registered))
    } catch {
      // ignore
    }

    // Set authenticated user and session
    const authUser: AuthUser = {
      name: name.trim() || "Administrator",
      email: cleanEmail,
      role: "Full Administrator",
      avatar: "/avatars/shadcn.jpg",
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
    setIsLoading(false)

    // Open admin app dashboard directly after signup
    router.push("/dashboard")
    return { success: true }
  }

  // Logout handler
  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
