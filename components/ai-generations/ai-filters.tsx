"use client"

import * as React from "react"
import { Search, ChevronDown } from "lucide-react"

interface AiFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  stateFilter: string
  onStateFilterChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  timeFilter: string
  onTimeFilterChange: (value: string) => void
}

export function AiFilters({
  search,
  onSearchChange,
  stateFilter,
  onStateFilterChange,
  typeFilter,
  onTypeFilterChange,
  timeFilter,
  onTimeFilterChange,
}: AiFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search by customer email or job ID"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border/80 bg-card/60 pl-9 pr-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* 2. State Filter */}
      <div className="relative">
        <select
          value={stateFilter}
          onChange={(e) => onStateFilterChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
        >
          <option value="all" className="bg-[#121315] text-foreground">
            All states
          </option>
          <option value="completed" className="bg-[#121315] text-foreground">
            Completed
          </option>
          <option value="processing" className="bg-[#121315] text-foreground">
            Processing
          </option>
          <option value="failed" className="bg-[#121315] text-foreground">
            Failed
          </option>
          <option value="queued" className="bg-[#121315] text-foreground">
            Queued
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
      </div>

      {/* 3. Type Filter */}
      <div className="relative">
        <select
          value={typeFilter}
          onChange={(e) => onTypeFilterChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
        >
          <option value="all" className="bg-[#121315] text-foreground">
            All types
          </option>
          <option value="individual" className="bg-[#121315] text-foreground">
            Individual
          </option>
          <option value="combined" className="bg-[#121315] text-foreground">
            Combined
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
      </div>

      {/* 4. Time Filter */}
      <div className="relative">
        <select
          value={timeFilter}
          onChange={(e) => onTimeFilterChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
        >
          <option value="today" className="bg-[#121315] text-foreground">
            Today
          </option>
          <option value="yesterday" className="bg-[#121315] text-foreground">
            Yesterday
          </option>
          <option value="7d" className="bg-[#121315] text-foreground">
            Last 7 days
          </option>
          <option value="30d" className="bg-[#121315] text-foreground">
            Last 30 days
          </option>
          <option value="all" className="bg-[#121315] text-foreground">
            All time
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
      </div>
    </div>
  )
}
