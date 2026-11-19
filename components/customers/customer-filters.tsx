"use client"

import * as React from "react"
import { Search, ChevronDown } from "lucide-react"

interface CustomerFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  accountFilter: string
  onAccountFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  dateFilter?: string
  onDateFilterChange?: (value: string) => void
}

export function CustomerFilters({
  search,
  onSearchChange,
  accountFilter,
  onAccountFilterChange,
  sortBy,
  onSortByChange,
  dateFilter,
  onDateFilterChange,
}: CustomerFiltersProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
      {/* 1. Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search customer"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border/80 bg-card/60 pl-8 sm:pl-9 pr-2.5 sm:pr-3.5 py-2 text-xs sm:text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* 2. Account Status Filter */}
      <div className="relative">
        <select
          value={accountFilter}
          onChange={(e) => onAccountFilterChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 pl-2.5 sm:pl-3.5 pr-7 sm:pr-9 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
        >
          <option value="all" className="bg-[#121315] text-foreground">
            All accounts
          </option>
          <option value="active" className="bg-[#121315] text-foreground">
            Active
          </option>
          <option value="disabled" className="bg-[#121315] text-foreground">
            Disabled
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
      </div>

      {/* 3. Sort By */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 pl-2.5 sm:pl-3.5 pr-7 sm:pr-9 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
        >
          <option value="recent" className="bg-[#121315] text-foreground">
            Recently joined
          </option>
          <option value="posters" className="bg-[#121315] text-foreground">
            Most posters
          </option>
          <option value="orders" className="bg-[#121315] text-foreground">
            Most orders
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
      </div>

      {/* 4. Date range filter */}
      <div className="relative">
        <select
          value={dateFilter || "30d"}
          onChange={(e) => onDateFilterChange?.(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 pl-2.5 sm:pl-3.5 pr-7 sm:pr-9 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
        >
          <option value="1w" className="bg-[#121315] text-foreground">
            Last week
          </option>
          <option value="30d" className="bg-[#121315] text-foreground">
            Last 30 days
          </option>
          <option value="6m" className="bg-[#121315] text-foreground">
            Last 6 mon
          </option>
          <option value="1y" className="bg-[#121315] text-foreground">
            Last 1 year
          </option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
      </div>
    </div>
  )
}
