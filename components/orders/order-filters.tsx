"use client"

import * as React from "react"
import { Search, ChevronDown } from "lucide-react"

interface OrderFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  paymentFilter: string
  onPaymentFilterChange: (value: string) => void
  stageFilter: string
  onStageFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  customStart: string
  onCustomStartChange: (value: string) => void
  customEnd: string
  onCustomEndChange: (value: string) => void
}

export function OrderFilters({
  search,
  onSearchChange,
  paymentFilter,
  onPaymentFilterChange,
  stageFilter,
  onStageFilterChange,
  dateFilter,
  onDateFilterChange,
  customStart,
  onCustomStartChange,
  customEnd,
  onCustomEndChange,
}: OrderFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* All 4 filters arranged in one single row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search order no. or email"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-border/80 bg-card/60 pl-9 pr-3.5 py-2 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>

        {/* 2. Payment status filter */}
        <div className="relative">
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
          >
            <option value="all" className="bg-[#121315] text-foreground">
              All payment states
            </option>
            <option value="paid" className="bg-[#121315] text-foreground">
              Paid
            </option>
            <option value="pending" className="bg-[#121315] text-foreground">
              Pending
            </option>
            <option value="refunded" className="bg-[#121315] text-foreground">
              Refunded
            </option>
            <option value="cancelled" className="bg-[#121315] text-foreground">
              Cancelled
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
        </div>

        {/* 3. Stages filter */}
        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => onStageFilterChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
          >
            <option value="all" className="bg-[#121315] text-foreground">
              All stages
            </option>
            <option value="received" className="bg-[#121315] text-foreground">
              Received
            </option>
            <option value="painting" className="bg-[#121315] text-foreground">
              Painting
            </option>
            <option value="packing" className="bg-[#121315] text-foreground">
              Packing
            </option>
            <option value="shipped" className="bg-[#121315] text-foreground">
              Shipped
            </option>
            <option value="delivered" className="bg-[#121315] text-foreground">
              Delivered
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
        </div>

        {/* 4. Date range filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
          >
            <option value="30d" className="bg-[#121315] text-foreground">
              Last 30 days
            </option>
            <option value="7d" className="bg-[#121315] text-foreground">
              Last 7 days
            </option>
            <option value="custom" className="bg-[#121315] text-foreground">
              Custom range
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
        </div>
      </div>

      {/* Custom Range Date Pickers (if chosen) */}
      {dateFilter === "custom" ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-md border border-border/80 bg-card/40">
          <div className="w-full sm:w-1/2 space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.03em]">
              Start Date
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-card/80 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
            />
          </div>
          <div className="w-full sm:w-1/2 space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.03em]">
              End Date
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-card/80 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
