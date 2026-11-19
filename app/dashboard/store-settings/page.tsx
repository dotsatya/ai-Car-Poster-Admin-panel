"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  Save,
  ChevronDown,
  Check,
  Store,
  Activity,
  Sliders,
  Printer,
} from "lucide-react"

interface StoreStatusHistoryItem {
  id: string
  date: string
  action: string
  reason: string
}

type SettingsTabId = "identity" | "status" | "limits" | "shipping"

interface SettingsTab {
  id: SettingsTabId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const SETTINGS_TABS: SettingsTab[] = [
  { id: "identity", label: "Store Identity", icon: Store },
  { id: "status", label: "Store Status", icon: Activity },
  { id: "limits", label: "Generation Limits", icon: Sliders },
  { id: "shipping", label: "Printing Size and Shipping", icon: Printer },
]

const STORAGE_KEY = "poster_gen_store_settings"

function StoreSettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as SettingsTabId) || "identity"
  const [activeTab, setActiveTab] = React.useState<SettingsTabId>(
    SETTINGS_TABS.some((t) => t.id === initialTab) ? initialTab : "identity"
  )

  // Store Identity state
  const [brandName, setBrandName] = React.useState("POSTER GEN • Automotive Atelier")
  const [contactEmail, setContactEmail] = React.useState("contact@postergen.io")
  const [supportPhone, setSupportPhone] = React.useState("+1 (555) 019-2834")

  // Store Status state
  const [isStoreOpen, setIsStoreOpen] = React.useState(true)
  const [closingReason, setClosingReason] = React.useState("")
  const [visitorNotice, setVisitorNotice] = React.useState(
    "We are temporarily unavailable. Please check back soon."
  )
  const [statusHistory, setStatusHistory] = React.useState<StoreStatusHistoryItem[]>([
    {
      id: "hist-1",
      date: "10 Nov 09:00",
      action: "Opened by Riya",
      reason: "Maintenance finished",
    },
    {
      id: "hist-2",
      date: "08 Nov 18:20",
      action: "Closed by Riya",
      reason: "Printer maintenance",
    },
  ])

  // Generation Limits state
  const [individualPreviews, setIndividualPreviews] = React.useState(20)
  const [individualPeriod, setIndividualPeriod] = React.useState("per day")
  const [combinedPreviews, setCombinedPreviews] = React.useState(5)
  const [combinedPeriod, setCombinedPeriod] = React.useState("per day")
  const [regenerationsPerSession, setRegenerationsPerSession] = React.useState(3)
  const [rateLimitMin, setRateLimitMin] = React.useState(3)
  const [rateLimitHour, setRateLimitHour] = React.useState(15)
  const [failedJobsCount, setFailedJobsCount] = React.useState("No")

  // Printing & Shipping state
  const [standardShippingRate, setStandardShippingRate] = React.useState("5.99")
  const [expressShippingRate, setExpressShippingRate] = React.useState("14.99")
  const [freeShippingThreshold, setFreeShippingThreshold] = React.useState("75.00")
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = React.useState("3 - 5 business days")

  // Feedback notifications
  const [feedback, setFeedback] = React.useState<string | null>(null)

  // Load persisted settings from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.brandName) setBrandName(data.brandName)
        if (data.contactEmail) setContactEmail(data.contactEmail)
        if (data.supportPhone) setSupportPhone(data.supportPhone)

        if (typeof data.isStoreOpen === "boolean") setIsStoreOpen(data.isStoreOpen)
        if (data.closingReason !== undefined) setClosingReason(data.closingReason)
        if (data.visitorNotice) setVisitorNotice(data.visitorNotice)
        if (Array.isArray(data.statusHistory)) setStatusHistory(data.statusHistory)

        if (typeof data.individualPreviews === "number") setIndividualPreviews(data.individualPreviews)
        if (data.individualPeriod) setIndividualPeriod(data.individualPeriod)
        if (typeof data.combinedPreviews === "number") setCombinedPreviews(data.combinedPreviews)
        if (data.combinedPeriod) setCombinedPeriod(data.combinedPeriod)
        if (typeof data.regenerationsPerSession === "number")
          setRegenerationsPerSession(data.regenerationsPerSession)
        if (typeof data.rateLimitMin === "number") setRateLimitMin(data.rateLimitMin)
        if (typeof data.rateLimitHour === "number") setRateLimitHour(data.rateLimitHour)
        if (data.failedJobsCount) setFailedJobsCount(data.failedJobsCount)

        if (data.standardShippingRate) setStandardShippingRate(data.standardShippingRate)
        if (data.expressShippingRate) setExpressShippingRate(data.expressShippingRate)
        if (data.freeShippingThreshold) setFreeShippingThreshold(data.freeShippingThreshold)
        if (data.estimatedDeliveryDays) setEstimatedDeliveryDays(data.estimatedDeliveryDays)
      }
    } catch {
      // ignore
    }
  }, [])

  function showFeedback(msg: string) {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  function persistCurrentState(overrides: Record<string, any> = {}) {
    try {
      const state = {
        brandName,
        contactEmail,
        supportPhone,
        isStoreOpen,
        closingReason,
        visitorNotice,
        statusHistory,
        individualPreviews,
        individualPeriod,
        combinedPreviews,
        combinedPeriod,
        regenerationsPerSession,
        rateLimitMin,
        rateLimitHour,
        failedJobsCount,
        standardShippingRate,
        expressShippingRate,
        freeShippingThreshold,
        estimatedDeliveryDays,
        ...overrides,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }

  // Save handlers for each subsection
  function handleSaveIdentity() {
    persistCurrentState()
    showFeedback("Store Identity settings saved successfully.")
  }

  function handleSaveStoreStatus() {
    persistCurrentState()
    showFeedback("Store Status settings saved successfully.")
  }

  function handleToggleStoreStatus() {
    if (isStoreOpen) {
      const reason = closingReason.trim() || "Maintenance"
      const newEntry: StoreStatusHistoryItem = {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Closed by Administrator",
        reason: reason,
      }
      const nextHistory = [newEntry, ...statusHistory]
      setIsStoreOpen(false)
      setStatusHistory(nextHistory)
      persistCurrentState({ isStoreOpen: false, statusHistory: nextHistory })
      showFeedback("Store has been closed to visitors.")
    } else {
      const newEntry: StoreStatusHistoryItem = {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Opened by Administrator",
        reason: "Resumed normal operations",
      }
      const nextHistory = [newEntry, ...statusHistory]
      setIsStoreOpen(true)
      setStatusHistory(nextHistory)
      persistCurrentState({ isStoreOpen: true, statusHistory: nextHistory })
      showFeedback("Store has been reopened.")
    }
  }

  function handleSaveLimits() {
    persistCurrentState()
    showFeedback("Generation Limits settings saved successfully.")
  }

  function handleSaveShipping() {
    persistCurrentState()
    showFeedback("Printing Size and Shipping settings saved successfully.")
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Page Header: Title and Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Configure store branding, operational status, generation limits, and print specifications.
        </p>
      </div>

      {/* Top Bar Tabs matching demo picture */}
      <div className="border-b border-border/80">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {SETTINGS_TABS.map((tab) => {
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
        <div className="p-3 text-xs bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-md flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
          <Check className="size-3.5" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Subsections */}
      <div className="grid gap-6">
        {/* 1. Store Identity Subsection */}
        {activeTab === "identity" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
            <div>
              <h3 className="font-semibold text-base text-foreground">Store Identity</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-3 pt-1">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Brand Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Contact Email
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Support Phone
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>
            </div>

            {/* Save these settings button for Store Identity */}
            <div className="flex justify-end pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleSaveIdentity}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Save className="size-4" />
                <span>Save these settings</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Store Status Subsection */}
        {activeTab === "status" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
            {/* Header & Toggle */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base text-foreground">Store Status</h3>
              </div>

              {/* Status Switch */}
              <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={isStoreOpen}
                  onClick={() => setIsStoreOpen(!isStoreOpen)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isStoreOpen ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isStoreOpen ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className={`text-xs font-medium select-none ${
                    isStoreOpen ? "text-emerald-500" : "text-rose-400"
                  }`}
                >
                  {isStoreOpen ? "Store is open" : "Store is closed"}
                </span>
              </div>
            </div>

            {/* Textareas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Reason for closing (required)
                </label>
                <div className="relative group">
                  <textarea
                    rows={3}
                    value={closingReason}
                    onChange={(e) => setClosingReason(e.target.value)}
                    placeholder="Example: Printer maintenance until Monday"
                    className="w-full rounded-md border border-border/80 bg-[#131418] p-3 pr-24 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-3 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Notice shown to visitors
                </label>
                <div className="relative group">
                  <textarea
                    rows={3}
                    value={visitorNotice}
                    onChange={(e) => setVisitorNotice(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] p-3 pr-24 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                  <span className="pointer-events-none absolute right-3 top-3 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>
            </div>

            {/* Close / Open Quick Toggle Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleToggleStoreStatus}
                className={`rounded-md px-3.5 py-2 text-sm font-medium cursor-pointer transition-colors border shadow-sm ${
                  isStoreOpen
                    ? "border-rose-900/60 bg-rose-950/40 text-rose-400 hover:bg-rose-900/50 hover:text-rose-300"
                    : "border-emerald-800/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
                }`}
              >
                {isStoreOpen ? "Close the store" : "Open the store"}
              </button>
            </div>

            {/* History */}
            <div className="pt-2">
              <span className="text-xs text-muted-foreground block mb-2 font-normal">
                Status History
              </span>
              <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-foreground">
                {statusHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-1.5 flex-wrap">
                    <span>{item.date}</span>
                    <span className="text-muted-foreground font-normal">·</span>
                    <span>{item.action}</span>
                    <span className="text-muted-foreground font-normal">·</span>
                    <span className="text-foreground/90 font-medium">
                      &ldquo;{item.reason}&rdquo;
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Save these settings button for Store Status */}
            <div className="flex justify-end pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleSaveStoreStatus}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Save className="size-4" />
                <span>Save these settings</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Generation Limits Subsection */}
        {activeTab === "limits" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
            <div>
              <h3 className="font-semibold text-base text-foreground">Generation Limits</h3>
            </div>

            {/* Row 1: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Individual previews per customer
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative group w-36">
                    <input
                      type="number"
                      value={individualPreviews}
                      onChange={(e) => setIndividualPreviews(Number(e.target.value))}
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3 pr-20 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={individualPeriod}
                      onChange={(e) => setIndividualPeriod(e.target.value)}
                      className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-8 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
                    >
                      <option value="per day" className="bg-[#121315] text-foreground">
                        per day
                      </option>
                      <option value="per week" className="bg-[#121315] text-foreground">
                        per week
                      </option>
                      <option value="per month" className="bg-[#121315] text-foreground">
                        per month
                      </option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Combined previews per customer
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative group w-36">
                    <input
                      type="number"
                      value={combinedPreviews}
                      onChange={(e) => setCombinedPreviews(Number(e.target.value))}
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3 pr-20 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={combinedPeriod}
                      onChange={(e) => setCombinedPeriod(e.target.value)}
                      className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-8 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
                    >
                      <option value="per day" className="bg-[#121315] text-foreground">
                        per day
                      </option>
                      <option value="per week" className="bg-[#121315] text-foreground">
                        per week
                      </option>
                      <option value="per month" className="bg-[#121315] text-foreground">
                        per month
                      </option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Regenerations per session
                </label>
                <div className="relative group w-40">
                  <input
                    type="number"
                    value={regenerationsPerSession}
                    onChange={(e) => setRegenerationsPerSession(Number(e.target.value))}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-20 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Rate limit: jobs per minute
                </label>
                <div className="relative group w-40">
                  <input
                    type="number"
                    value={rateLimitMin}
                    onChange={(e) => setRateLimitMin(Number(e.target.value))}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-20 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5 font-normal">
                  Stops rapid repeated clicks
                </p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Rate limit: jobs per hour
                </label>
                <div className="relative group w-40">
                  <input
                    type="number"
                    value={rateLimitHour}
                    onChange={(e) => setRateLimitHour(Number(e.target.value))}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-20 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Failed jobs count against limit?
                </label>
                <div className="relative">
                  <select
                    value={failedJobsCount}
                    onChange={(e) => setFailedJobsCount(e.target.value)}
                    className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-8 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
                  >
                    <option value="No" className="bg-[#121315] text-foreground">
                      No
                    </option>
                    <option value="Yes" className="bg-[#121315] text-foreground">
                      Yes
                    </option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                </div>
              </div>
            </div>

            {/* Save these settings button for Generation Limits */}
            <div className="flex justify-end pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleSaveLimits}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Save className="size-4" />
                <span>Save these settings</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Printing Size and Shipping Subsection */}
        {activeTab === "shipping" && (
          <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-base text-foreground">
                  Printing Size and Shipping
                </h3>
              </div>

              <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40 shrink-0">
                Active Policy
              </span>
            </div>

            {/* Unified Size Specifications Table */}
            <div className="rounded-md border border-border/80 bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                      <th className="py-3.5 px-4 font-medium">Size</th>
                      <th className="py-3.5 px-4 font-medium">Minimum pixels (300 DPI)</th>
                      <th className="py-3.5 px-4 font-medium">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        12 x 18 in
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        3600 x 5400
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                          Yes
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        18 x 24 in
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        5400 x 7200
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                          Yes
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        24 x 36 in
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        7200 x 10800
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
                          Yes
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Shipping Configuration Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Standard Shipping Rate ($)
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={standardShippingRate}
                    onChange={(e) => setStandardShippingRate(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Express Shipping Rate ($)
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={expressShippingRate}
                    onChange={(e) => setExpressShippingRate(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Free Shipping Minimum ($)
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                  Estimated Delivery Window
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={estimatedDeliveryDays}
                    onChange={(e) => setEstimatedDeliveryDays(e.target.value)}
                    className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                    Click to edit
                  </span>
                </div>
              </div>
            </div>

            {/* Save these settings button for Printing & Shipping */}
            <div className="flex justify-end pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={handleSaveShipping}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Save className="size-4" />
                <span>Save these settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function StoreSettingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <StoreSettingsContent />
    </React.Suspense>
  )
}
