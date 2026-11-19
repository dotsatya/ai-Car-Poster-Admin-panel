"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react"
import {
  StaffMember,
  StaffRole,
  ROLE_ACCESS_SUMMARY,
  mergeStaffMembers,
} from "@/lib/demoStaff"

interface StaffDetailCardProps {
  staff: StaffMember
}

const AVAILABLE_ROLES: StaffRole[] = [
  "Full administrator",
  "Order staff",
  "Production staff",
]

export function StaffDetailCard({ staff: initialStaff }: StaffDetailCardProps) {
  const [staff, setStaff] = React.useState<StaffMember>(initialStaff)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  // Full name inline editing state
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [tempName, setTempName] = React.useState(initialStaff.name)

  // Phone inline editing state
  const [isEditingPhone, setIsEditingPhone] = React.useState(false)
  const [tempPhone, setTempPhone] = React.useState(
    initialStaff.phone || "+1 (555) 000-0000"
  )

  // Role selection state
  const initialRole = (
    AVAILABLE_ROLES.includes(initialStaff.role as StaffRole)
      ? initialStaff.role
      : "Full administrator"
  ) as StaffRole

  const [savedRole, setSavedRole] = React.useState<StaffRole>(initialRole)
  const [selectedRole, setSelectedRole] = React.useState<StaffRole>(initialRole)

  // Deactivate confirmation dialog state
  const [showDeactivateDialog, setShowDeactivateDialog] = React.useState(false)

  // Load persisted updates from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("staff_members_store")
      if (stored) {
        const merged = mergeStaffMembers(stored)
        const found = merged.find(
          (s) => s.cleanId === initialStaff.cleanId || s.id === initialStaff.id
        )
        if (found) {
          setStaff(found)
          setTempName(found.name)
          setTempPhone(found.phone || "+1 (555) 000-0000")
          const currentRole = (
            AVAILABLE_ROLES.includes(found.role as StaffRole)
              ? found.role
              : "Full administrator"
          ) as StaffRole
          setSavedRole(currentRole)
          setSelectedRole(currentRole)
        }
      }
    } catch {
      // ignore
    }
  }, [initialStaff.cleanId, initialStaff.id])

  // Save changes to localStorage
  const persistStaffUpdate = (updated: StaffMember) => {
    setStaff(updated)
    try {
      const stored = localStorage.getItem("staff_members_store")
      const list = mergeStaffMembers(stored)
      const index = list.findIndex(
        (s) => s.cleanId === updated.cleanId || s.id === updated.id
      )
      if (index >= 0) {
        list[index] = updated
      } else {
        list.push(updated)
      }
      localStorage.setItem("staff_members_store", JSON.stringify(list))
    } catch {
      // ignore
    }
  }

  const showNotification = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3500)
  }

  // Name save / cancel
  const handleSaveName = () => {
    if (!tempName.trim()) return
    const updated: StaffMember = { ...staff, name: tempName.trim() }
    persistStaffUpdate(updated)
    setIsEditingName(false)
    showNotification("Full name saved successfully.")
  }

  const handleCancelName = () => {
    setTempName(staff.name)
    setIsEditingName(false)
  }

  // Phone save / cancel
  const handleSavePhone = () => {
    const updated: StaffMember = { ...staff, phone: tempPhone.trim() }
    persistStaffUpdate(updated)
    setIsEditingPhone(false)
    showNotification("Phone number saved successfully.")
  }

  const handleCancelPhone = () => {
    setTempPhone(staff.phone || "+1 (555) 000-0000")
    setIsEditingPhone(false)
  }

  // Role save / cancel
  const handleSaveRole = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
    const newAction = {
      id: `act-${Date.now()}`,
      date: dateStr,
      text: `Role set to ${selectedRole} by Admin`,
    }

    const updated: StaffMember = {
      ...staff,
      role: selectedRole,
      actions: [newAction, ...staff.actions],
    }

    persistStaffUpdate(updated)
    setSavedRole(selectedRole)
    showNotification(`Role updated to "${selectedRole}" and saved.`)
  }

  const handleCancelRole = () => {
    setSelectedRole(savedRole)
  }

  // Deactivate / Reactivate confirmation
  const handleConfirmToggleStatus = () => {
    const newStatus = staff.status === "Active" ? "Deactivated" : "Active"
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
    const newAction = {
      id: `act-${Date.now()}`,
      date: dateStr,
      text: `Account ${newStatus.toLowerCase()} by Admin`,
    }

    const updated: StaffMember = {
      ...staff,
      status: newStatus,
      actions: [newAction, ...staff.actions],
    }

    persistStaffUpdate(updated)
    setShowDeactivateDialog(false)
    showNotification(
      `Account ${newStatus === "Active" ? "reactivated" : "deactivated"} successfully.`
    )
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. "Back to Staff & Roles" link */}
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
        <div className="p-3 text-xs bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-md flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-md border border-border/80 bg-card p-4 sm:p-6 lg:p-7 text-card-foreground shadow-sm space-y-6">
        {/* Title: "Edit staff details" with Active/Deactivated badge */}
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Edit staff details
          </h1>

          <div>
            {staff.status === "Active" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border bg-rose-950/70 text-rose-400 border-rose-800/40">
                <span className="size-1.5 rounded-full bg-rose-400" />
                Deactivated
              </span>
            )}
          </div>
        </div>

        {/* 2. Detail fields: Full name, Phone, Email (2 in a row on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
          {/* Full name: click to edit */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground block font-normal truncate">
              Full name
            </label>
            {!isEditingName ? (
              <div
                onClick={() => {
                  setTempName(staff.name)
                  setIsEditingName(true)
                }}
                className="group flex items-center justify-between p-2 sm:p-2.5 rounded-md border border-border/80 bg-[#131418] cursor-pointer hover:border-primary/50 transition-colors"
                title="Click to edit full name"
              >
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {staff.name}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 shrink-0 ml-1">
                  <span>Edit</span>
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative group">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    autoFocus
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3 pr-20 focus:pr-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveName}
                    className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm shadow-red-950/30"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelName}
                    className="rounded-md border border-border/80 bg-card/80 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Phone: click to edit */}
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground block font-normal truncate">
              Phone
            </label>
            {!isEditingPhone ? (
              <div
                onClick={() => {
                  setTempPhone(staff.phone || "+1 (555) 000-0000")
                  setIsEditingPhone(true)
                }}
                className="group flex items-center justify-between p-2 sm:p-2.5 rounded-md border border-border/80 bg-[#131418] cursor-pointer hover:border-primary/50 transition-colors"
                title="Click to edit phone number"
              >
                <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {staff.phone || "+1 (555) 000-0000"}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 shrink-0 ml-1">
                  <span>Edit</span>
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative group">
                  <input
                    type="tel"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    autoFocus
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3 pr-20 focus:pr-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSavePhone}
                    className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm shadow-red-950/30"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPhone}
                    className="rounded-md border border-border/80 bg-card/80 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Email: read-only with note */}
          <div className="space-y-1.5 col-span-2 md:col-span-1">
            <label className="text-xs text-muted-foreground block font-normal truncate">
              Email
            </label>
            <div className="p-2 sm:p-2.5 rounded-md border border-border/60 bg-[#131418]/60 cursor-not-allowed">
              <span className="text-xs sm:text-sm text-muted-foreground truncate block">{staff.email}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/80 mt-1 block">
              Cannot be changed
            </span>
          </div>
        </div>

        {/* 3. Role section: Row of 3 radio buttons & live permissions summary */}
        <div className="pt-2 border-t border-border/60 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Role
          </h3>

          {/* Row of three radio buttons */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-1">
            {AVAILABLE_ROLES.map((r) => (
              <label
                key={r}
                className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <input
                  type="radio"
                  name="staff-role"
                  value={r}
                  checked={selectedRole === r}
                  onChange={() => setSelectedRole(r)}
                  className="size-4 accent-primary cursor-pointer"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>

          {/* Directly below the row: short line listing what the selected role can open */}
          <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-md border border-border/60 leading-relaxed">
            <span className="font-medium text-foreground/90">Can open: </span>
            <span className="text-foreground/80">
              {ROLE_ACCESS_SUMMARY[selectedRole]}
            </span>
          </div>

          {/* 4. Save changes and Cancel buttons for the role */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              disabled={selectedRole === savedRole}
              onClick={handleSaveRole}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Save changes
            </button>
            <button
              type="button"
              disabled={selectedRole === savedRole}
              onClick={handleCancelRole}
              className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* 5. Bottom area, two columns: Deactivate box (left) & Staff action history (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/60">
          {/* Left: Deactivate account box with danger button */}
          <div className="rounded-md border border-border/70 bg-[#141519] p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-foreground text-sm">
                {staff.status === "Active" ? "Deactivate account" : "Reactivate account"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                {staff.status === "Active"
                  ? `${staff.name} can no longer sign in. Past actions stay in the history.`
                  : `${staff.name} will regain access to the staff portal and dashboard.`}
              </p>
            </div>

            <div className="pt-5">
              <button
                type="button"
                onClick={() => setShowDeactivateDialog(true)}
                className={`rounded-md px-3.5 py-2 text-sm font-medium cursor-pointer transition-colors border shadow-sm ${
                  staff.status === "Active"
                    ? "border-rose-900/60 bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300"
                    : "border-emerald-800/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
                }`}
              >
                {staff.status === "Active" ? "Deactivate account" : "Reactivate account"}
              </button>
            </div>
          </div>

          {/* Right: Staff action history list */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Staff action history
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-foreground/90">
              {staff.actions.map((act) => (
                <div key={act.id} className="flex items-start gap-2 leading-relaxed">
                  <span className="font-semibold text-foreground shrink-0">
                    {act.date}
                  </span>
                  <span className="text-muted-foreground font-normal">·</span>
                  <span className="text-foreground/90">{act.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Deactivate / Reactivate */}
      {showDeactivateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-md border border-border/80 bg-[#121316] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-full shrink-0 ${
                  staff.status === "Active"
                    ? "bg-rose-950/60 border border-rose-900/60 text-rose-400"
                    : "bg-emerald-950/60 border border-emerald-900/60 text-emerald-400"
                }`}
              >
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {staff.status === "Active"
                    ? "Deactivate staff account?"
                    : "Reactivate staff account?"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {staff.status === "Active"
                    ? `Are you sure you want to deactivate ${staff.name}'s account? They will immediately lose access to the staff portal and dashboard.`
                    : `Are you sure you want to reactivate ${staff.name}'s account? They will regain access to the staff portal.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateDialog(false)}
                className="rounded-md border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmToggleStatus}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors shadow-sm cursor-pointer border ${
                  staff.status === "Active"
                    ? "border-rose-900/60 bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300"
                    : "border-emerald-800/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
                }`}
              >
                {staff.status === "Active" ? "Confirm Deactivate" : "Confirm Reactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
