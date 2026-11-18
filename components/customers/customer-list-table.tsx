"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { DemoCustomer } from "@/lib/demoCustomer"

interface CustomerListTableProps {
  customers: DemoCustomer[]
}

const PAGE_SIZE = 10

export function CustomerListTable({ customers }: CustomerListTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = React.useState(1)

  // Reset page when customer list changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [customers.length])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE))
  const validPage = Math.min(currentPage, totalPages)
  const startIndex = (validPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, customers.length)
  const paginatedCustomers = customers.slice(startIndex, endIndex)

  return (
    <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/40 text-xs font-medium text-muted-foreground">
              <th className="pb-3.5 font-medium">Customer</th>
              <th className="pb-3.5 font-medium">Account</th>
              <th className="pb-3.5 font-medium">Posters</th>
              <th className="pb-3.5 font-medium">Orders</th>
              <th className="pb-3.5 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                  No customers found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => router.push(`/dashboard/customers/${cust.cleanId}`)}
                  className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  {/* Customer column: Name & Email */}
                  <td className="py-3.5 font-medium text-foreground group-hover:text-primary transition-colors">
                    <div>{cust.name}</div>
                    <div className="text-xs text-muted-foreground font-normal mt-0.5 group-hover:text-foreground/90 transition-colors">
                      {cust.email}
                    </div>
                  </td>

                  {/* Account Status Badge */}
                  <td className="py-3.5">
                    {cust.account === "Active" ? (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-rose-950/70 text-rose-400 border-rose-800/40">
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* Posters Count */}
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {cust.posters}
                  </td>

                  {/* Orders Count */}
                  <td className="py-3.5 font-semibold text-foreground text-sm">
                    {cust.orders ?? cust.ordersList?.length ?? 0}
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 font-normal text-muted-foreground text-sm">
                    {cust.joined}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination matching mockup: Previous · 1 · 2 · 3 · Next */}
      <div className="mt-5 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>
          Showing {customers.length === 0 ? 0 : startIndex + 1} to {endIndex} of {customers.length} customers
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
