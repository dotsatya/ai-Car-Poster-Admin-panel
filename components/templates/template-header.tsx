"use client"

import * as React from "react"
import { Plus } from "lucide-react"

interface TemplateHeaderProps {
  onNewTemplate?: () => void
}

export function TemplateHeader({ onNewTemplate }: TemplateHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Poster Templates
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Browse, configure, and manage high-resolution automotive poster layouts and typography blueprints.
        </p>
      </div>
      <button
        type="button"
        onClick={onNewTemplate}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
      >
        <Plus className="size-4" />
        <span>Create Template</span>
      </button>
    </div>
  )
}
