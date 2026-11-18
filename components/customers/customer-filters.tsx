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
}

export function CustomerFilters({
  search,
  onSearchChange,
  accountFilter,
  onAccountFilterChange,
  sortBy,
  onSortByChange,
}: CustomerFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {/* 1. Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
        <input
          type="text"
          placeholder="Search customer or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border/80 bg-card/60 pl-9 pr-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* 2. Account Status Filter */}
      <div className="relative">
        <select
          value={accountFilter}
          onChange={(e) => onAccountFilterChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
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
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
      </div>

      {/* 3. Sort By */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
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
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
      </div>
    </div>
  )
}
