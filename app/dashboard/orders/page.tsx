"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { DEMO_ORDERS } from "@/lib/demoOrder"
import { OrderHeader } from "@/components/orders/order-header"
import { OrderFilters } from "@/components/orders/order-filters"
import { OrderListTable } from "@/components/orders/order-list-table"

function OrdersContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("search") || searchParams.get("q") || searchParams.get("email") || ""

  const [search, setSearch] = React.useState(initialQuery)
  const [paymentFilter, setPaymentFilter] = React.useState("all")
  const [stageFilter, setStageFilter] = React.useState("all")
  const [dateFilter, setDateFilter] = React.useState(initialQuery ? "1y" : "30d")
  const [customStart, setCustomStart] = React.useState("")
  const [customEnd, setCustomEnd] = React.useState("")

  // React to updates from URL search params (e.g., clicking View All Order History)
  React.useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("q") || searchParams.get("email")
    if (q !== null && q !== undefined) {
      setSearch(q)
      setDateFilter("1y")
    }
  }, [searchParams])

  // Filtered orders list based on demo orders & selected filters / time range
  const filteredOrders = React.useMemo(() => {
    return DEMO_ORDERS.filter((order) => {
      // 1. Search filter (order ID, email, or customer name)
      const q = search.trim().toLowerCase()
      if (q) {
        const matchesId = order.id.toLowerCase().includes(q)
        const matchesEmail = order.customer.email.toLowerCase().includes(q)
        const matchesName = order.customer.name.toLowerCase().includes(q)
        if (!matchesId && !matchesEmail && !matchesName) return false
      }

      // 2. Payment status filter: paid, pending, refunded, cancelled
      if (paymentFilter !== "all") {
        if (order.payment.status.toLowerCase() !== paymentFilter.toLowerCase()) {
          return false
        }
      }

      // 3. Stage filter
      if (stageFilter !== "all") {
        const filterVal = stageFilter.toLowerCase()
        const orderStage = order.stage.toLowerCase()

        if (filterVal.includes("received") && orderStage.includes("received")) {
          // match
        } else if (filterVal.includes("preparing") && (orderStage.includes("preparing") || orderStage.includes("painting"))) {
          // match
        } else if (filterVal.includes("packing") && (orderStage.includes("packing") || orderStage.includes("quality check"))) {
          // match
        } else if (orderStage !== filterVal) {
          return false
        }
      }

      // 4. Date range filter: 1w (7d), 30d, 6m, 1y, custom range
      if (dateFilter === "1w" || dateFilter === "7d") {
        if (order.daysAgo > 7) return false
      } else if (dateFilter === "30d") {
        if (order.daysAgo > 30) return false
      } else if (dateFilter === "6m") {
        if (order.daysAgo > 180) return false
      } else if (dateFilter === "1y") {
        if (order.daysAgo > 365) return false
      } else if (dateFilter === "custom") {
        if (customStart) {
          const start = new Date(customStart).getTime()
          const orderDate = new Date(order.date).getTime()
          if (!isNaN(start) && !isNaN(orderDate) && orderDate < start) return false
        }
        if (customEnd) {
          const end = new Date(customEnd).getTime() + 86400000 // include the whole end day
          const orderDate = new Date(order.date).getTime()
          if (!isNaN(end) && !isNaN(orderDate) && orderDate > end) return false
        }
      }

      return true
    })
  }, [search, paymentFilter, stageFilter, dateFilter, customStart, customEnd])

  // Export filtered orders as clean CSV matching the selected time range
  function handleExportCSV() {
    const headers = ["Order", "Customer", "Items", "Total", "Payment", "Stage", "Date"]
    const rows = filteredOrders.map(
      (o) =>
        `"${o.id}","${o.customer.email}",${o.items.length},"${o.total}","${o.payment.status}","${o.stage}","${o.date}"`
    )
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)

    const rangeSlug =
      dateFilter === "1w" || dateFilter === "7d"
        ? "last_week"
        : dateFilter === "30d"
        ? "last_30_days"
        : dateFilter === "6m"
        ? "last_6_months"
        : dateFilter === "1y"
        ? "last_1_year"
        : "filtered"

    link.setAttribute(
      "download",
      `poster_gen_orders_${rangeSlug}_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Standard Page Header with time range selector and CSV export */}
      <OrderHeader
        selectedRange={dateFilter}
        onRangeChange={setDateFilter}
        onExportCSV={handleExportCSV}
      />

      {/* Filter Row */}
      <OrderFilters
        search={search}
        onSearchChange={setSearch}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customStart={customStart}
        onCustomStartChange={setCustomStart}
        customEnd={customEnd}
        onCustomEndChange={setCustomEnd}
      />

      {/* Orders Table & Pagination */}
      <OrderListTable
        orders={filteredOrders}
        totalCount={filteredOrders.length}
      />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <OrdersContent />
    </React.Suspense>
  )
}
