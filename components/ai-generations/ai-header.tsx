"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

interface AiHeaderProps {
  onRefresh?: () => void
}

export function AiHeader({ onRefresh }: AiHeaderProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  function handleRefresh() {
    setIsRefreshing(true)
    onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 800)
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          AI generations
        </h1>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <RefreshCw className={`size-3 ${isRefreshing ? "animate-spin" : ""}`} />
        <span>Updated just now</span>
      </button>
    </div>
  )
}
