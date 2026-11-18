"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  PRODUCTION_STAGES,
  INITIAL_PRODUCTION_ORDERS,
  mergeProductionOrders,
  type ProductionOrder,
  type ProductionStage,
  type ProductionFile,
} from "@/lib/demoProduction"
import {
  ArrowLeft,
  Download,
  Upload,
  CheckCircle2,
  Mail,
  ChevronDown,
  Check,
  Save,
} from "lucide-react"

interface ProductionOrderDetailProps {
  initialOrder: ProductionOrder
}

export function ProductionOrderDetail({ initialOrder }: ProductionOrderDetailProps) {
  const [order, setOrder] = React.useState<ProductionOrder>(initialOrder)
  const [carrier, setCarrier] = React.useState(initialOrder.carrier || "")
  const [trackingNumber, setTrackingNumber] = React.useState(initialOrder.trackingNumber || "")
  const [shippingSaved, setShippingSaved] = React.useState(false)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [activeDownloadId, setActiveDownloadId] = React.useState<string | null>(null)
  const [isSaved, setIsSaved] = React.useState(true)

  // Hidden file input refs for replacing artwork per file
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>({})

  // Load from localStorage if persisted, safely merged
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("production_orders_store")
      if (stored) {
        const merged = mergeProductionOrders(INITIAL_PRODUCTION_ORDERS, stored)
        const match = merged.find(
          (o) => o.cleanId === initialOrder.cleanId || o.id === initialOrder.id
        )
        if (match) {
          setOrder(match)
          setCarrier(match.carrier || "")
          setTrackingNumber(match.trackingNumber || "")
        }
      }
    } catch {
      // ignore
    }
  }, [initialOrder.cleanId, initialOrder.id])

  // Save changes to localStorage so overview table and other pages stay synced
  const persistOrder = (updated: ProductionOrder) => {
    setOrder(updated)
    try {
      const stored = localStorage.getItem("production_orders_store")
      const list = mergeProductionOrders(INITIAL_PRODUCTION_ORDERS, stored)
      const index = list.findIndex(
        (o) => o.cleanId === updated.cleanId || o.id === updated.id
      )
      if (index >= 0) {
        list[index] = updated
      } else {
        list.push(updated)
      }
      localStorage.setItem("production_orders_store", JSON.stringify(list))
    } catch {
      // ignore
    }
  }

  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  // Find index of current stage in 8-step process
  const currentStageIndex = PRODUCTION_STAGES.findIndex((s) => s.key === order.stage)

  // Calculate remaining stages after the current stage
  const remainingStages = React.useMemo(() => {
    if (currentStageIndex === -1) return PRODUCTION_STAGES.slice(1)
    return PRODUCTION_STAGES.filter((_, idx) => idx > currentStageIndex)
  }, [currentStageIndex])

  // Selected stage from the remaining stages
  const [selectedTargetStage, setSelectedTargetStage] = React.useState<ProductionStage>(
    remainingStages[0]?.key || "Delivered"
  )

  // Keep selectedTargetStage synchronized when current stage changes
  React.useEffect(() => {
    if (remainingStages.length > 0) {
      setSelectedTargetStage(remainingStages[0].key)
    }
  }, [remainingStages])

  // Target stage config
  const targetStageConfig = PRODUCTION_STAGES.find((s) => s.key === selectedTargetStage)

  // Move to the selected remaining stage and mark as saved
  const handleMoveToSelectedStage = () => {
    if (!selectedTargetStage || selectedTargetStage === order.stage) return

    const now = new Date()
    const timeStr = `${now.getDate()} Nov ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`

    const isEmailNotice = targetStageConfig?.emailNotice ?? false

    const newHistoryItem = {
      id: `h-dyn-${Date.now()}`,
      time: timeStr,
      label: selectedTargetStage,
      author: "Amit",
      emailSent: isEmailNotice,
    }

    const updated: ProductionOrder = {
      ...order,
      stage: selectedTargetStage,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
      history: [...order.history, newHistoryItem],
    }

    persistOrder(updated)
    setIsSaved(true)

    if (isEmailNotice) {
      showNotification(
        `Stage moved to "${selectedTargetStage}" and saved. Automatic customer notification email sent to ${order.customer?.email || "customer"}.`
      )
    } else {
      showNotification(`Stage moved to "${selectedTargetStage}" and marked as saved.`)
    }
  }

  // Explicit mark as saved action
  const handleMarkAsSaved = () => {
    const updated: ProductionOrder = {
      ...order,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
    }
    persistOrder(updated)
    setIsSaved(true)
    showNotification(`Order #${order.cleanId} production status marked as saved.`)
  }

  // Handle high-res 300 DPI download
  const handleDownloadFile = (item: ProductionFile) => {
    setActiveDownloadId(item.id)
    showNotification(`Downloading 300 DPI high-res file for "${item.title}" (${item.dimensions})...`)

    setTimeout(() => {
      const a = document.createElement("a")
      a.href = item.image || "/template photo/1.webp"
      a.download = `order-${order.cleanId}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-300dpi.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setActiveDownloadId(null)
    }, 800)
  }

  // Handle file replacement
  const handleFileChange = (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    const now = new Date()
    const timeStr = `${now.getDate()} Nov ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`

    const updatedItems = order.items.map((it) => {
      if (it.id === itemId) {
        return {
          ...it,
          image: objectUrl,
          fileStatus: `Replaced by Riya · ${it.dimensions}`,
          replacedBy: "Riya",
        }
      }
      return it
    })

    const newHistory = [
      ...order.history,
      {
        id: `h-rep-${Date.now()}`,
        time: timeStr,
        label: `Replacement file uploaded for ${updatedItems.find((i) => i.id === itemId)?.title}`,
        author: "Riya",
        emailSent: false,
      },
    ]

    const updated: ProductionOrder = {
      ...order,
      flag: "File replaced",
      items: updatedItems,
      history: newHistory,
    }

    persistOrder(updated)
    setIsSaved(true)
    showNotification(`Replacement file uploaded. Set flag to "File replaced" and saved history.`)
  }

  // Save carrier and tracking
  const handleSaveShipping = () => {
    const updated: ProductionOrder = {
      ...order,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
    }
    persistOrder(updated)
    setShippingSaved(true)
    setIsSaved(true)
    setTimeout(() => setShippingSaved(false), 3000)
    showNotification(`Shipping carrier & tracking saved for customer tracking.`)
  }

  const getStageBadge = (stage: ProductionStage) => {
    switch (stage) {
      case "Order Received":
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60"
      case "Order Confirmed":
      case "Order confirmed and logged" as any:
        return "bg-violet-950/70 text-violet-400 border-violet-900/70"
      case "Preparing Artwork":
        return "bg-amber-950/70 text-amber-500 border-amber-900/70"
      case "Printing":
        return "bg-blue-950/70 text-blue-400 border-blue-900/70"
      case "Quality Check & Packing":
        return "bg-yellow-950/70 text-yellow-400 border-yellow-900/70"
      case "Shipped":
        return "bg-cyan-950/70 text-cyan-400 border-cyan-900/70"
      case "Out for Delivery":
        return "bg-indigo-950/70 text-indigo-400 border-indigo-900/70"
      case "Delivered":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-900/70"
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60"
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/production"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Production</span>
        </Link>
      </div>

      {/* Floating notification if present */}
      {toastMessage && (
        <div className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-primary shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs text-muted-foreground hover:text-foreground ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Order Card */}
      <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Order {order.id}
          </h2>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium border ${getStageBadge(
              order.stage
            )}`}
          >
            {order.stage}
          </span>
        </div>

        {/* 8-Stage Horizontal Stepper */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
          {PRODUCTION_STAGES.map((step, idx) => {
            const isCompletedOrCurrent = idx <= currentStageIndex
            const isTarget = step.key === selectedTargetStage
            const isCurrent = step.key === order.stage

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => {
                  if (!isCurrent) {
                    setSelectedTargetStage(step.key)
                    setIsSaved(false)
                  }
                }}
                disabled={isCurrent}
                className={`flex flex-col gap-2 text-left group ${
                  isCurrent ? "cursor-default" : "cursor-pointer"
                }`}
                title={isCurrent ? `Current stage: ${step.key}` : `Click to select "${step.key}" as next stage`}
              >
                {/* Horizontal line indicator */}
                <div
                  className={`h-1.5 w-full rounded-sm transition-all duration-300 ${
                    idx === currentStageIndex
                      ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]"
                      : isCompletedOrCurrent
                      ? "bg-blue-600/80"
                      : isTarget
                      ? "bg-primary/70 ring-1 ring-primary"
                      : "bg-zinc-800 group-hover:bg-zinc-700"
                  }`}
                />
                {/* Stage short label */}
                <span
                  className={`text-[11px] sm:text-xs text-center transition-colors truncate max-w-full ${
                    idx === currentStageIndex
                      ? "text-foreground font-semibold"
                      : isCompletedOrCurrent
                      ? "text-muted-foreground font-medium"
                      : isTarget
                      ? "text-primary font-medium"
                      : "text-muted-foreground/60 font-normal group-hover:text-muted-foreground"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </button>
            )
          })}
        </div>

        {/* Action Row: Move to next stage selector, action button, and Mark as saved */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 pb-2 border-y border-border/70">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              Move to next stage:
            </span>

            {remainingStages.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Selector for the next remaining stages */}
                <div className="relative min-w-[210px]">
                  <select
                    value={selectedTargetStage}
                    onChange={(e) => {
                      setSelectedTargetStage(e.target.value as ProductionStage)
                      setIsSaved(false)
                    }}
                    className="w-full appearance-none rounded-md border border-border/90 bg-card px-3.5 py-2 text-sm font-medium text-foreground pr-9 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer shadow-sm"
                  >
                    {remainingStages.map((st) => (
                      <option
                        key={st.key}
                        value={st.key}
                        className="bg-[#121315] text-foreground py-1"
                      >
                        {st.key}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                </div>

                {/* Move to selected stage button */}
                <button
                  type="button"
                  onClick={handleMoveToSelectedStage}
                  className="rounded-md border border-border/80 bg-card/80 hover:bg-secondary hover:border-primary/40 text-foreground text-sm px-4 py-2 font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                >
                  <span>
                    Move to {targetStageConfig?.shortLabel || selectedTargetStage} →
                  </span>
                </button>

                {/* Mark as saved Button */}
                <button
                  type="button"
                  onClick={handleMarkAsSaved}
                  className={`rounded-md border text-sm px-3.5 py-2 font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    isSaved
                      ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/20"
                      : "border-border/80 bg-card/80 hover:bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  }`}
                  title="Click to mark order state as saved"
                >
                  <CheckCircle2
                    className={`size-4 ${isSaved ? "text-emerald-400" : "text-muted-foreground"}`}
                  />
                  <span>{isSaved ? "Marked as saved" : "Mark as saved"}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-md border border-emerald-900/50 bg-emerald-950/50">
                  <CheckCircle2 className="size-3.5" />
                  Order fully completed & delivered
                </span>
                <div className="relative min-w-[190px]">
                  <select
                    value={selectedTargetStage === order.stage ? "" : selectedTargetStage}
                    onChange={(e) => {
                      if (e.target.value) {
                        setSelectedTargetStage(e.target.value as ProductionStage)
                        setIsSaved(false)
                      }
                    }}
                    className="w-full appearance-none rounded-md border border-border/80 bg-card px-3 py-1.5 text-xs text-foreground pr-8 focus:border-primary/60 focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled>Change stage if needed...</option>
                    {PRODUCTION_STAGES.filter((s) => s.key !== order.stage).map((st) => (
                      <option key={st.key} value={st.key} className="bg-[#121315] text-foreground">
                        {st.key}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                </div>
                {selectedTargetStage && selectedTargetStage !== order.stage && (
                  <button
                    type="button"
                    onClick={handleMoveToSelectedStage}
                    className="rounded-md border border-border/80 bg-card/80 hover:bg-secondary hover:border-primary/40 text-foreground text-xs px-3 py-1.5 font-medium transition-all shadow-sm cursor-pointer"
                  >
                    Move to {selectedTargetStage} →
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleMarkAsSaved}
                  className={`rounded-md border text-xs px-3 py-1.5 font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    isSaved
                      ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400"
                      : "border-border/80 bg-card/80 hover:bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Check className="size-3.5" />
                  <span>{isSaved ? "Saved" : "Mark as saved"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="size-3.5 text-muted-foreground/70 shrink-0" />
            <span>Customer gets an email automatically on printing, shipping & delivery</span>
          </div>
        </div>

        {/* Print files Section */}
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Print files
          </h3>

          {/* Subheader */}
          <div className="grid grid-cols-12 text-xs font-normal text-muted-foreground/80 pb-1 px-1">
            <div className="col-span-5 sm:col-span-4">Artwork</div>
            <div className="col-span-3 sm:col-span-3 text-left">Size x Qty</div>
            <div className="col-span-4 sm:col-span-5 text-left">File</div>
          </div>

          {/* File Rows */}
          <div className="flex flex-col divide-y divide-border/60">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center py-3.5 px-1 gap-2 sm:gap-4 hover:bg-muted/20 transition-colors rounded-sm"
              >
                {/* Artwork Title & Thumbnail */}
                <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                  <div
                    className="size-10 sm:size-11 rounded-sm shrink-0 overflow-hidden relative border border-border/60 flex items-center justify-center bg-black/80"
                    style={{ backgroundColor: item.colorFallback }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="size-full bg-zinc-800" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.title}
                    </span>
                    {item.isCombined && (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-950/70 text-blue-400 border border-blue-900/70 w-fit mt-0.5">
                        Combined
                      </span>
                    )}
                  </div>
                </div>

                {/* Size x Qty */}
                <div className="col-span-3 sm:col-span-3 text-xs sm:text-sm text-foreground/90 font-normal">
                  {item.size} x {item.qty}
                </div>

                {/* File details & Actions */}
                <div className="col-span-4 sm:col-span-5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground font-normal truncate">
                    {item.fileStatus}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Download 300 DPI Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(item)}
                      disabled={activeDownloadId === item.id}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="size-3 text-muted-foreground" />
                      <span>{activeDownloadId === item.id ? "Downloading..." : "Download"}</span>
                    </button>

                    {/* Replace Upload Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[item.id]?.click()}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Upload className="size-3 text-muted-foreground" />
                      <span>Replace</span>
                    </button>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      ref={(el) => {
                        fileInputRefs.current[item.id] = el
                      }}
                      onChange={(e) => handleFileChange(item.id, e)}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Carrier Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/80">
          {/* Ship to */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-normal">Ship to</span>
            <span className="text-sm font-medium text-foreground">
              {order.shipping.name}
            </span>
            <span className="text-xs text-muted-foreground/90 leading-relaxed">
              {order.shipping.address}
            </span>
          </div>

          {/* Carrier */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground font-normal">
              Carrier
            </label>
            <input
              type="text"
              value={carrier}
              onChange={(e) => {
                setCarrier(e.target.value)
                setIsSaved(false)
              }}
              onBlur={handleSaveShipping}
              placeholder="Carrier name"
              className="w-full rounded-md border border-border/80 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>

          {/* Tracking number */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground font-normal">
                Tracking number
              </label>
              {shippingSaved && (
                <span className="text-[10px] text-emerald-400 font-medium">Saved</span>
              )}
            </div>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => {
                setTrackingNumber(e.target.value)
                setIsSaved(false)
              }}
              onBlur={handleSaveShipping}
              placeholder="Enter when available"
              className="w-full rounded-md border border-border/80 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
            />
          </div>
        </div>

        {/* Status history audit trail */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status history
          </span>
          <div className="flex flex-col gap-1.5">
            {order.history.map((entry) => (
              <div
                key={entry.id}
                className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed"
              >
                <span>{entry.time}</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="text-foreground font-medium">{entry.label}</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="text-muted-foreground">{entry.author}</span>
                {entry.emailSent && (
                  <>
                    <span className="mx-1.5 text-muted-foreground/60">·</span>
                    <span className="text-muted-foreground/80">email sent</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
