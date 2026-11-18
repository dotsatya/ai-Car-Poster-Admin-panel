"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, AlertCircle, Package, WandSparkles, ArrowRight, ArrowUpRight } from "lucide-react"
import { DemoCustomer } from "@/lib/demoCustomer"

interface CustomerDetailCardProps {
  customer: DemoCustomer
}

export function CustomerDetailCard({ customer }: CustomerDetailCardProps) {
  const router = useRouter()
  const [accountStatus, setAccountStatus] = React.useState<"Active" | "Disabled">(
    customer.account
  )
  const [reason, setReason] = React.useState("")
  const [actionHistory, setActionHistory] = React.useState(customer.actions)
  const [feedbackMsg, setFeedbackMsg] = React.useState<string | null>(null)

  function handleToggleAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!reason.trim()) {
      alert("Please provide a reason to update the account status.")
      return
    }

    const newStatus = accountStatus === "Active" ? "Disabled" : "Active"
    const newAction = {
      id: `act-${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      actor: "Riya (admin)",
      action: (newStatus === "Active" ? "Enabled" : "Disabled") as "Enabled" | "Disabled",
      reason: reason.trim(),
    }

    setAccountStatus(newStatus)
    setActionHistory([newAction, ...actionHistory])
    setReason("")
    setFeedbackMsg(`Account has been ${newStatus.toLowerCase()}.`)
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  // Limit display to max 5 latest AI generations and 5 latest orders
  const displayedGenerations = React.useMemo(
    () => customer.generations.slice(0, 5),
    [customer.generations]
  )
  const displayedOrders = React.useMemo(
    () => customer.ordersList.slice(0, 5),
    [customer.ordersList]
  )

  // Payment badge styles
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40"
      case "Pending":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40"
      case "Refunded":
        return "bg-rose-950/70 text-rose-400 border-rose-800/40"
      default:
        return "bg-zinc-800/70 text-zinc-400 border-zinc-700/40"
    }
  }

  // Stage badge styles
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "Order Received":
      case "Received":
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60"
      case "Order Confirmed":
      case "Order confirmed and logged":
        return "bg-violet-950/70 text-violet-400 border-violet-800/40"
      case "Preparing Artwork":
      case "Painting":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40"
      case "Printing":
        return "bg-blue-950/70 text-blue-400 border-blue-800/40"
      case "Quality Check & Packing":
      case "Packing":
        return "bg-yellow-950/70 text-yellow-400 border-yellow-800/40"
      case "Shipped":
        return "bg-cyan-950/70 text-cyan-400 border-cyan-800/40"
      case "Out for Delivery":
        return "bg-indigo-950/70 text-indigo-400 border-indigo-800/40"
      case "Delivered":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40"
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60"
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-5xl">
      {/* Back to customers navigation */}
      <div>
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to customers</span>
        </Link>
      </div>

      {/* Main Customer Detail Card */}
      <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {customer.email}
            </h1>
            <div className="flex items-center gap-2">
              {customer.verified ? (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                  Verified
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-zinc-800/70 text-zinc-400 border-zinc-700/40">
                  Unverified
                </span>
              )}

              {accountStatus === "Active" ? (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                  Active
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-rose-950/70 text-rose-400 border-rose-800/40">
                  Disabled
                </span>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/dashboard/orders?search=${encodeURIComponent(customer.email)}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary text-foreground text-xs font-medium px-3 py-1.5 transition-colors shadow-sm"
              title="View all orders for this customer"
            >
              <Package className="size-3.5 text-muted-foreground" />
              <span>View All Order History</span>
              <ArrowUpRight className="size-3 text-muted-foreground/80" />
            </Link>

            <Link
              href={`/dashboard/ai-generations?search=${encodeURIComponent(customer.email)}`}
              className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary text-foreground text-xs font-medium px-3 py-1.5 transition-colors shadow-sm"
              title="View all AI generations for this customer"
            >
              <WandSparkles className="size-3.5 text-muted-foreground" />
              <span>View All Generations</span>
              <ArrowUpRight className="size-3 text-muted-foreground/80" />
            </Link>
          </div>
        </div>

        {/* 4 Stat / KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-md border border-border/60 bg-secondary/30 p-4">
            <span className="text-xs font-normal text-muted-foreground block">
              Posters generated
            </span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              {customer.posters}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-secondary/30 p-4">
            <span className="text-xs font-normal text-muted-foreground block">
              Combined used
            </span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              {customer.combinedUsed}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-secondary/30 p-4">
            <span className="text-xs font-normal text-muted-foreground block">
              Failed jobs
            </span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              {customer.failedJobs}
            </div>
          </div>

          <div className="rounded-md border border-border/60 bg-secondary/30 p-4">
            <span className="text-xs font-normal text-muted-foreground block">
              Total spent
            </span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              {customer.totalSpent}
            </div>
          </div>
        </div>

        {/* Metadata Row: Joined, Last sign in, Generation allowance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block">
              Joined
            </span>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {customer.joinedFull}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block">
              Last sign in
            </span>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {customer.lastSignIn}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block">
              Generation allowance
            </span>
            <p className="text-sm font-semibold text-foreground leading-tight">
              {customer.generationAllowance.used} of {customer.generationAllowance.total} used
            </p>
          </div>
        </div>

        {/* Recent generations Section (Max 5 Latest) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal text-muted-foreground block">
                Recent generations
              </span>
              <span className="text-xs text-muted-foreground">
                (Latest {displayedGenerations.length} of {customer.generations.length})
              </span>
            </div>
            <Link
              href={`/dashboard/ai-generations?search=${encodeURIComponent(customer.email)}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              <span>View All Generations</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                  <th className="py-3.5 px-4 font-medium">Date</th>
                  <th className="py-3.5 px-4 font-medium">Templates</th>
                  <th className="py-3.5 px-4 font-medium">Type</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {displayedGenerations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 px-4 text-center text-xs text-muted-foreground">
                      No generations recorded yet.
                    </td>
                  </tr>
                ) : (
                  displayedGenerations.map((gen) => (
                    <tr
                      key={gen.id}
                      onClick={() => {
                        if (gen.jobId) {
                          router.push(`/dashboard/ai-generations/${gen.jobId}`)
                        }
                      }}
                      className={`transition-colors ${
                        gen.jobId
                          ? "hover:bg-secondary/40 cursor-pointer"
                          : "hover:bg-secondary/20"
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {gen.date}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground text-sm">
                        {gen.template}
                      </td>
                      <td className="py-3.5 px-4 font-normal text-muted-foreground text-sm">
                        {gen.type}
                      </td>
                      <td className="py-3.5 px-4">
                        {gen.status === "Completed" ? (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                            Completed
                          </span>
                        ) : gen.status === "Processing" ? (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-amber-950/70 text-amber-400 border-amber-800/40">
                            Processing
                          </span>
                        ) : gen.status === "Queued" ? (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-zinc-800/70 text-zinc-300 border-zinc-700/40">
                            Queued
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-rose-950/70 text-rose-400 border-rose-800/40">
                            Failed
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

        {/* Order history Section (Max 5 Latest) */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal text-muted-foreground block">
                Order history
              </span>
              <span className="text-xs text-muted-foreground">
                (Latest {displayedOrders.length} of {customer.ordersList.length} {customer.ordersList.length === 1 ? "order" : "orders"})
              </span>
            </div>
            <Link
              href={`/dashboard/orders?search=${encodeURIComponent(customer.email)}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              <span>View All Order History</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                  <th className="py-3.5 px-4 font-medium">Order</th>
                  <th className="py-3.5 px-4 font-medium">Items</th>
                  <th className="py-3.5 px-4 font-medium">Total</th>
                  <th className="py-3.5 px-4 font-medium">Payment</th>
                  <th className="py-3.5 px-4 font-medium">Stage</th>
                  <th className="py-3.5 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {displayedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 px-4 text-center text-xs text-muted-foreground">
                      No order history recorded for this customer.
                    </td>
                  </tr>
                ) : (
                  displayedOrders.map((ord) => {
                    const stageBadge = getStageBadge(ord.stage)
                    return (
                      <tr
                        key={ord.id}
                        onClick={() => router.push(`/dashboard/orders/${ord.cleanId}`)}
                        className="hover:bg-secondary/20 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                          {ord.id}
                        </td>
                        <td className="py-3.5 px-4 font-normal text-foreground text-sm">
                          {ord.itemsCount} {ord.itemsCount === 1 ? "item" : "items"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                          {ord.total}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getPaymentBadge(
                              ord.payment
                            )}`}
                          >
                            {ord.payment}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
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
                        <td className="py-3.5 px-4 font-normal text-muted-foreground text-sm">
                          {ord.date}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section: Disable/Enable Account (left) and Action history (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/40">
          {/* Disable / Enable Account form */}
          <div className="rounded-md border border-border/80 bg-secondary/10 p-4 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {accountStatus === "Active" ? "Disable account" : "Enable account"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {accountStatus === "Active"
                  ? "The customer cannot sign in or generate artwork."
                  : "Restore customer access to sign in and generate artwork."}
              </p>
            </div>

            <form onSubmit={handleToggleAccount} className="space-y-3">
              <textarea
                rows={3}
                placeholder="Reason (required)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-background/60 p-3 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-y"
              />

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className={`rounded-md border px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer shadow-sm ${
                    accountStatus === "Active"
                      ? "border-rose-900/60 bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300"
                      : "border-emerald-800/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
                  }`}
                >
                  {accountStatus === "Active" ? "Disable account" : "Enable account"}
                </button>

                {feedbackMsg ? (
                  <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
                    <Check className="size-3.5" /> {feedbackMsg}
                  </span>
                ) : null}
              </div>
            </form>
          </div>

          {/* Action history */}
          <div className="space-y-2">
            <span className="text-xs font-normal text-muted-foreground block mb-2">
              Action history
            </span>
            <div className="space-y-2.5">
              {actionHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No administrative actions taken on this account.
                </p>
              ) : (
                actionHistory.map((act) => (
                  <div key={act.id} className="text-sm leading-relaxed">
                    <span className="font-semibold text-foreground">{act.date}</span>
                    <span className="text-muted-foreground/80"> · </span>
                    <span className="text-muted-foreground">
                      {act.action} by {act.actor}
                    </span>
                    <span className="text-muted-foreground/80"> · </span>
                    <span className="text-foreground/90 font-medium italic">
                      &quot;{act.reason}&quot;
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
