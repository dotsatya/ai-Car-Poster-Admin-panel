"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DemoOrder } from "@/lib/demoOrder"

interface OrderListTableProps {
  orders: DemoOrder[]
  totalCount?: number
}

const PAGE_SIZE = 10

export function OrderListTable({ orders }: OrderListTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = React.useState(1)

  // Reset to page 1 whenever the filtered orders list length changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [orders.length])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const validPage = Math.min(currentPage, totalPages)
  const startIndex = (validPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, orders.length)
  const paginatedOrders = orders.slice(startIndex, endIndex)

  // Payment badge styles
  const getPaymentBadge = (payment: DemoOrder["payment"]["status"]) => {
    switch (payment) {
      case "Paid":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
      case "Pending":
        return "bg-amber-950/60 text-amber-400 border-amber-800/40"
      case "Refunded":
        return "bg-rose-950/60 text-rose-400 border-rose-800/40"
      case "Cancelled":
        return "bg-zinc-800/60 text-zinc-400 border-zinc-700/40"
    }
  }

  // Stage badge styles
  const getStageBadge = (stage: DemoOrder["stage"]) => {
    switch (stage) {
      case "Printing":
      case "Painting":
        return "bg-blue-950/70 text-blue-400 border-blue-800/40"
      case "Shipped":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40"
      case "Received":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40"
      case "Packing":
        return "bg-purple-950/70 text-purple-400 border-purple-800/40"
      case "Delivered":
        return "bg-teal-950/70 text-teal-400 border-teal-800/40"
      case "None":
        return null
    }
  }

  return (
    <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 text-xs font-medium text-muted-foreground">
              <th className="pb-3.5 font-medium">Order</th>
              <th className="pb-3.5 font-medium">Customer</th>
              <th className="pb-3.5 font-medium">Items</th>
              <th className="pb-3.5 font-medium">Total</th>
              <th className="pb-3.5 font-medium">Payment</th>
              <th className="pb-3.5 font-medium">Stage</th>
              <th className="pb-3.5 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-muted-foreground">
                  No orders match your current filters.
                </td>
              </tr>
            ) : (
              paginatedOrders.map((ord) => {
                const stageBadge = getStageBadge(ord.stage)
                return (
                  <tr
                    key={ord.id}
                    onClick={() => router.push(`/dashboard/orders/${ord.cleanId}`)}
                    className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 font-medium text-foreground group-hover:text-primary transition-colors">
                      {ord.id}
                    </td>
                    <td className="py-3.5 font-normal text-muted-foreground group-hover:text-foreground/90 transition-colors">
                      {ord.customer.email}
                    </td>
                    <td className="py-3.5 font-medium text-foreground">
                      {ord.items.length}
                    </td>
                    <td className="py-3.5 font-semibold text-foreground">
                      {ord.total}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getPaymentBadge(
                          ord.payment.status
                        )}`}
                      >
                        {ord.payment.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      {stageBadge ? (
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${stageBadge}`}
                        >
                          {ord.stage}
                        </span>
                      ) : (
                        <span className="text-sm font-normal text-muted-foreground">
                          None
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 font-normal text-muted-foreground text-sm">
                      {ord.date}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination: Showing 10 orders per page */}
      <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Showing {orders.length === 0 ? 0 : startIndex + 1} to {endIndex} of {orders.length} orders
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={validPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 rounded-md hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum, idx) => (
              <React.Fragment key={pageNum}>
                {idx > 0 && <span className="text-muted-foreground/60 select-none">·</span>}
                <button
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-0.5 rounded-md hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer ${
                    validPage === pageNum
                      ? "font-semibold text-foreground underline underline-offset-4"
                      : "text-muted-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            disabled={validPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 rounded-md hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
