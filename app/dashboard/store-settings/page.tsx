"use client"

import * as React from "react"
import { Save, ChevronDown, Check } from "lucide-react"

interface StoreStatusHistoryItem {
  id: string
  date: string
  action: string
  reason: string
}

export default function StoreSettingsPage() {
  // Store Identity state
  const [brandName, setBrandName] = React.useState("POSTER GEN • Automotive Atelier")
  const [contactEmail, setContactEmail] = React.useState("contact@postergen.io")

  // Store status state
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

  // Generation limits state
  const [individualPreviews, setIndividualPreviews] = React.useState(20)
  const [individualPeriod, setIndividualPeriod] = React.useState("per day")
  const [combinedPreviews, setCombinedPreviews] = React.useState(5)
  const [combinedPeriod, setCombinedPeriod] = React.useState("per day")
  const [regenerationsPerSession, setRegenerationsPerSession] = React.useState(3)
  const [rateLimitMin, setRateLimitMin] = React.useState(3)
  const [rateLimitHour, setRateLimitHour] = React.useState(15)
  const [failedJobsCount, setFailedJobsCount] = React.useState("No")
  const [lastChangedAudit, setLastChangedAudit] = React.useState(
    "Last changed 12 Nov by Riya · 15 to 20 individual per day"
  )

  // Feedback notifications
  const [feedback, setFeedback] = React.useState<string | null>(null)

  function showFeedback(msg: string) {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  function handleToggleStoreStatus() {
    if (isStoreOpen) {
      // Closing store
      const reason = closingReason.trim() || "Maintenance"
      const newEntry: StoreStatusHistoryItem = {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Closed by Riya",
        reason: reason,
      }
      setIsStoreOpen(false)
      setStatusHistory([newEntry, ...statusHistory])
      showFeedback("Store has been closed to visitors.")
    } else {
      // Opening store
      const newEntry: StoreStatusHistoryItem = {
        id: `hist-${Date.now()}`,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        action: "Opened by Riya",
        reason: "Resumed normal operations",
      }
      setIsStoreOpen(true)
      setStatusHistory([newEntry, ...statusHistory])
      showFeedback("Store has been reopened.")
    }
  }

  function handleSaveLimits(e: React.FormEvent) {
    e.preventDefault()
    setLastChangedAudit(
      `Last changed ${new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })} by Riya · ${individualPreviews} individual ${individualPeriod}`
    )
    showFeedback("Generation limits saved successfully.")
  }

  function handleSaveAllSettings() {
    showFeedback("All store settings saved successfully.")
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Configure store branding, operational status, generation limits, and print specifications.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAllSettings}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="size-4" /> Save Settings
        </button>
      </div>

      {feedback && (
        <div className="p-3 text-xs bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 rounded-md flex items-center gap-2">
          <Check className="size-3.5" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid gap-6">
        {/* 1. Store Identity */}
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div>
            <h3 className="font-semibold text-base text-foreground">Store Identity</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Public branding and primary customer contact channel.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 pt-1">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-[#131418] px-3.5 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 2. Store status */}
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
          {/* Header & Toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base text-foreground">Store status</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                When the store is closed, customers can browse but cannot check out or generate new posters.
              </p>
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

          {/* 2 Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Reason for closing */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Reason for closing (required)
              </label>
              <textarea
                rows={3}
                value={closingReason}
                onChange={(e) => setClosingReason(e.target.value)}
                placeholder="Example: Printer maintenance until Monday"
                className="w-full rounded-md border border-border/80 bg-[#131418] p-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
              />
            </div>

            {/* Notice shown to visitors */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Notice shown to visitors
              </label>
              <textarea
                rows={3}
                value={visitorNotice}
                onChange={(e) => setVisitorNotice(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-[#131418] p-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
              />
              <p className="text-[11px] text-muted-foreground mt-1.5 font-normal">
                Customers see this text. They never see the internal reason.
              </p>
            </div>
          </div>

          {/* Close/Open the store button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleToggleStoreStatus}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border ${
                isStoreOpen
                  ? "border-rose-900/60 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40"
                  : "border-emerald-800/60 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40"
              }`}
            >
              {isStoreOpen ? "Close the store" : "Open the store"}
            </button>
          </div>

          {/* History */}
          <div className="pt-2">
            <span className="text-xs text-muted-foreground block mb-2 font-normal">
              History
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
        </div>

        {/* 3. Generation limits */}
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-5">
          <div>
            <h3 className="font-semibold text-base text-foreground">Generation limits</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Applied on the server to every customer. Combined posters and regenerations count as their own actions.
            </p>
          </div>

          {/* Row 1: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            {/* Individual previews per customer */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Individual previews per customer
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={individualPreviews}
                  onChange={(e) => setIndividualPreviews(Number(e.target.value))}
                  className="w-20 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm text-foreground text-center outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
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

            {/* Combined previews per customer */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Combined previews per customer
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={combinedPreviews}
                  onChange={(e) => setCombinedPreviews(Number(e.target.value))}
                  className="w-20 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm text-foreground text-center outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
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

            {/* Regenerations per session */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Regenerations per session
              </label>
              <input
                type="number"
                value={regenerationsPerSession}
                onChange={(e) => setRegenerationsPerSession(Number(e.target.value))}
                className="w-28 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>
          </div>

          {/* Row 2: 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Rate limit: jobs per minute */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Rate limit: jobs per minute
              </label>
              <input
                type="number"
                value={rateLimitMin}
                onChange={(e) => setRateLimitMin(Number(e.target.value))}
                className="w-28 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
              <p className="text-[11px] text-muted-foreground mt-1.5 font-normal">
                Stops rapid repeated clicks
              </p>
            </div>

            {/* Rate limit: jobs per hour */}
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5 font-normal">
                Rate limit: jobs per hour
              </label>
              <input
                type="number"
                value={rateLimitHour}
                onChange={(e) => setRateLimitHour(Number(e.target.value))}
                className="w-28 rounded-md border border-border/80 bg-[#131418] px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
              />
            </div>

            {/* Failed jobs count against limit? */}
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

          {/* Save limits button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleSaveLimits}
              className="px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border border-border/80 bg-secondary/80 hover:bg-secondary text-foreground shadow-xs"
            >
              Save limits
            </button>
          </div>

          {/* Audit text */}
          <p className="text-xs text-muted-foreground pt-0.5">
            {lastChangedAudit}
          </p>
        </div>

        {/* 4. Print sizes and shipping */}
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-base text-foreground">
                Print sizes and shipping
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                The client supplies these. They may be fixed in code for V1 instead of editable here.
              </p>
            </div>

            <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-amber-950/70 text-amber-500 border-amber-800/40 shrink-0">
              Confirm with client
            </span>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 text-xs font-normal text-muted-foreground">
                  <th className="pb-2.5 font-normal">Size</th>
                  <th className="pb-2.5 font-normal">Minimum pixels (300 DPI)</th>
                  <th className="pb-2.5 font-normal">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 font-semibold text-foreground text-sm">
                    12 x 18 in
                  </td>
                  <td className="py-3 font-semibold text-foreground text-sm">
                    3600 x 5400
                  </td>
                  <td className="py-3 font-semibold text-foreground text-sm">
                    Yes
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 font-semibold text-foreground text-sm">
                    18 x 24 in
                  </td>
                  <td className="py-3 font-semibold text-foreground text-sm">
                    5400 x 7200
                  </td>
                  <td className="py-3 font-semibold text-foreground text-sm">
                    Yes
                  </td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 font-semibold text-foreground text-sm">
                    24 x 36 in
                  </td>
                  <td className="py-3 font-semibold text-foreground text-sm">
                    7200 x 10800
                  </td>
                  <td className="py-3 font-semibold text-foreground text-sm">
                    Yes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
