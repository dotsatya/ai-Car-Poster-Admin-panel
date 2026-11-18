"use client"

import * as React from "react"
import { AiGenerationStats } from "@/lib/demoAiGenerations"

interface AiKpiCardsProps {
  stats: AiGenerationStats
}

export function AiKpiCards({ stats }: AiKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Total generations */}
      <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
        <span className="text-xs font-normal text-muted-foreground block">
          Total generations
        </span>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
          {stats.totalGenerations.toLocaleString("en-US")}
        </div>
      </div>

      {/* 2. Processing */}
      <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
        <span className="text-xs font-normal text-muted-foreground block">
          Processing
        </span>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
          {stats.processing}
        </div>
      </div>

      {/* 3. Completed today */}
      <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
        <span className="text-xs font-normal text-muted-foreground block">
          Completed today
        </span>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
          {stats.completedToday}
        </div>
      </div>

      {/* 4. Failed today (Red Number) */}
      <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
        <span className="text-xs font-normal text-muted-foreground block">
          Failed today
        </span>
        <div className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-400 mt-1">
          {stats.failedToday}
        </div>
      </div>
    </div>
  )
}
