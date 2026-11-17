"use client"

import * as React from "react"
import { Download } from "lucide-react"

interface OrderHeaderProps {
  onExportCSV?: () => void
}

export function OrderHeader({ onExportCSV }: OrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Manage car poster print fulfillment, shipping manifests, and order lifecycle.
        </p>
      </div>
      <button
        type="button"
        onClick={onExportCSV}
        className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm"
      >
        <Download className="size-4 text-primary" />
        <span>Export CSV</span>
      </button>
    </div>
  )
}
