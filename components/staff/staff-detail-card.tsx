"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { StaffMember, PERMISSIONS_MATRIX, StaffRole } from "@/lib/demoStaff"

interface StaffDetailCardProps {
  staff: StaffMember
}

export function StaffDetailCard({ staff: initialStaff }: StaffDetailCardProps) {
  const [name, setName] = React.useState(initialStaff.name)
  const [email, setEmail] = React.useState(initialStaff.email)
  const [phone, setPhone] = React.useState(initialStaff.phone || "+1 (555) 234-5678")
  const [role, setRole] = React.useState(initialStaff.role)
  const [status, setStatus] = React.useState<"Active" | "Deactivated">(
    initialStaff.status
  )
  const [actions, setActions] = React.useState(initialStaff.actions)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  const firstName = name.split(" ")[0] || "User"

  function handleToggleStatus() {
    const newStatus = status === "Active" ? "Deactivated" : "Active"
    const newAction = {
      id: `act-${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      text:
        newStatus === "Deactivated"
          ? `Account deactivated by Riya`
          : `Account reactivated by Riya`,
    }
    setStatus(newStatus)
    setActions((prev) => [newAction, ...prev])
    setFeedback(`Staff member account ${newStatus.toLowerCase()}.`)
    setTimeout(() => setFeedback(null), 3000)
  }

  function handleRoleChange(newRole: string) {
    setRole(newRole)
    const newAction = {
      id: `act-${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      text: `Role set to ${newRole} by Riya`,
    }
    setActions((prev) => [newAction, ...prev])
  }

  return (
    <div className="flex flex-col gap-4 max-w-5xl">
      {/* Back to Staff & Roles navigation */}
      <div>
        <Link
          href="/dashboard/staff"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Staff & Roles</span>
        </Link>
      </div>

      {feedback && (
        <div className="p-3 text-xs bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-md">
          {feedback}
        </div>
      )}

      {/* Main Staff Detail Card matching mockup */}
      <div className="rounded-md border border-border/80 bg-card p-6 sm:p-7 text-card-foreground shadow-sm space-y-6">
        {/* Header Row: Edit: {Name} and Status Badge */}
        <div className="flex items-center justify-between pb-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Edit: {name}
          </h1>

          <div>
            {status === "Active" ? (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                Active
              </span>
            ) : (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-rose-950/70 text-rose-400 border-rose-800/40">
                Deactivated
              </span>
            )}
          </div>
        </div>

        {/* 4-Column Form Fields: Full name, Email, Phone number, Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Full name */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          {/* Email (used to sign in) */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
              Email (used to sign in)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
              Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-9 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
              >
                <option value="Production staff" className="bg-[#121315] text-foreground">
                  Production staff
                </option>
                <option value="Order staff" className="bg-[#121315] text-foreground">
                  Order staff
                </option>
                <option value="Full administrator" className="bg-[#121315] text-foreground">
                  Full administrator
                </option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
            </div>
          </div>
        </div>

        {/* Permissions Table Section: What this role can open */}
        <div className="pt-2">
          <span className="text-xs text-muted-foreground block mb-3 font-normal">
            What this role can open
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs font-normal text-muted-foreground">
                  <th className="pb-2.5 font-normal">Page</th>
                  <th className="pb-2.5 font-normal">Full administrator</th>
                  <th className="pb-2.5 font-normal">Order staff</th>
                  <th className="pb-2.5 font-normal">Production staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {PERMISSIONS_MATRIX.map((row) => (
                  <tr key={row.page} className="hover:bg-secondary/20 transition-colors">
                    {/* Page Name */}
                    <td className="py-3 font-semibold text-foreground text-sm">
                      {row.page}
                    </td>

                    {/* Full administrator */}
                    <td className="py-3">
                      <span
                        className={
                          row.fullAdmin === "No"
                            ? "text-muted-foreground font-normal text-sm"
                            : "text-emerald-400 font-medium text-sm"
                        }
                      >
                        {row.fullAdmin}
                      </span>
                    </td>

                    {/* Order staff */}
                    <td className="py-3">
                      <span
                        className={
                          row.orderStaff === "No"
                            ? "text-muted-foreground font-normal text-sm"
                            : "text-emerald-400 font-medium text-sm"
                        }
                      >
                        {row.orderStaff}
                      </span>
                    </td>

                    {/* Production staff */}
                    <td className="py-3">
                      <span
                        className={
                          row.productionStaff === "No"
                            ? "text-muted-foreground font-normal text-sm"
                            : "text-emerald-400 font-medium text-sm"
                        }
                      >
                        {row.productionStaff}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section (2 Columns): Deactivate Box & Staff action history */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Deactivate / Reactivate account box */}
          <div className="rounded-md border border-border/70 bg-[#141519] p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                {status === "Active" ? "Deactivate account" : "Reactivate account"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {status === "Active"
                  ? `${firstName} can no longer sign in. Past actions stay in the history.`
                  : `${firstName} will regain access to the staff portal and dashboard.`}
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border ${
                  status === "Active"
                    ? "border-rose-900/60 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40"
                    : "border-emerald-800/60 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40"
                }`}
              >
                {status === "Active" ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </div>

          {/* Staff action history */}
          <div>
            <span className="text-xs text-muted-foreground block mb-2 font-normal">
              Staff action history
            </span>
            <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-foreground">
              {actions.map((act) => (
                <div key={act.id} className="flex items-center gap-1.5">
                  <span>{act.date}</span>
                  <span className="text-muted-foreground font-normal">·</span>
                  <span>{act.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
