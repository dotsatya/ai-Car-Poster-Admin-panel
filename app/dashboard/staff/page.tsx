"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Mail, Pencil } from "lucide-react"
import { DEMO_STAFF, mergeStaffMembers, StaffMember } from "@/lib/demoStaff"

export default function StaffPage() {
  const router = useRouter()
  const [staff, setStaff] = React.useState<StaffMember[]>(DEMO_STAFF)

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("staff_members_store")
      if (stored) {
        setStaff(mergeStaffMembers(stored))
      }
    } catch {
      // ignore
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Staff & Roles
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Manage staff credentials, designer permissions, and system roles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/staff/${staff[0]?.cleanId || "amit-paul"}`)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Plus className="size-4" /> Add Team Member
        </button>
      </div>

      <div className="rounded-md border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                <th className="py-3.5 px-4 font-medium whitespace-nowrap">Team Member</th>
                <th className="py-3.5 px-4 font-medium whitespace-nowrap">Role</th>
                <th className="py-3.5 px-4 font-medium whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 font-medium whitespace-nowrap">Last sign in</th>
                <th className="py-3.5 px-4 font-medium text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {staff.map((member) => (
                <tr
                  key={member.email}
                  onClick={() => router.push(`/dashboard/staff/${member.cleanId}`)}
                  className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </p>
                    <p className="text-xs font-normal text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="size-3 text-muted-foreground/70" /> {member.email}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="rounded-md bg-secondary border border-border/60 px-2 py-0.5 text-xs font-medium text-foreground/90">
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {member.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <span className="size-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
                        <span className="size-1.5 rounded-full bg-rose-400" />
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-semibold text-foreground text-sm">
                      {member.lastSignIn}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/dashboard/staff/${member.cleanId}`)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary text-foreground text-xs font-medium px-3 py-1.5 transition-all shadow-sm group-hover:border-primary/40 cursor-pointer"
                      title={`Edit permissions and details for ${member.name}`}
                    >
                      <Pencil className="size-3 text-muted-foreground" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

