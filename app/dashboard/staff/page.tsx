import { Plus, ShieldCheck, Mail } from "lucide-react"

export default function StaffPage() {
  const staff = [
    { name: "Alexander Drake", email: "alex@carposters.io", role: "Administrator", status: "Active", permissions: "Full Studio Access" },
    { name: "Elena Santos", email: "elena@carposters.io", role: "Lead Automotive Designer", status: "Active", permissions: "Templates & Typography" },
    { name: "Kenji Sato", email: "kenji@carposters.io", role: "AI Vision Engineer", status: "Active", permissions: "Neural Models & Upscaler" },
    { name: "David Kim", email: "david@carposters.io", role: "Print Master", status: "Active", permissions: "Fulfillment & Materials" },
  ]

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
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors">
          <Plus className="size-4" /> Add Team Member
        </button>
      </div>

      <div className="rounded-md border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-muted-foreground text-left">
              <tr>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Team Member</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Role</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Permissions</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Status</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {staff.map((member) => (
                <tr key={member.email} className="hover:bg-secondary/40 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-xs font-normal text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <Mail className="size-3 text-muted-foreground/70" /> {member.email}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="rounded-md bg-secondary border border-border/60 px-2 py-0.5 text-xs font-medium text-foreground/90">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground flex items-center gap-1.5 pt-5">
                    <ShieldCheck className="size-4 text-primary" />
                    <span className="text-xs font-normal text-foreground/80">{member.permissions}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-xs text-primary font-medium hover:underline">
                      Edit Permissions
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
