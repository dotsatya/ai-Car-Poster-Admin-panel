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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          AI generations
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Live generative inference jobs, multi-view previews, and prompt telemetry.
        </p>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
      >
        <RefreshCw className={`size-4 text-primary ${isRefreshing ? "animate-spin" : ""}`} />
        <span>Updated just now</span>
      </button>
    </div>
  )
}
