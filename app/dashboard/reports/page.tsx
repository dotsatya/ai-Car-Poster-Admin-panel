"use client"

import * as React from "react"
import { Download, ChevronDown } from "lucide-react"

interface WeeklySummary {
  week: string
  orders: number
  postersSold: number
  revenue: string
  averageOrder: string
  refunds: string
}

interface TemplateSales {
  name: string
  isCombined?: boolean
  individualSold: number
  revenue: string
  sharePercent: number
  usedInCombined: string | number
}

const WEEKLY_DATA: WeeklySummary[] = [
  {
    week: "09 Nov to 15 Nov",
    orders: 94,
    postersSold: 152,
    revenue: "₹33,100",
    averageOrder: "₹352",
    refunds: "₹900",
  },
  {
    week: "02 Nov to 08 Nov",
    orders: 88,
    postersSold: 141,
    revenue: "₹30,800",
    averageOrder: "₹350",
    refunds: "₹1,200",
  },
  {
    week: "26 Oct to 01 Nov",
    orders: 85,
    postersSold: 133,
    revenue: "₹29,700",
    averageOrder: "₹349",
    refunds: "₹800",
  },
  {
    week: "19 Oct to 25 Oct",
    orders: 89,
    postersSold: 140,
    revenue: "₹31,200",
    averageOrder: "₹351",
    refunds: "₹500",
  },
]

const TEMPLATE_SALES_DATA: TemplateSales[] = [
  {
    name: "Retro Racer",
    individualSold: 128,
    revenue: "₹40,960",
    sharePercent: 92,
    usedInCombined: 46,
  },
  {
    name: "Neon Night",
    individualSold: 96,
    revenue: "₹21,120",
    sharePercent: 48,
    usedInCombined: 38,
  },
  {
    name: "Clean Line",
    individualSold: 54,
    revenue: "₹10,800",
    sharePercent: 24,
    usedInCombined: 12,
  },
  {
    name: "Combined posters",
    isCombined: true,
    individualSold: 41,
    revenue: "₹17,200",
    sharePercent: 39,
    usedInCombined: "Not applicable",
  },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const [startDate, setStartDate] = React.useState("18 Oct 2026")
  const [endDate, setEndDate] = React.useState("17 Nov 2026")
  const [orderState, setOrderState] = React.useState("all")

  // Export Order Summary to CSV
  function exportOrderSummaryCsv() {
    const headers = ["Week", "Orders", "Posters sold", "Revenue", "Average order", "Refunds"]
    const rows = WEEKLY_DATA.map((w) => [
      `"${w.week}"`,
      w.orders,
      w.postersSold,
      `"${w.revenue}"`,
      `"${w.averageOrder}"`,
      `"${w.refunds}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `order-summary-${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export Sales by Template to CSV
  function exportSalesByTemplateCsv() {
    const headers = ["Template", "Individual sold", "Revenue", "Share %", "Used in combined"]
    const rows = TEMPLATE_SALES_DATA.map((t) => [
      `"${t.name}${t.isCombined ? " (Combined)" : ""}"`,
      t.individualSold,
      `"${t.revenue}"`,
      `"${t.sharePercent}%"`,
      `"${t.usedInCombined}"`,
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `sales-by-template-${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Reports
        </h1>
      </div>

      {/* Top Filter Controls: In ONE single row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap lg:flex-nowrap gap-3 w-full">
        {/* Dropdown: Last 30 days */}
        <div className="relative w-full sm:w-48 md:w-52 shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-9 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
          >
            <option value="7d" className="bg-[#121315] text-foreground">
              Last 7 days
            </option>
            <option value="30d" className="bg-[#121315] text-foreground">
              Last 30 days
            </option>
            <option value="6m" className="bg-[#121315] text-foreground">
              Last 6 months
            </option>
            <option value="1y" className="bg-[#121315] text-foreground">
              Last 1 year
            </option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
        </div>

        {/* Date Inputs: [ 18 Oct 2026 ] to [ 17 Nov 2026 ] */}
        <div className="flex items-center gap-2.5 shrink-0">
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-32 sm:w-36 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <span className="text-xs text-muted-foreground font-normal">to</span>
          <input
            type="text"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-32 sm:w-36 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
          />
        </div>

        {/* Dropdown: All order states */}
        <div className="relative w-full sm:w-48 md:w-52 shrink-0">
          <select
            value={orderState}
            onChange={(e) => setOrderState(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-9 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
          >
            <option value="all" className="bg-[#121315] text-foreground">
              All order states
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

        {/* Apply Button */}
        <div className="shrink-0">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-border/80 bg-secondary/80 hover:bg-secondary text-sm font-medium text-foreground cursor-pointer transition-colors shadow-xs"
          >
            Apply
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
        {/* 1. Orders */}
        <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
          <span className="text-xs font-normal text-muted-foreground block">
            Orders
          </span>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            356
          </div>
        </div>

        {/* 2. Revenue (after refunds) */}
        <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
          <span className="text-xs font-normal text-muted-foreground block">
            Revenue (after refunds)
          </span>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            ₹1,24,800
          </div>
        </div>

        {/* 3. Average order value */}
        <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
          <span className="text-xs font-normal text-muted-foreground block">
            Average order value
          </span>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            ₹351
          </div>
        </div>

        {/* 4. Refunded */}
        <div className="rounded-md border border-border/80 bg-card p-4 sm:p-5 text-card-foreground shadow-sm">
          <span className="text-xs font-normal text-muted-foreground block">
            Refunded
          </span>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            ₹3,400
          </div>
        </div>
      </div>

      {/* Section 1: Order summary */}
      <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
        {/* Header Row with Export CSV */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base text-foreground">
              Order summary
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
              One row per week, using the filters above.
            </p>
          </div>

          <button
            type="button"
            onClick={exportOrderSummaryCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-[#141519] hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Weekly Summary Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 text-xs font-normal text-muted-foreground">
                <th className="pb-3 font-normal">Week</th>
                <th className="pb-3 font-normal">Orders</th>
                <th className="pb-3 font-normal">Posters sold</th>
                <th className="pb-3 font-normal">Revenue</th>
                <th className="pb-3 font-normal">Average order</th>
                <th className="pb-3 font-normal">Refunds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {WEEKLY_DATA.map((row) => (
                <tr key={row.week} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.week}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.orders}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.postersSold}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.revenue}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.averageOrder}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.refunds}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Sales by template */}
      <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
        {/* Header Row with Export CSV & Rule Badge */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-base text-foreground">
              Sales by template
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 font-normal">
              Combined posters are counted as their own row, and also shown under each contributing template.
            </p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[11px] font-medium rounded border bg-amber-950/70 text-amber-500 border-amber-800/40">
              Rule to confirm with client
            </span>
          </div>

          <button
            type="button"
            onClick={exportSalesByTemplateCsv}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-[#141519] hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Download className="size-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Template Sales Table */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 text-xs font-normal text-muted-foreground">
                <th className="pb-3 font-normal">Template</th>
                <th className="pb-3 font-normal">Individual sold</th>
                <th className="pb-3 font-normal">Revenue</th>
                <th className="pb-3 font-normal">Share</th>
                <th className="pb-3 font-normal">Used in combined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {TEMPLATE_SALES_DATA.map((row) => (
                <tr key={row.name} className="hover:bg-secondary/20 transition-colors">
                  {/* Template name + badge if combined */}
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    <span>{row.name}</span>
                    {row.isCombined && (
                      <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-md border bg-blue-950/80 text-blue-400 border-blue-800/40">
                        Combined
                      </span>
                    )}
                  </td>

                  {/* Individual sold */}
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.individualSold}
                  </td>

                  {/* Revenue */}
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.revenue}
                  </td>

                  {/* Share Progress Bar */}
                  <td className="py-3.5">
                    <div className="w-36 sm:w-44 bg-zinc-800/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${row.sharePercent}%` }}
                      />
                    </div>
                  </td>

                  {/* Used in combined */}
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {row.usedInCombined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explanatory Footnote */}
        <p className="text-xs text-muted-foreground pt-1 font-normal leading-relaxed">
          The Revenue column adds up to total revenue. The &ldquo;Used in combined&rdquo; column is a count only and has no money in it.
        </p>
      </div>
    </div>
  )
}
