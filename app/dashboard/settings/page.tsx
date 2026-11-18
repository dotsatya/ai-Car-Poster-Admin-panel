"use client"

import * as React from "react"
import { useAuth } from "@/context/auth-context"
import { User, Bell, Lock, Save, CheckCircle2 } from "lucide-react"

export default function AccountSettingsPage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = React.useState(user?.name || "Alexander Drake")
  const [email, setEmail] = React.useState(user?.email || "admin1@gmail.com")
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      if (user.name && user.name !== "Poster Gen Admin") {
        setName(user.name)
      } else {
        setName("Alexander Drake")
      }
      setEmail(user.email || "admin1@gmail.com")
    }
  }, [user])

  const handleSave = () => {
    updateUser({
      name: name.trim() || "Alexander Drake",
      email: email.trim() || "admin1@gmail.com",
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3500)
  }

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
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Save className="size-4" /> Save Preferences
        </button>
      </div>

      {saved && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Preferences and user profile saved successfully.</span>
        </div>
      )}

      <div className="grid gap-6 w-full">
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <User className="size-4 text-primary" />
            <h3 className="font-semibold text-base text-foreground">Profile Information</h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 pt-1">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Lock className="size-4 text-primary" />
            <h3 className="font-semibold text-base text-foreground">Credentials & Two-Factor</h3>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 pt-1">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">Current Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
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
