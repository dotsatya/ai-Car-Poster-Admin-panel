"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // On client after mount, if unauthenticated, redirect to login and prevent flashing protected content
  if (mounted && !isLoading && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-6 animate-spin rounded-md border-2 border-primary border-t-transparent" />
          <span className="text-xs font-medium text-muted-foreground">Redirecting to login...</span>
        </div>
      </div>
    )
  }

  // During SSR / Instant Navigation prerender, always render children so Next.js validates the segment shell
  return <>{children}</>
}
