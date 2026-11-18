"use client"

import * as React from "react"
import { DEMO_CUSTOMERS } from "@/lib/demoCustomer"
import { CustomerHeader } from "@/components/customers/customer-header"
import { CustomerFilters } from "@/components/customers/customer-filters"
import { CustomerListTable } from "@/components/customers/customer-list-table"

export default function CustomersPage() {
  const [search, setSearch] = React.useState("")
  const [accountFilter, setAccountFilter] = React.useState("all")
  const [sortBy, setSortBy] = React.useState("recent")

  // Filter and sort customers
  const filteredCustomers = React.useMemo(() => {
    return DEMO_CUSTOMERS.filter((cust) => {
      // 1. Search filter
      const q = search.trim().toLowerCase()
      if (q) {
        const matchesName = cust.name.toLowerCase().includes(q)
        const matchesEmail = cust.email.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail) return false
      }

      // 2. Account status filter
      if (accountFilter !== "all") {
        if (cust.account.toLowerCase() !== accountFilter.toLowerCase()) {
          return false
        }
      }

      return true
    }).sort((a, b) => {
      if (sortBy === "posters") return b.posters - a.posters
      if (sortBy === "orders") {
        const aOrd = a.orders ?? a.ordersList?.length ?? 0
        const bOrd = b.orders ?? b.ordersList?.length ?? 0
        return bOrd - aOrd
      }
      return 0 // default order matching the mock dataset
    })
  }, [search, accountFilter, sortBy])

  // Export filtered customers as clean CSV
  function handleExportCSV() {
    const headers = ["Customer", "Email", "Account", "Posters", "Orders", "Joined"]
    const rows = filteredCustomers.map(
      (c) =>
        `"${c.name}","${c.email}","${c.account}",${c.posters},${c.orders ?? c.ordersList?.length ?? 0},"${c.joined}"`
    )
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `poster_gen_customers_${new Date().toISOString().slice(0, 10)}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <CustomerHeader onExportCSV={handleExportCSV} />

      {/* Filter Bar */}
      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        accountFilter={accountFilter}
        onAccountFilterChange={setAccountFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Customer List Table & Pagination */}
      <CustomerListTable customers={filteredCustomers} />
    </div>
  )
}
