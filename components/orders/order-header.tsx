"use client";

import * as React from "react";
import { Download } from "lucide-react";

export interface TimeRangeOption {
  id: string;
  label: string;
}

export const TIME_RANGES: TimeRangeOption[] = [
  { id: "1y", label: "Last 1 year" },
  { id: "6m", label: "Last 6 mon" },
  { id: "30d", label: "Last 30 days" },
  { id: "1w", label: "Last week" },
];

export const timeRanges = TIME_RANGES;

export interface OrderHeaderProps {
  selectedRange?: string;
  onRangeChange?: (rangeId: string) => void;
  onExportCSV?: () => void;
}

export function OrderHeader({
  selectedRange = "30d",
  onRangeChange,
  onExportCSV,
}: OrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Orders
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Manage car poster print fulfillment, shipping manifests, and order
          lifecycle.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Time range selector placed right before Export CSV */}
        <div className="inline-flex items-center rounded-md border border-border/80 bg-card/80 p-1 shadow-sm">
          {TIME_RANGES.map((range) => {
            const isActive = selectedRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onRangeChange?.(range.id)}
                className={`px-2.5 sm:px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Export CSV button */}
        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm"
        >
          <Download className="size-4 text-primary" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}
