"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  Download,
  ChevronDown,
  ShoppingBag,
  AlignVerticalSpaceAround,
  WandSparkles,
  Printer,
  Calendar,
  CalendarDays,
  Filter,
  Check,
} from "lucide-react"

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

interface GenerationActivity {
  period: string
  totalGenerations: number
  individualCount: number
  combinedCount: number
  uniqueUsers: number
  avgDuration: string
  successRate: string
}

interface PrintSizeSales {
  size: string
  dimensions: string
  unitsSold: number
  revenue: string
  sharePercent: number
  avgPrice: string
  topTemplate: string
}

type ReportTabId = "summary" | "template" | "activity" | "size"

interface ReportTab {
  id: ReportTabId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const REPORT_TABS: ReportTab[] = [
  { id: "summary", label: "Order summary", icon: ShoppingBag },
  { id: "template", label: "Sales by template", icon: AlignVerticalSpaceAround },
  { id: "activity", label: "Generation activity", icon: WandSparkles },
  { id: "size", label: "Sales by print size", icon: Printer },
]

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

const GENERATION_ACTIVITY_DATA: GenerationActivity[] = [
  {
    period: "09 Nov to 15 Nov",
    totalGenerations: 482,
    individualCount: 395,
    combinedCount: 87,
    uniqueUsers: 142,
    avgDuration: "7.8s",
    successRate: "99.4%",
  },
  {
    period: "02 Nov to 08 Nov",
    totalGenerations: 436,
    individualCount: 360,
    combinedCount: 76,
    uniqueUsers: 131,
    avgDuration: "8.1s",
    successRate: "98.9%",
  },
  {
    period: "26 Oct to 01 Nov",
    totalGenerations: 412,
    individualCount: 341,
    combinedCount: 71,
    uniqueUsers: 125,
    avgDuration: "8.5s",
    successRate: "99.2%",
  },
  {
    period: "19 Oct to 25 Oct",
    totalGenerations: 445,
    individualCount: 370,
    combinedCount: 75,
    uniqueUsers: 138,
    avgDuration: "7.9s",
    successRate: "99.1%",
  },
]

const PRINT_SIZE_DATA: PrintSizeSales[] = [
  {
    size: "18 x 24 in",
    dimensions: "5400 x 7200 px (300 DPI)",
    unitsSold: 284,
    revenue: "₹68,160",
    sharePercent: 50.2,
    avgPrice: "₹240",
    topTemplate: "Retro Racer",
  },
  {
    size: "24 x 36 in",
    dimensions: "7200 x 10800 px (300 DPI)",
    unitsSold: 182,
    revenue: "₹50,960",
    sharePercent: 32.2,
    avgPrice: "₹280",
    topTemplate: "Neon Night",
  },
  {
    size: "12 x 18 in",
    dimensions: "3600 x 5400 px (300 DPI)",
    unitsSold: 100,
    revenue: "₹20,000",
    sharePercent: 17.6,
    avgPrice: "₹200",
    topTemplate: "Clean Line",
  },
]

function ReportsContent() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as ReportTabId) || "summary"
  const [activeTab, setActiveTab] = React.useState<ReportTabId>(
    REPORT_TABS.some((t) => t.id === initialTab) ? initialTab : "summary"
  )

  const [timeRange, setTimeRange] = React.useState("30d")
  const [startDate, setStartDate] = React.useState("18 Oct 2026")
  const [endDate, setEndDate] = React.useState("17 Nov 2026")
  const [orderState, setOrderState] = React.useState("all")
  const [feedback, setFeedback] = React.useState<string | null>(null)

  function handleTimeRangeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setTimeRange(val)
    if (val === "7d") {
      setStartDate("10 Nov 2026")
      setEndDate("17 Nov 2026")
    } else if (val === "30d") {
      setStartDate("18 Oct 2026")
      setEndDate("17 Nov 2026")
    } else if (val === "6m") {
      setStartDate("18 May 2026")
      setEndDate("17 Nov 2026")
    } else if (val === "1y") {
      setStartDate("18 Nov 2025")
      setEndDate("17 Nov 2026")
    }
  }

  function handleApplyFilters() {
    setFeedback(`Filters applied: ${startDate} to ${endDate}`)
    setTimeout(() => setFeedback(null), 3000)
  }

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
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
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
    const headers = ["Template", "Individual sold", "Revenue", "Share of total %", "Used in combined"]
    const rows = TEMPLATE_SALES_DATA.map((t) => [
      `"${t.name}${t.isCombined ? " (Combined)" : ""}"`,
      t.individualSold,
      `"${t.revenue}"`,
      `"${t.sharePercent}%"`,
      `"${t.usedInCombined}"`,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `sales-by-template-${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export Generation Activity to CSV
  function exportGenerationActivityCsv() {
    const headers = [
      "Period",
      "Total Generations",
      "Individual Previews",
      "Combined Previews",
      "Unique Users",
      "Avg Duration",
      "Success Rate",
    ]
    const rows = GENERATION_ACTIVITY_DATA.map((g) => [
      `"${g.period}"`,
      g.totalGenerations,
      g.individualCount,
      g.combinedCount,
      g.uniqueUsers,
      `"${g.avgDuration}"`,
      `"${g.successRate}"`,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `generation-activity-${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Export Sales by Print Size to CSV
  function exportSalesByPrintSizeCsv() {
    const headers = [
      "Print Size",
      "Dimensions",
      "Units Sold",
      "Revenue",
      "Share of total %",
      "Average Price",
      "Top Template",
    ]
    const rows = PRINT_SIZE_DATA.map((s) => [
      `"${s.size}"`,
      `"${s.dimensions}"`,
      s.unitsSold,
      `"${s.revenue}"`,
      `"${s.sharePercent}%"`,
      `"${s.avgPrice}"`,
      `"${s.topTemplate}"`,
    ])
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `sales-by-print-size-${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Page Title & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Reports
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Commercial performance, template adoption analytics, generation engine activity, and print sales.
        </p>
      </div>

      {/* 2. Universal Filter Controls: Modern Integrated Toolbar */}
      <div className="rounded-md border border-border/80 bg-card p-3 sm:p-4 text-card-foreground shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Left Group: Date Preset & Range */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Preset Dropdown with CalendarDays Icon */}
            <div className="relative min-w-[150px] sm:min-w-[170px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/70">
                <CalendarDays className="size-4" />
              </div>
              <select
                value={timeRange}
                onChange={handleTimeRangeChange}
                className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-9 pr-8 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
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
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
            </div>

            {/* Unified Date Range Group with Calendar Icon */}
            <div className="inline-flex items-center rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-xs sm:text-sm text-foreground focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-colors">
              <Calendar className="size-3.5 text-muted-foreground/70 shrink-0 mr-2" />
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
                className="w-24 sm:w-28 bg-transparent text-xs sm:text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50 text-center"
              />
              <span className="text-xs text-muted-foreground/60 px-2 font-normal select-none">
                to
              </span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date"
                className="w-24 sm:w-28 bg-transparent text-xs sm:text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50 text-center"
              />
            </div>
          </div>

          {/* Right Group: Order Status Filter & Apply Action */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto w-full lg:w-auto">
            {/* Order State Dropdown with Filter Icon */}
            <div className="relative flex-1 lg:w-48 shrink-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/70">
                <Filter className="size-3.5" />
              </div>
              <select
                value={orderState}
                onChange={(e) => setOrderState(e.target.value)}
                className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-9 pr-8 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
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
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={handleApplyFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm shrink-0 active:scale-[0.98]"
            >
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Confirmation Feedback Toast */}
      {feedback && (
        <div className="p-3 text-xs bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-md flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <Check className="size-3.5" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 3. Universal 4 Metric KPI Cards (Outside & Above Navbar) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* 4. Top Bar Navbar (Matching Demo Style, Positioned Below Universal Section) */}
      <div className="border-b border-border/80">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {REPORT_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-t-md text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#181a1f] text-foreground font-semibold shadow-xs border-t border-x border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/80"
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(216,49,56,0.6)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Selected Report Subsection View */}
      <div className="grid gap-6">
        {/* 1. Order summary Section */}
        {activeTab === "summary" && (
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
                className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Download className="size-4 text-primary" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Weekly Summary Table */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                    <th className="py-3.5 px-4 font-medium">Week</th>
                    <th className="py-3.5 px-4 font-medium">Orders</th>
                    <th className="py-3.5 px-4 font-medium">Posters sold</th>
                    <th className="py-3.5 px-4 font-medium">Revenue</th>
                    <th className="py-3.5 px-4 font-medium">Average order</th>
                    <th className="py-3.5 px-4 font-medium">Refunds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {WEEKLY_DATA.map((row) => (
                    <tr key={row.week} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.week}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.orders}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.postersSold}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.revenue}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.averageOrder}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.refunds}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. Sales by template Section */}
        {activeTab === "template" && (
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
                className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Download className="size-4 text-primary" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Template Sales Table with Clear Percent Column */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                    <th className="py-3.5 px-4 font-medium">Template</th>
                    <th className="py-3.5 px-4 font-medium">Individual sold</th>
                    <th className="py-3.5 px-4 font-medium">Revenue</th>
                    <th className="py-3.5 px-4 font-medium">Share of total (%)</th>
                    <th className="py-3.5 px-4 font-medium">Used in combined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {TEMPLATE_SALES_DATA.map((row) => (
                    <tr key={row.name} className="hover:bg-secondary/20 transition-colors">
                      {/* Template name + badge if combined */}
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        <span>{row.name}</span>
                        {row.isCombined && (
                          <span className="ml-2 inline-block px-1.5 py-0.5 text-[10px] font-medium rounded-md border bg-blue-950/80 text-blue-400 border-blue-800/40">
                            Combined
                          </span>
                        )}
                      </td>

                      {/* Individual sold */}
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.individualSold}
                      </td>

                      {/* Revenue */}
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.revenue}
                      </td>

                      {/* Share of total - Easy-to-read percent badge + bar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-foreground w-10 shrink-0">
                            {row.sharePercent}%
                          </span>
                          <div className="w-24 sm:w-36 bg-zinc-800/80 rounded-full h-2 overflow-hidden shrink-0">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${Math.min(row.sharePercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Used in combined */}
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
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
        )}

        {/* 3. Generation activity Section */}
        {activeTab === "activity" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
            {/* Header Row with Export CSV */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  Generation activity
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                  Real-time preview generation metrics, engine latency, and user pipeline conversion.
                </p>
              </div>

              <button
                type="button"
                onClick={exportGenerationActivityCsv}
                className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Download className="size-4 text-primary" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Generation Activity Table */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                    <th className="py-3.5 px-4 font-medium">Period</th>
                    <th className="py-3.5 px-4 font-medium">Total Previews</th>
                    <th className="py-3.5 px-4 font-medium">Individual</th>
                    <th className="py-3.5 px-4 font-medium">Combined</th>
                    <th className="py-3.5 px-4 font-medium">Unique Users</th>
                    <th className="py-3.5 px-4 font-medium">Avg Duration</th>
                    <th className="py-3.5 px-4 font-medium">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {GENERATION_ACTIVITY_DATA.map((row) => (
                    <tr key={row.period} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.period}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.totalGenerations}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.individualCount}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.combinedCount}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.uniqueUsers}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.avgDuration}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                          {row.successRate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground pt-1 font-normal leading-relaxed">
              Previews represent completed GPU inference passes. Retries due to network timeouts are excluded from customer quota counts.
            </p>
          </div>
        )}

        {/* 4. Sales by print size Section */}
        {activeTab === "size" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
            {/* Header Row with Export CSV */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  Sales by print size
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 font-normal">
                  Fulfillment breakdown across standardized 300 DPI fine art print dimensions.
                </p>
              </div>

              <button
                type="button"
                onClick={exportSalesByPrintSizeCsv}
                className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Download className="size-4 text-primary" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Print Size Table with Easy-to-read Share of Total Column */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                    <th className="py-3.5 px-4 font-medium">Print Size</th>
                    <th className="py-3.5 px-4 font-medium">Dimensions (300 DPI)</th>
                    <th className="py-3.5 px-4 font-medium">Units Sold</th>
                    <th className="py-3.5 px-4 font-medium">Revenue</th>
                    <th className="py-3.5 px-4 font-medium">Share of total (%)</th>
                    <th className="py-3.5 px-4 font-medium">Avg Price</th>
                    <th className="py-3.5 px-4 font-medium">Top Template</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {PRINT_SIZE_DATA.map((row) => (
                    <tr key={row.size} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.size}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground font-normal">
                        {row.dimensions}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.unitsSold}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.revenue}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-foreground w-11 shrink-0">
                            {row.sharePercent}%
                          </span>
                          <div className="w-24 sm:w-36 bg-zinc-800/80 rounded-full h-2 overflow-hidden shrink-0">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${Math.min(row.sharePercent, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.avgPrice}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {row.topTemplate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground pt-1 font-normal leading-relaxed">
              Standard sizes are calibrated for 300 DPI archival poster output. Revenue figures reflect gross poster print totals before shipping fees.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ReportsContent />
    </React.Suspense>
  )
}
