"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  PRODUCTION_STAGES,
  INITIAL_PRODUCTION_ORDERS,
  mergeProductionOrders,
  type ProductionOrder,
  type ProductionStage,
} from "@/lib/demoProduction"
import { ChevronDown } from "lucide-react"

export function ProductionClientView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderParam = searchParams.get("order") || searchParams.get("search") || ""

  const [orders, setOrders] = React.useState<ProductionOrder[]>(INITIAL_PRODUCTION_ORDERS)
  const [searchQuery, setSearchQuery] = React.useState(orderParam)
  const [stageFilter, setStageFilter] = React.useState<string>("All stages")
  const [sortOrder, setSortOrder] = React.useState<"oldest" | "newest">("oldest")

  // React to search param updates
  React.useEffect(() => {
    if (orderParam) {
      setSearchQuery(orderParam)
      setStageFilter("All stages")
    }
  }, [orderParam])

  // Safely merge any changes stored in localStorage without dropping base orders
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("production_orders_store")
      if (stored) {
        const merged = mergeProductionOrders(INITIAL_PRODUCTION_ORDERS, stored)
        setOrders(merged)
      }
    } catch {
      // ignore
    }
  }, [])

  // Dynamically compute KPI counters based on real production orders queue
  const kpis = React.useMemo(() => {
    return PRODUCTION_STAGES.map((st) => ({
      label: st.shortLabel,
      stageKey: st.key,
      count: orders.filter((o) => o.stage === st.key).length,
    }))
  }, [orders])

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter((order) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const matchId = (order.id || "").toLowerCase().includes(q) || (order.cleanId || "").includes(q)
          const matchEmail = (order.customer?.email || "").toLowerCase().includes(q)
          const matchName = (order.customer?.name || "").toLowerCase().includes(q)
          const matchCarrier = (order.carrier || "").toLowerCase().includes(q)
          const matchTracking = (order.trackingNumber || "").toLowerCase().includes(q)
          const matchItem = order.items?.some((i) => i.title.toLowerCase().includes(q))
          if (!matchId && !matchEmail && !matchName && !matchCarrier && !matchTracking && !matchItem) {
            return false
          }
        }

        // Stage filter
        if (stageFilter === "All active stages") {
          return order.stage !== "Delivered"
        }
        if (stageFilter !== "All stages") {
          return order.stage === stageFilter
        }
        return true
      })
      .sort((a, b) => {
        const idA = parseInt(a.cleanId, 10) || 0
        const idB = parseInt(b.cleanId, 10) || 0
        return sortOrder === "oldest" ? idA - idB : idB - idA
      })
  }, [orders, searchQuery, stageFilter, sortOrder])

  const getStageBadge = (stage: ProductionStage) => {
    switch (stage) {
      case "Order Received":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            Order Received
          </span>
        )
      case "Order Confirmed":
      case "Order confirmed and logged" as any:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-950/60 text-violet-400 border border-violet-900/60">
            Order Confirmed
          </span>
        )
      case "Preparing Artwork":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-500 border border-amber-900/60">
            Preparing Artwork
          </span>
        )
      case "Printing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950/60 text-blue-400 border border-blue-900/60">
            Printing
          </span>
        )
      case "Quality Check & Packing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-950/60 text-yellow-400 border border-yellow-900/60">
            Quality Check & Packing
          </span>
        )
      case "Shipped":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950/60 text-cyan-400 border border-cyan-900/60">
            Shipped
          </span>
        )
      case "Out for Delivery":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-950/60 text-indigo-400 border border-indigo-900/60">
            Out for Delivery
          </span>
        )
      case "Delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
            Delivered
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Production
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Live queue, artwork inspection, print fulfillment stages, and tracking manifests.
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-normal self-start sm:self-auto">
          {sortOrder === "oldest" ? "Oldest orders first" : "Newest orders first"}
        </span>
      </div>

      {/* KPI Cards (All 8 Stages in Responsive Grid with Live Order Counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {kpis.map((kpi) => {
          const isActive = stageFilter === kpi.stageKey
          return (
            <button
              key={kpi.label}
              type="button"
              onClick={() => {
                setStageFilter(isActive ? "All stages" : kpi.stageKey)
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 rounded-md border text-center transition-all cursor-pointer ${
                isActive
                  ? "bg-secondary/70 border-primary/50 ring-1 ring-primary/40 shadow-sm"
                  : "bg-card border-border/80 hover:bg-secondary/60 hover:border-primary/40"
              }`}
            >
              <span className="text-[11px] text-muted-foreground font-normal truncate max-w-full">
                {kpi.label}
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                {kpi.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Filter Section: Search and Filters in a SINGLE ROW */}
      <div className="flex flex-col md:flex-row gap-3 items-center w-full">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order no. or email"
            className="w-full rounded-md border border-border/80 bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
          />
        </div>

        {/* Stage Filter Dropdown */}
        <div className="relative w-full md:w-64 shrink-0">
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="w-full appearance-none rounded-md border border-border/80 bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer pr-10"
          >
            <option value="All stages">All stages</option>
            <option value="All active stages">All active stages</option>
            <option value="Order Received">Order Received</option>
            <option value="Order Confirmed">Order Confirmed</option>
            <option value="Preparing Artwork">Preparing Artwork</option>
            <option value="Printing">Printing</option>
            <option value="Quality Check & Packing">Quality Check & Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
        </div>

        {/* Sort Order Filter Dropdown */}
        <div className="relative w-full md:w-44 shrink-0">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "oldest" | "newest")}
            className="w-full appearance-none rounded-md border border-border/80 bg-card px-3.5 py-2.5 text-sm text-foreground focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer pr-10"
          >
            <option value="oldest">Oldest first</option>
            <option value="newest">Newest first</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
        </div>
      </div>

      {/* Production Queue Table */}
      <div className="rounded-md border border-border/80 bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                <th className="py-3.5 px-4 font-medium">Order</th>
                <th className="py-3.5 px-4 font-medium">Customer</th>
                <th className="py-3.5 px-4 font-medium">Items</th>
                <th className="py-3.5 px-4 font-medium">Paid on</th>
                <th className="py-3.5 px-4 font-medium">Stage</th>
                <th className="py-3.5 px-4 font-medium">Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 px-4 text-center text-xs text-muted-foreground">
                    No production orders found matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/dashboard/production/${order.cleanId}`)}
                    className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium text-foreground group-hover:text-primary transition-colors">
                      {order.id}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {order.customer?.email || ""}
                    </td>
                    <td className="py-3.5 px-4 text-foreground/90 font-mono">
                      {order.itemsCount}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {order.paidOn}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStageBadge(order.stage)}
                    </td>
                    <td className="py-3.5 px-4">
                      {order.flag === "File replaced" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-500 border border-amber-800/80">
                          File replaced
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
