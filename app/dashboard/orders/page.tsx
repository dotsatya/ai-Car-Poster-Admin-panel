"use client"

import * as React from "react"
import { DEMO_ORDERS } from "@/lib/demoOrder"
import { OrderHeader } from "@/components/orders/order-header"
import { OrderFilters } from "@/components/orders/order-filters"
import { OrderListTable } from "@/components/orders/order-list-table"

export default function OrdersPage() {
  const [search, setSearch] = React.useState("")
  const [paymentFilter, setPaymentFilter] = React.useState("all")
  const [stageFilter, setStageFilter] = React.useState("all")
  const [dateFilter, setDateFilter] = React.useState("30d")
  const [customStart, setCustomStart] = React.useState("")
  const [customEnd, setCustomEnd] = React.useState("")

  // Filtered orders list based on demo orders
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

      // 3. Stage filter: received, painting, packing, shipped, delivered
      if (stageFilter !== "all") {
        const filterVal = stageFilter.toLowerCase()
        const orderStage = order.stage.toLowerCase()

        // Match "painting" or "printing" interchangeably
        if (filterVal === "painting" || filterVal === "printing") {
          if (orderStage !== "printing" && orderStage !== "painting") return false
        } else if (orderStage !== filterVal) {
          return false
        }
      }

      // 4. Date range filter: last 30 days, last 7 days, custom range
      if (dateFilter === "7d") {
        if (order.daysAgo > 7) return false
      } else if (dateFilter === "30d") {
        if (order.daysAgo > 30) return false
      }

      return true
    })
  }, [search, paymentFilter, stageFilter, dateFilter])

  // Export filtered orders as clean CSV
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
    link.setAttribute(
      "download",
      `poster_gen_orders_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Standard Page Header matching other dashboard pages */}
      <OrderHeader onExportCSV={handleExportCSV} />

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
      <OrderListTable orders={filteredOrders} totalCount={356} />
    </div>
  )
}
