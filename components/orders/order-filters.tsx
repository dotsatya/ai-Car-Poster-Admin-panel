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
      {/* 4 filters arranged: 2 items per row on mobile, 4 in one row on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {/* 1. Search Input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search order or email"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border border-border/80 bg-card/60 pl-8 sm:pl-9 pr-2.5 sm:pr-3.5 py-2 text-xs sm:text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>

        {/* 2. Payment status filter */}
        <div className="relative">
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentFilterChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-card/60 pl-2.5 sm:pl-3.5 pr-7 sm:pr-9 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
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
          <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
        </div>

        {/* 3. Stages filter */}
        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => onStageFilterChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-card/60 pl-2.5 sm:pl-3.5 pr-7 sm:pr-9 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
          >
            <option value="all" className="bg-[#121315] text-foreground">
              All stages
            </option>
            <option value="Order Received" className="bg-[#121315] text-foreground">
              Order Received
            </option>
            <option value="Order Confirmed" className="bg-[#121315] text-foreground">
              Order Confirmed
            </option>
            <option value="Preparing Artwork" className="bg-[#121315] text-foreground">
              Preparing Artwork
            </option>
            <option value="Printing" className="bg-[#121315] text-foreground">
              Printing
            </option>
            <option value="Quality Check & Packing" className="bg-[#121315] text-foreground">
              Quality Check & Packing
            </option>
            <option value="Shipped" className="bg-[#121315] text-foreground">
              Shipped
            </option>
            <option value="Out for Delivery" className="bg-[#121315] text-foreground">
              Out for Delivery
            </option>
            <option value="Delivered" className="bg-[#121315] text-foreground">
              Delivered
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
        </div>

        {/* 4. Date range filter */}
        <div className="relative">
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
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
            <option value="custom" className="bg-[#121315] text-foreground">
              Custom range
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
        </div>
      </div>

      {/* Custom Range Date Pickers (if chosen) */}
      {dateFilter === "custom" ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 p-3 rounded-md border border-border/80 bg-card/40">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.03em]">
              Start Date
            </label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => onCustomStartChange(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-card/80 px-2.5 sm:px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.03em]">
              End Date
            </label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => onCustomEndChange(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-card/80 px-2.5 sm:px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
