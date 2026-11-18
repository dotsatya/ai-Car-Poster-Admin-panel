import { User, Bell, Lock, Save } from "lucide-react"

export default function AccountSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Account Settings
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Manage your administrator profile, authentication credentials, and notifications.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors">
          <Save className="size-4" /> Save Preferences
        </button>
      </div>

      <div className="grid gap-6 w-full">
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <User className="size-4 text-primary" />
            <h3 className="font-semibold text-base text-foreground">Profile Information</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Full Name</label>
              <input
                defaultValue="Alexander Drake"
                className="mt-1.5 w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Email Address</label>
              <input
                defaultValue="admin1@gmail.com"
                className="mt-1.5 w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Lock className="size-4 text-primary" />
            <h3 className="font-semibold text-base text-foreground">Credentials & Two-Factor</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="mt-1.5 w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Bell className="size-4 text-primary" />
            <h3 className="font-semibold text-base text-foreground">Notifications</h3>
          </div>
          <div className="space-y-3">
            {[
              { title: "Customer placed a new poster print order", desc: "Push notification when order enters pre-flight inspection" },
              { title: "Generative model latency or 8K failure", desc: "Immediate alert if TensorRT pipeline experiences timeout" },
              { title: "Archival cotton rag roll low inventory", desc: "Notify when 310 GSM substrate drops under 20% capacity" },
            ].map((pref, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer p-2 rounded-md hover:bg-secondary/40 transition-colors">
                <input type="checkbox" defaultChecked className="mt-1 rounded accent-[#d83138] size-4" />
                <div>
                  <p className="text-sm font-medium text-foreground">{pref.title}</p>
                  <p className="text-xs font-normal text-muted-foreground">{pref.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
