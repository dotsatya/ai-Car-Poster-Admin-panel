"use client"

import * as React from "react"
import { Search } from "lucide-react"

interface TemplateFiltersProps {
  categories: string[]
  activeCategory: string
  onSelectCategory: (category: string) => void
  search: string
  onSearchChange: (search: string) => void
}

export function TemplateFilters({
  categories,
  activeCategory,
  onSelectCategory,
  search,
  onSearchChange,
}: TemplateFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates by vehicle, style, or title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-border/80 bg-card/60 pl-10 pr-4 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase()
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`rounded-md px-3 py-1.5 text-xs transition-all cursor-pointer ${
                isActive
                  ? "bg-secondary text-foreground border border-primary/50 font-medium shadow-sm"
                  : "bg-card text-muted-foreground border border-border/80 hover:text-foreground hover:border-border font-normal"
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
