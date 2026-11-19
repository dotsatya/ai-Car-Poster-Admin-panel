"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PRODUCTION_STAGES,
  INITIAL_PRODUCTION_ORDERS,
  mergeProductionOrders,
  type ProductionOrder,
  type ProductionStage,
  type ProductionFile,
} from "@/lib/demoProduction";
import {
  ArrowLeft,
  Download,
  Upload,
  CheckCircle2,
  Mail,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Eye,
  Image as ImageIcon,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface ProductionOrderDetailProps {
  initialOrder: ProductionOrder;
}

export function ProductionOrderDetail({
  initialOrder,
}: ProductionOrderDetailProps) {
  const [order, setOrder] = React.useState<ProductionOrder>(initialOrder);
  const [carrier, setCarrier] = React.useState(initialOrder.carrier || "");
  const [trackingNumber, setTrackingNumber] = React.useState(
    initialOrder.trackingNumber || "",
  );
  const [shippingSaved, setShippingSaved] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [activeDownloadId, setActiveDownloadId] = React.useState<string | null>(
    null,
  );
  const [isSaved, setIsSaved] = React.useState(true);
  const [previewFile, setPreviewFile] = React.useState<ProductionFile | null>(
    null,
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewFile(null);
    };
    if (previewFile) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [previewFile]);

  // Hidden file input refs for replacing artwork per file
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>(
    {},
  );

  // Load from localStorage if persisted, safely merged
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("production_orders_store");
      if (stored) {
        const merged = mergeProductionOrders(INITIAL_PRODUCTION_ORDERS, stored);
        const match = merged.find(
          (o) => o.cleanId === initialOrder.cleanId || o.id === initialOrder.id,
        );
        if (match) {
          setOrder(match);
          setCarrier(match.carrier || "");
          setTrackingNumber(match.trackingNumber || "");
        }
      }
    } catch {
      // ignore
    }
  }, [initialOrder.cleanId, initialOrder.id]);

  // Save changes to localStorage so overview table and other pages stay synced
  const persistOrder = (updated: ProductionOrder) => {
    setOrder(updated);
    try {
      const stored = localStorage.getItem("production_orders_store");
      const list = mergeProductionOrders(INITIAL_PRODUCTION_ORDERS, stored);
      const index = list.findIndex(
        (o) => o.cleanId === updated.cleanId || o.id === updated.id,
      );
      if (index >= 0) {
        list[index] = updated;
      } else {
        list.push(updated);
      }
      localStorage.setItem("production_orders_store", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Find index of current stage in 8-step process
  const currentStageIndex = PRODUCTION_STAGES.findIndex(
    (s) => s.key === order.stage,
  );

  // Calculate remaining stages after the current stage
  const remainingStages = React.useMemo(() => {
    if (currentStageIndex === -1) return PRODUCTION_STAGES.slice(1);
    return PRODUCTION_STAGES.filter((_, idx) => idx > currentStageIndex);
  }, [currentStageIndex]);

  // Calculate previously completed stages before the current stage
  const previousStages = React.useMemo(() => {
    if (currentStageIndex <= 0) return [];
    return PRODUCTION_STAGES.filter(
      (_, idx) => idx < currentStageIndex,
    ).reverse();
  }, [currentStageIndex]);

  // Selected stage from the remaining stages
  const [selectedTargetStage, setSelectedTargetStage] = React.useState<
    ProductionStage | ""
  >("");

  // Emergency change stage state
  const [isEmergencyExpanded, setIsEmergencyExpanded] = React.useState(false);
  const [emergencyTargetStage, setEmergencyTargetStage] = React.useState<
    ProductionStage | ""
  >("");
  const [emergencyReason, setEmergencyReason] = React.useState("");

  // Confirm emergency stage reversal
  const handleConfirmEmergencyReversal = () => {
    if (!emergencyTargetStage || emergencyTargetStage === order.stage) return;

    const now = new Date();
    const timeStr = `${now.getDate()} Nov ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    const noteText = emergencyReason.trim()
      ? `Emergency reversal: ${emergencyReason.trim()}`
      : `Emergency reversal to previous stage`;

    const rollbackHistoryItem = {
      id: `h-emergency-${Date.now()}`,
      time: timeStr,
      label: `Reversed to ${emergencyTargetStage}`,
      author: "Amit",
      emailSent: false,
      note: noteText,
    };

    const updated: ProductionOrder = {
      ...order,
      stage: emergencyTargetStage,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
      history: [...order.history, rollbackHistoryItem],
    };

    persistOrder(updated);
    setIsSaved(true);
    setSelectedTargetStage("");
    setEmergencyTargetStage("");
    setEmergencyReason("");
    setIsEmergencyExpanded(false);

    showNotification(
      `Emergency reversal applied: Order #${order.cleanId} rolled back to "${emergencyTargetStage}".`,
    );
  };

  // Target stage config
  const targetStageConfig = PRODUCTION_STAGES.find(
    (s) => s.key === selectedTargetStage,
  );

  // Mark as saved action: applies selectedTargetStage (if chosen and different) and persists order
  const handleMarkAsSaved = () => {
    const stageChanged = Boolean(
      selectedTargetStage && selectedTargetStage !== order.stage,
    );

    let newHistory = [...order.history];
    let isEmailNotice = false;

    if (stageChanged && selectedTargetStage) {
      const now = new Date();
      const timeStr = `${now.getDate()} Nov ${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes(),
      ).padStart(2, "0")}`;

      const targetConfig = PRODUCTION_STAGES.find(
        (s) => s.key === selectedTargetStage,
      );
      isEmailNotice = targetConfig?.emailNotice ?? false;

      newHistory.push({
        id: `h-dyn-${Date.now()}`,
        time: timeStr,
        label: selectedTargetStage,
        author: "Amit",
        emailSent: isEmailNotice,
      });
    }

    const nextStage =
      stageChanged && selectedTargetStage ? selectedTargetStage : order.stage;

    const updated: ProductionOrder = {
      ...order,
      stage: nextStage,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
      history: newHistory,
    };

    persistOrder(updated);
    setIsSaved(true);

    if (stageChanged && selectedTargetStage) {
      if (isEmailNotice) {
        showNotification(
          `Stage moved to "${selectedTargetStage}" and saved. Automatic customer notification email sent to ${order.customer?.email || "customer"}.`,
        );
      } else {
        showNotification(
          `Stage moved to "${selectedTargetStage}" and marked as saved.`,
        );
      }
      setSelectedTargetStage("");
    } else {
      showNotification(
        `Order #${order.cleanId} production status marked as saved.`,
      );
    }
  };

  // Handle high-res 300 DPI download
  const handleDownloadFile = (item: ProductionFile) => {
    setActiveDownloadId(item.id);
    showNotification(
      `Downloading 300 DPI high-res file for "${item.title}" (${item.dimensions})...`,
    );

    setTimeout(() => {
      const a = document.createElement("a");
      a.href = item.image || "/template photo/1.webp";
      a.download = `order-${order.cleanId}-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-300dpi.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setActiveDownloadId(null);
    }, 800);
  };

  // Handle file replacement
  const handleFileChange = (
    itemId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const now = new Date();
    const timeStr = `${now.getDate()} Nov ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`;

    const updatedItems = order.items.map((it) => {
      if (it.id === itemId) {
        return {
          ...it,
          image: objectUrl,
          fileStatus: `Replaced by Riya · ${it.dimensions}`,
          replacedBy: "Riya",
        };
      }
      return it;
    });

    const newHistory = [
      ...order.history,
      {
        id: `h-rep-${Date.now()}`,
        time: timeStr,
        label: `Replacement file uploaded for ${updatedItems.find((i) => i.id === itemId)?.title}`,
        author: "Riya",
        emailSent: false,
      },
    ];

    const updated: ProductionOrder = {
      ...order,
      flag: "File replaced",
      items: updatedItems,
      history: newHistory,
    };

    persistOrder(updated);
    setIsSaved(true);
    showNotification(
      `Replacement file uploaded. Set flag to "File replaced" and saved history.`,
    );
  };

  // Save carrier and tracking
  const handleSaveShipping = () => {
    const updated: ProductionOrder = {
      ...order,
      carrier: carrier.trim(),
      trackingNumber: trackingNumber.trim(),
    };
    persistOrder(updated);
    setShippingSaved(true);
    setIsSaved(true);
    setTimeout(() => setShippingSaved(false), 3000);
    showNotification(
      `Shipping carrier & tracking saved for customer tracking.`,
    );
  };

  const getStageBadge = (stage: ProductionStage) => {
    switch (stage) {
      case "Order Received":
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60";
      case "Order Confirmed":
      case "Order confirmed and logged" as any:
        return "bg-violet-950/70 text-violet-400 border-violet-900/70";
      case "Preparing Artwork":
        return "bg-amber-950/70 text-amber-500 border-amber-900/70";
      case "Printing":
        return "bg-blue-950/70 text-blue-400 border-blue-900/70";
      case "Quality Check & Packing":
        return "bg-yellow-950/70 text-yellow-400 border-yellow-900/70";
      case "Shipped":
        return "bg-cyan-950/70 text-cyan-400 border-cyan-900/70";
      case "Out for Delivery":
        return "bg-indigo-950/70 text-indigo-400 border-indigo-900/70";
      case "Delivered":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-900/70";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60";
    }
  };

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
              order.stage,
            )}`}
          >
            {order.stage}
          </span>
        </div>

        {/* 8-Stage Horizontal Stepper */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
          {PRODUCTION_STAGES.map((step, idx) => {
            const isCompletedOrCurrent = idx <= currentStageIndex;
            const isTarget = step.key === selectedTargetStage;
            const isCurrent = step.key === order.stage;

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => {
                  if (!isCurrent) {
                    setSelectedTargetStage(step.key);
                    setIsSaved(false);
                  }
                }}
                disabled={isCurrent}
                className={`flex flex-col gap-2 text-left group ${
                  isCurrent ? "cursor-default" : "cursor-pointer"
                }`}
                title={
                  isCurrent
                    ? `Current stage: ${step.key}`
                    : `Click to select "${step.key}" as next stage`
                }
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
            );
          })}
        </div>

        {/* Move to next stage Section */}
        <div className="flex flex-col gap-2.5 pt-3 pb-3 border-y border-border/70">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Move to next stage
            </h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="size-3.5 text-muted-foreground/70 shrink-0" />
              <span>
                Customer gets an email automatically on printing, shipping &
                delivery
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {remainingStages.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Selector for the next remaining stages */}
                <div className="relative min-w-[210px]">
                  <select
                    value={selectedTargetStage}
                    onChange={(e) => {
                      setSelectedTargetStage(e.target.value as ProductionStage);
                      setIsSaved(false);
                    }}
                    className="w-full appearance-none rounded-md border border-border/90 bg-card px-3.5 py-2 text-sm font-medium text-foreground pr-9 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer shadow-sm"
                  >
                    <option value="" disabled>
                      Select next stage...
                    </option>
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

                {/* Mark as saved Button */}
                <button
                  type="button"
                  onClick={handleMarkAsSaved}
                  className={`rounded-md border text-sm px-3.5 py-2 font-medium flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                    isSaved
                      ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-400 ring-1 ring-emerald-500/20"
                      : "border-primary/60 bg-primary/10 hover:bg-primary/20 text-foreground ring-1 ring-primary/30"
                  }`}
                  title="Click to save and apply selected stage"
                >
                  <CheckCircle2
                    className={`size-4 ${isSaved ? "text-emerald-400" : "text-primary"}`}
                  />
                  <span>{isSaved ? "Marked as saved" : "Mark as saved"}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-md border border-emerald-900/50 bg-emerald-950/50">
                  <CheckCircle2 className="size-3.5" />
                  Order fully completed & delivered
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Separate Section: Emergency Change Stage (Collapsible) */}
        <div className="rounded-md border border-amber-500/35 bg-amber-950/15 p-4 flex flex-col gap-3 transition-all">
          <div
            className={`flex items-center justify-between gap-3 cursor-pointer select-none ${
              isEmergencyExpanded ? "border-b border-amber-500/20 pb-2.5" : ""
            }`}
            onClick={() => setIsEmergencyExpanded(!isEmergencyExpanded)}
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 shrink-0">
                <AlertTriangle className="size-4 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-300">
                  Emergency Change Stage
                </h4>
                <p className="text-xs text-muted-foreground">
                  Roll back this order to a previously completed state to reverse
                  the stage when an issue arises.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEmergencyExpanded(!isEmergencyExpanded);
              }}
              className="p-1.5 px-2.5 rounded-md border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium shrink-0"
              title={
                isEmergencyExpanded
                  ? "Collapse emergency change stage"
                  : "Expand emergency change stage"
              }
              aria-expanded={isEmergencyExpanded}
            >
              <span>{isEmergencyExpanded ? "Collapse" : "Expand"}</span>
              {isEmergencyExpanded ? (
                <ChevronUp className="size-4 text-amber-300" />
              ) : (
                <ChevronDown className="size-4 text-amber-300" />
              )}
            </button>
          </div>

          {isEmergencyExpanded && (
            <>
              {previousStages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1">
                  {/* Select previous stage */}
                  <div className="md:col-span-5 relative">
                    <span className="text-[11px] font-medium text-amber-300/80 block mb-1">
                      Select previously completed state:
                    </span>
                    <div className="relative">
                      <select
                        value={emergencyTargetStage}
                        onChange={(e) =>
                          setEmergencyTargetStage(
                            e.target.value as ProductionStage,
                          )
                        }
                        className="w-full appearance-none rounded-md border border-amber-600/40 bg-[#121315] px-3.5 py-2 text-sm font-medium text-foreground pr-9 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 cursor-pointer shadow-sm"
                      >
                        <option value="" disabled>
                          Select stage to reverse to...
                        </option>
                        {previousStages.map((st) => (
                          <option
                            key={st.key}
                            value={st.key}
                            className="bg-[#121315] text-foreground py-1"
                          >
                            Reverse to: {st.key}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Optional reason / note */}
                  <div className="md:col-span-4">
                    <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Reversal reason (optional):
                    </span>
                    <div className="relative group">
                      <input
                        type="text"
                        value={emergencyReason}
                        onChange={(e) => setEmergencyReason(e.target.value)}
                        placeholder="e.g. Print defect, rework required"
                        className="w-full rounded-md border border-border/80 bg-background/50 pl-3 pr-22 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-colors"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                        Click to edit
                      </span>
                    </div>
                  </div>

                  {/* Confirm Reversal Button */}
                  <div className="md:col-span-3 flex items-end gap-2 pt-4 md:pt-0">
                    <button
                      type="button"
                      onClick={handleConfirmEmergencyReversal}
                      disabled={!emergencyTargetStage}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-amber-600/60 bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 text-sm font-medium px-4 py-2 transition-all shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Confirm Reversal</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic py-1">
                  Order is currently at the initial stage ({order.stage}). There
                  are no previously completed states to reverse to.
                </div>
              )}
            </>
          )}
        </div>

        {/* Print files Section */}
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Print files
          </h3>

          <div className="overflow-x-auto">
            <div className="min-w-[820px]">
              {/* Subheader */}
              <div className="grid grid-cols-12 text-xs font-normal text-muted-foreground/80 pb-2 px-1 border-b border-border/50 gap-4">
                <div className="col-span-3">Artwork</div>
                <div className="col-span-2 text-left">Size x Qty</div>
                <div className="col-span-3 text-left">File</div>
                <div className="col-span-4 text-right pr-1">Action</div>
              </div>

              {/* File Rows */}
              <div className="flex flex-col divide-y divide-border/60">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center py-3.5 px-1 gap-4 hover:bg-muted/20 transition-colors rounded-sm"
                  >
                    {/* Artwork Title & Thumbnail (Clickable Preview) */}
                    <div className="col-span-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPreviewFile(item)}
                        className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none min-w-0"
                        title="Click to view artwork preview and download"
                      >
                        <div
                          className="size-10 sm:size-11 rounded-sm shrink-0 overflow-hidden relative border border-border/60 flex items-center justify-center bg-black/80 transition-all group-hover:border-primary/70 group-hover:shadow-[0_0_12px_rgba(216,49,56,0.25)]"
                          style={{ backgroundColor: item.colorFallback }}
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover transition-transform group-hover:scale-110"
                              sizes="44px"
                            />
                          ) : (
                            <div className="size-full bg-zinc-800" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="size-3.5 text-white drop-shadow" />
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          {item.isCombined && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-950/70 text-blue-400 border border-blue-900/70 w-fit mt-0.5">
                              Combined
                            </span>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Size x Qty */}
                    <div className="col-span-2 text-xs sm:text-sm text-foreground/90 font-normal">
                      {item.size} x {item.qty}
                    </div>

                    {/* File Column: pixel & source details */}
                    <div className="col-span-3 text-xs text-muted-foreground font-normal">
                      <span>{item.fileStatus}</span>
                    </div>

                    {/* Action Column: all action buttons */}
                    <div className="col-span-4 flex items-center justify-end gap-2 pr-1 shrink-0">
                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewFile(item)}
                        title="Preview Artwork"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-2.5 py-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Eye className="size-3 text-muted-foreground" />
                        <span>Preview</span>
                      </button>

                      {/* Download 300 DPI Button */}
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(item)}
                        disabled={activeDownloadId === item.id}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="size-3 text-muted-foreground" />
                        <span>
                          {activeDownloadId === item.id
                            ? "Downloading..."
                            : "Download"}
                        </span>
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
                          fileInputRefs.current[item.id] = el;
                        }}
                        onChange={(e) => handleFileChange(item.id, e)}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Carrier Section */}
        <div className="flex flex-col gap-3 pt-4 border-t border-border/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Shipping & Carrier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ship to */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-normal">
                Ship to
              </span>
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
              <div className="relative group">
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => {
                    setCarrier(e.target.value);
                    setIsSaved(false);
                  }}
                  onBlur={handleSaveShipping}
                  placeholder="Carrier name"
                  className="w-full rounded-md border border-border/80 bg-background/50 pl-3 pr-24 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                  Click to edit
                </span>
              </div>
            </div>

            {/* Tracking number */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground font-normal">
                  Tracking number
                </label>
                {shippingSaved && (
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Saved
                  </span>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                    setIsSaved(false);
                  }}
                  onBlur={handleSaveShipping}
                  placeholder="Enter when available"
                  className="w-full rounded-md border border-border/80 bg-background/50 pl-3 pr-24 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-border focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                  Click to edit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status history audit trail */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border/80">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Status history
          </h3>
          <div className="flex flex-col gap-1.5">
            {order.history.map((entry) => (
              <div
                key={entry.id}
                className="text-xs sm:text-sm text-foreground/80 font-normal leading-relaxed"
              >
                <span>{entry.time}</span>
                <span className="mx-1.5 text-muted-foreground/60">·</span>
                <span className="text-foreground font-medium">
                  {entry.label}
                </span>
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

      {/* Artwork Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Dark Blur Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setPreviewFile(null)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-2xl rounded-xl border border-border/80 bg-[#121315] text-card-foreground shadow-2xl p-5 sm:p-6 space-y-5 my-auto max-h-[92vh] flex flex-col outline-none">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">
                    Artwork Preview
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Production Order {order.id}
                  </span>
                  {previewFile.isCombined ? (
                    <span className="rounded-sm bg-blue-950/80 text-blue-400 border border-blue-800/40 px-2 py-0.5 text-[10px] font-medium leading-none">
                      Combined
                    </span>
                  ) : (
                    <span className="rounded-sm bg-secondary text-muted-foreground border border-border/60 px-2 py-0.5 text-[10px] font-medium leading-none">
                      Individual
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                  {previewFile.title}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body - Image Preview */}
            <div className="relative w-full rounded-lg bg-black/80 border border-border/60 p-3 sm:p-4 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[52vh]">
              {previewFile.image ? (
                <div className="relative w-full h-[46vh] flex items-center justify-center">
                  <Image
                    src={previewFile.image}
                    alt={previewFile.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-contain rounded-md"
                    priority
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground py-16 gap-2">
                  <ImageIcon className="size-12 opacity-30" />
                  <span className="text-xs">No artwork image available</span>
                </div>
              )}
            </div>

            {/* Specifications strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-secondary/30 border border-border/50 rounded-lg p-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Dimensions
                </span>
                <span className="font-medium text-foreground">
                  {previewFile.dimensions}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Print Size
                </span>
                <span className="font-medium text-foreground">
                  {previewFile.size}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Quantity
                </span>
                <span className="font-medium text-foreground">
                  {previewFile.qty}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Status
                </span>
                <span className="font-semibold text-foreground">
                  {previewFile.fileStatus}
                </span>
              </div>
            </div>

            {/* Modal Footer with Download Button */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">
                300 DPI Archival Art Asset
              </span>

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="rounded-md border border-border/80 bg-secondary/40 text-foreground hover:bg-secondary/70 text-xs sm:text-sm font-medium px-4 py-2 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(previewFile)}
                  disabled={activeDownloadId === previewFile.id}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-brand-red-hover text-primary-foreground text-xs sm:text-sm font-medium px-4 py-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download
                    className={`size-4 ${activeDownloadId === previewFile.id ? "animate-bounce" : ""}`}
                  />
                  <span>
                    {activeDownloadId === previewFile.id
                      ? "Downloading..."
                      : "Download 300 DPI Asset"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
