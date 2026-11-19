"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  User,
  Bell,
  Lock,
  Save,
  Check,
  KeyRound,
  AlertCircle,
} from "lucide-react"

type AccountTabId = "profile" | "security" | "notifications"

interface AccountTab {
  id: AccountTabId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const ACCOUNT_TABS: AccountTab[] = [
  { id: "profile", label: "Profile Information", icon: User },
  { id: "security", label: "Security & Credentials", icon: Lock },
  { id: "notifications", label: "Notifications & Alerts", icon: Bell },
]

const STORAGE_KEY_PROFILE = "poster_gen_account_profile"
const STORAGE_KEY_NOTIFICATIONS = "poster_gen_account_notifications"

function AccountSettingsContent() {
  const { user, updateUser } = useAuth()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as AccountTabId) || "profile"
  const [activeTab, setActiveTab] = React.useState<AccountTabId>(
    ACCOUNT_TABS.some((t) => t.id === initialTab) ? initialTab : "profile"
  )

  // Feedback toast banner
  const [feedback, setFeedback] = React.useState<{ text: string; error?: boolean } | null>(null)
  const showFeedback = (text: string, error = false) => {
    setFeedback({ text, error })
    setTimeout(() => setFeedback(null), 3500)
  }

  // --- 1. Profile Information State ---
  const [name, setName] = React.useState(user?.name || "Alexander Drake")
  const [email, setEmail] = React.useState(user?.email || "admin1@gmail.com")
  const [phone, setPhone] = React.useState("+1 (503) 555-0147")

  // Sync user from auth context on load
  React.useEffect(() => {
    if (user) {
      if (user.name && user.name !== "Poster Gen Admin") {
        setName(user.name)
      } else {
        setName("Alexander Drake")
      }
      setEmail(user.email || "admin1@gmail.com")
    }

    try {
      const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE)
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile)
        if (parsed.phone) setPhone(parsed.phone)
      }
    } catch {
      // ignore
    }
  }, [user])

  // Individual Save for Profile Information
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showFeedback("Full name is required.", true)
      return
    }
    if (!email.trim()) {
      showFeedback("Email address is required.", true)
      return
    }

    updateUser({
      name: name.trim(),
      email: email.trim(),
    })

    try {
      localStorage.setItem(
        STORAGE_KEY_PROFILE,
        JSON.stringify({
          phone: phone.trim(),
        })
      )
    } catch {
      // ignore
    }

    showFeedback("Profile details saved successfully.")
  }

  // --- 2. Security & Credentials State ---
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  // Individual Save for Password Update
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      showFeedback("Please enter your current password.", true)
      return
    }
    if (!newPassword) {
      showFeedback("Please enter a new password.", true)
      return
    }
    if (newPassword.length < 4) {
      showFeedback("Password must be at least 4 characters.", true)
      return
    }
    if (newPassword !== confirmPassword) {
      showFeedback("New passwords do not match.", true)
      return
    }

    // Clear inputs and give confirmation
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    showFeedback("Security credentials and password updated successfully.")
  }

  // --- 3. Notification Preferences State ---
  const [notifyOrderNew, setNotifyOrderNew] = React.useState(true)
  const [notifyOrderStage, setNotifyOrderStage] = React.useState(true)
  const [notifyPreflightDefect, setNotifyPreflightDefect] = React.useState(true)
  const [notifyTrackingGenerated, setNotifyTrackingGenerated] = React.useState(false)

  const [notifyAiLatency, setNotifyAiLatency] = React.useState(true)
  const [notifyPipelineVram, setNotifyPipelineVram] = React.useState(true)
  const [notifyPromptRejection, setNotifyPromptRejection] = React.useState(false)

  React.useEffect(() => {
    try {
      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS)
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs)
        if (typeof parsed.notifyOrderNew === "boolean") setNotifyOrderNew(parsed.notifyOrderNew)
        if (typeof parsed.notifyOrderStage === "boolean") setNotifyOrderStage(parsed.notifyOrderStage)
        if (typeof parsed.notifyPreflightDefect === "boolean") setNotifyPreflightDefect(parsed.notifyPreflightDefect)
        if (typeof parsed.notifyTrackingGenerated === "boolean") setNotifyTrackingGenerated(parsed.notifyTrackingGenerated)

        if (typeof parsed.notifyAiLatency === "boolean") setNotifyAiLatency(parsed.notifyAiLatency)
        if (typeof parsed.notifyPipelineVram === "boolean") setNotifyPipelineVram(parsed.notifyPipelineVram)
        if (typeof parsed.notifyPromptRejection === "boolean") setNotifyPromptRejection(parsed.notifyPromptRejection)
      }
    } catch {
      // ignore
    }
  }, [])

  // Individual Save for Notifications
  const handleSaveNotifications = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY_NOTIFICATIONS,
        JSON.stringify({
          notifyOrderNew,
          notifyOrderStage,
          notifyPreflightDefect,
          notifyTrackingGenerated,
          notifyAiLatency,
          notifyPipelineVram,
          notifyPromptRejection,
        })
      )
    } catch {
      // ignore
    }
    showFeedback("Notification preferences saved successfully.")
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Page Header: Title and Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Account Settings
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Manage your administrator profile, security credentials, and notification preferences.
        </p>
      </div>

      {/* Top Bar Tabs matching store-settings / reports */}
      <div className="border-b border-border/80">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {ACCOUNT_TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-t-md text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#181a1f] text-foreground font-semibold shadow-xs border-t border-x border-border/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground/80"
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-primary shadow-[0_0_8px_rgba(216,49,56,0.6)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notification Toast Banner */}
      {feedback && (
        <div
          className={`p-3 text-xs rounded-md flex items-center gap-2 shadow-sm animate-in fade-in duration-200 ${
            feedback.error
              ? "bg-red-950/60 border border-red-800/40 text-red-400"
              : "bg-emerald-950/60 border border-emerald-800/40 text-emerald-400"
          }`}
        >
          {feedback.error ? (
            <AlertCircle className="size-3.5 shrink-0" />
          ) : (
            <Check className="size-3.5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Tab Panels with Individual Save Options */}
      <div className="grid gap-6">
        {/* --- TAB 1: PROFILE INFORMATION --- */}
        {activeTab === "profile" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  Profile Information
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update your personal identity and contact credentials.
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-muted-foreground border border-border/60">
                Superadmin
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Drake"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                    Email Address <span className="text-primary">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin1@gmail.com"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (503) 555-0147"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Save Button for Profile */}
              <div className="flex justify-end pt-3 border-t border-border/60">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Save className="size-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB 2: SECURITY & CREDENTIALS --- */}
        {activeTab === "security" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
            <div className="pb-2 border-b border-border/60">
              <h3 className="font-semibold text-base text-foreground">
                Password & Authentication
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your account login password. Keep it secure and unique.
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                    Current Password
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                    New Password
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Save Button for Password */}
              <div className="flex justify-end pt-3 border-t border-border/60">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <KeyRound className="size-4" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB 3: NOTIFICATIONS & ALERTS --- */}
        {activeTab === "notifications" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-6">
            <div className="pb-2 border-b border-border/60">
              <h3 className="font-semibold text-base text-foreground">
                Notification Preferences
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose what alerts, triggers, and automated updates you receive.
              </p>
            </div>

            {/* Subsection 1: Order & Fulfillment */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order & Production Alerts
              </h4>
              <div className="space-y-2.5">
                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyOrderNew}
                    onChange={(e) => setNotifyOrderNew(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      New poster print order placed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Immediate notification when an order enters initial fulfillment queue.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyOrderStage}
                    onChange={(e) => setNotifyOrderStage(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Stage transitions & Emergency reversals
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Alert when an order is moved forward or rolled back in production.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyPreflightDefect}
                    onChange={(e) => setNotifyPreflightDefect(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Pre-flight artwork inspection defect warning
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Notify if customer artwork DPI or resolution is below 300 DPI print threshold.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyTrackingGenerated}
                    onChange={(e) => setNotifyTrackingGenerated(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Shipping carrier tracking code assigned
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Notify when carrier manifest is updated with live tracking number.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Subsection 2: AI Engine Alerts */}
            <div className="space-y-3 pt-3 border-t border-border/50">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                AI Generation Engine Alerts
              </h4>
              <div className="space-y-2.5">
                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyAiLatency}
                    onChange={(e) => setNotifyAiLatency(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Generative model latency or 8K upscale failure
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Immediate alert if TensorRT pipeline experiences timeout or GPU worker fault.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyPipelineVram}
                    onChange={(e) => setNotifyPipelineVram(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      TensorRT pipeline VRAM utilization spike (&gt;90%)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Warn when VRAM allocation reaches critical threshold during batch generation.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-md hover:bg-secondary/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifyPromptRejection}
                    onChange={(e) => setNotifyPromptRejection(e.target.checked)}
                    className="mt-1 rounded accent-[#d83138] size-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Customer prompt policy rejection
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Notify when AI safety filter blocks an offensive or non-automotive prompt.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Individual Save Button for Notifications */}
            <div className="flex justify-end pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={handleSaveNotifications}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Save className="size-4" />
                <span>Save Notification Preferences</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountSettingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <AccountSettingsContent />
    </React.Suspense>
  )
}
