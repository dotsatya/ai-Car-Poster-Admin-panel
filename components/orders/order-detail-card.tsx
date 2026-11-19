"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Check,
  ArrowRight,
  X,
  Eye,
  User,
  Image as ImageIcon,
} from "lucide-react";
import { DemoOrder, OrderItem } from "@/lib/demoOrder";

interface OrderDetailCardProps {
  order: DemoOrder;
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  const [note, setNote] = React.useState("");
  const [savedNotes, setSavedNotes] = React.useState<string[]>(
    order.notes || [],
  );
  const [isSaved, setIsSaved] = React.useState(false);
  const [currentStage, setCurrentStage] = React.useState<DemoOrder["stage"]>(
    order.stage,
  );
  const [previewArtwork, setPreviewArtwork] = React.useState<OrderItem | null>(null);
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);
  const [downloadToast, setDownloadToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewArtwork(null);
      }
    };
    if (previewArtwork) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [previewArtwork]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("production_orders_store");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const match = parsed.find(
            (p: any) =>
              (p.cleanId && p.cleanId === order.cleanId) ||
              (p.id && (p.id === order.id || p.id === `#${order.cleanId}`)),
          );
          if (match?.stage) {
            let s = match.stage;
            if (s === "Received") s = "Order Received";
            else if (s === "Preparing artwork") s = "Preparing Artwork";
            else if (
              s === "Sent to printer" ||
              s === "Order confirmed and logged"
            )
              s = "Order Confirmed";
            else if (s === "Ready for shipment") s = "Quality Check & Packing";
            else if (s === "Completed") s = "Delivered";
            setCurrentStage(s);
          }
        }
      }
    } catch {
      // ignore
    }
  }, [order.cleanId, order.id]);

  function handleSaveNote(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSavedNotes((prev) => [...prev, note.trim()]);
    setNote("");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }

  const handleDownloadArt = async (artItem: OrderItem) => {
    const imageSrc = artItem.image || "/template photo/1.webp";
    const cleanArtName = artItem.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const ext = imageSrc.includes(".")
      ? imageSrc.split(".").pop()?.split("?")[0] || "webp"
      : "webp";
    const fileName = `order-${order.cleanId}-${cleanArtName || "artwork"}.${ext}`;

    setDownloadingId(artItem.id);
    setDownloadToast(`Downloading "${artItem.name}"...`);

    try {
      const response = await fetch(imageSrc);
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadToast(`Downloaded "${artItem.name}"`);
    } catch {
      // Fallback: direct anchor download
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadToast(`Downloaded "${artItem.name}"`);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
      setTimeout(() => setDownloadToast(null), 3500);
    }
  };

  const getPaymentBadge = (status: DemoOrder["payment"]["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40";
      case "Pending":
        return "bg-amber-950/60 text-amber-400 border-amber-800/40";
      case "Refunded":
        return "bg-rose-950/60 text-rose-400 border-rose-800/40";
      case "Cancelled":
        return "bg-zinc-800/60 text-zinc-400 border-zinc-700/40";
    }
  };

  const getStageBadge = (stage: DemoOrder["stage"]) => {
    switch (stage) {
      case "Order Received":
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60";
      case "Order Confirmed":
      case "Order confirmed and logged" as any:
        return "bg-violet-950/70 text-violet-400 border-violet-800/40";
      case "Preparing Artwork":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40";
      case "Printing":
        return "bg-blue-950/70 text-blue-400 border-blue-800/40";
      case "Quality Check & Packing":
        return "bg-yellow-950/70 text-yellow-400 border-yellow-800/40";
      case "Shipped":
        return "bg-cyan-950/70 text-cyan-400 border-cyan-800/40";
      case "Out for Delivery":
        return "bg-indigo-950/70 text-indigo-400 border-indigo-800/40";
      case "Delivered":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700/60";
    }
  };

  const stageBadge = getStageBadge(currentStage || order.stage);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Back to orders navigation */}
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to orders</span>
        </Link>
      </div>

      {/* Main Order Card */}
      <div className="rounded-md border border-border/80 bg-card p-4 sm:p-6 text-card-foreground shadow-sm space-y-6">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Order {order.id}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getPaymentBadge(
                  order.payment.status,
                )}`}
              >
                {order.payment.status}
              </span>
              {stageBadge ? (
                <span
                  className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${stageBadge}`}
                >
                  {currentStage || order.stage}
                </span>
              ) : null}
            </div>
          </div>
          {/* Update Stage / Update Status button */}
          <Link
            href={`/dashboard/production/${order.cleanId}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 hover:bg-primary/20 text-foreground hover:text-white text-xs sm:text-sm font-medium px-4 py-2 transition-all shadow-sm active:scale-[0.98] w-fit group"
            title="Open this order in Production queue to update stage"
          >
            <span>
              <span className="hidden sm:inline">Go to Production Page and update the current Stage</span>
              <span className="sm:hidden">Update Stage in Production</span>
            </span>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Customer / Shipping / Payment Metadata (2 items per row on mobile) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-2">
          {/* Customer */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block truncate">
              Customer
            </span>
            <p className="text-xs sm:text-sm font-medium text-foreground leading-tight truncate">
              {order.customer.email}
            </p>
            <p className="text-xs sm:text-sm font-normal text-muted-foreground truncate">
              {order.customer.name}, {order.customer.phone}
            </p>
            <div className="pt-2">
              <Link
                href={
                  order.customer.cleanId
                    ? `/dashboard/customers/${order.customer.cleanId}`
                    : `/dashboard/customers?search=${encodeURIComponent(order.customer.email)}`
                }
                className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium text-foreground transition-all cursor-pointer shadow-xs group w-fit"
                title={`View customer details for ${order.customer.name}`}
              >
                <User className="size-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                <span className="truncate">Customer details</span>
                <ArrowRight className="size-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
              </Link>
            </div>
          </div>

          {/* Ship to */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block truncate">
              Ship to
            </span>
            <p className="text-xs sm:text-sm font-medium text-foreground leading-tight truncate">
              {order.shipping.address}
            </p>
            <p className="text-xs sm:text-sm font-normal text-muted-foreground truncate">
              {order.shipping.cityStateZip}, {order.shipping.country}
            </p>
          </div>

          {/* Payment */}
          <div className="space-y-1 col-span-2 md:col-span-1">
            <span className="text-xs font-normal text-muted-foreground block truncate">
              Payment
            </span>
            <p className="text-xs sm:text-sm font-medium text-foreground leading-tight">
              Stripe ref {order.payment.stripeRef}
            </p>
            <a
              href={order.payment.stripeUrl || "https://stripe.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-normal text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              <span>Open in Stripe</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        {/* Artwork items section */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Artwork items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                  <th className="py-3.5 px-4 font-medium whitespace-nowrap">Artwork</th>
                  <th className="py-3.5 px-4 font-medium whitespace-nowrap">Size</th>
                  <th className="py-3.5 px-4 font-medium whitespace-nowrap">Qty</th>
                  <th className="py-3.5 px-4 font-medium whitespace-nowrap">Unit</th>
                  <th className="py-3.5 px-4 font-medium whitespace-nowrap">Line total</th>
                  <th className="py-3.5 px-4 font-medium w-10 text-right whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {order.items.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    {/* Artwork name & poster photo thumbnail (Clickable trigger for pop up modal) */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setPreviewArtwork(art)}
                        className="flex items-center gap-3.5 text-left group cursor-pointer w-full focus:outline-none"
                        title="Click to view artwork preview and download"
                      >
                        <div className="relative size-12 rounded-sm overflow-hidden bg-black/60 border border-border/60 shrink-0 shadow-sm transition-all duration-200 group-hover:border-primary/70 group-hover:shadow-[0_0_12px_rgba(216,49,56,0.25)]">
                          {art.image ? (
                            <Image
                              src={art.image}
                              alt={art.name}
                              fill
                              sizes="48px"
                              className="object-cover transition-transform duration-200 group-hover:scale-110"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              ART
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="size-4 text-white drop-shadow" />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          {art.type === "Combined" ? (
                            <span className="inline-block w-fit rounded-sm bg-blue-950/80 text-blue-400 border border-blue-800/40 px-2 py-0.5 text-[10px] font-medium leading-none">
                              Combined
                            </span>
                          ) : (
                            <span className="text-xs font-normal text-muted-foreground">
                              Individual
                            </span>
                          )}
                        </div>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-normal text-foreground text-sm whitespace-nowrap">
                      {art.size}
                    </td>

                    <td className="py-3.5 px-4 font-normal text-foreground text-sm whitespace-nowrap">
                      {art.qty}
                    </td>

                    <td className="py-3.5 px-4 font-normal text-foreground text-sm whitespace-nowrap">
                      {art.unitPrice}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground text-sm whitespace-nowrap">
                      {art.lineTotal}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewArtwork(art)}
                          title="Preview Artwork"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadArt(art)}
                          disabled={downloadingId === art.id}
                          title="Download Artwork Picture"
                          className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer disabled:opacity-50"
                        >
                          <Download
                            className={`size-4 ${
                              downloadingId === art.id
                                ? "animate-bounce text-primary"
                                : ""
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal / Shipping / Total Line */}
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-6 pt-5 pb-1 text-xs sm:text-sm">
            <span className="font-normal text-muted-foreground">
              Subtotal{" "}
              <span className="font-normal text-foreground">
                {order.subtotal}
              </span>
            </span>
            <span className="font-normal text-muted-foreground">
              Shipping{" "}
              <span className="font-normal text-foreground">
                {order.shippingFee}
              </span>
            </span>
            <span className="font-bold text-foreground text-sm sm:text-base ml-1 sm:ml-2">
              Total {order.total}
            </span>
          </div>
        </div>

        {/* Bottom Section: Status history (left) and Internal notes (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Status history */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Status history
            </h3>
            <div className="space-y-2">
              {order.statusHistory.map((step, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-semibold text-foreground">
                    {step.time}
                  </span>
                  <span className="text-muted-foreground/80"> · </span>
                  <span className="font-normal text-muted-foreground">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Internal notes */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Internal notes
            </h3>
            <form onSubmit={handleSaveNote} className="space-y-2">
              <div className="relative group">
                <textarea
                  rows={3}
                  placeholder="Add a note for staff"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-md border border-border/80 bg-background/50 p-3 pr-24 focus:pr-3 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150 resize-y"
                />
                <span className="pointer-events-none absolute right-3 top-3 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                  Click to edit
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border/80 bg-card/80 px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm"
                >
                  Save note
                </button>
                {isSaved ? (
                  <span className="text-xs text-emerald-400 font-medium inline-flex items-center gap-1">
                    <Check className="size-3.5" /> Note saved
                  </span>
                ) : null}
              </div>

              {/* Display previously saved notes if any */}
              {savedNotes.length > 0 ? (
                <div className="mt-3 space-y-1.5 border-t border-border/40 pt-2">
                  {savedNotes.map((n, i) => (
                    <div
                      key={i}
                      className="rounded-md bg-secondary/40 border border-border/40 p-2 text-xs text-foreground/90"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>

      {/* Artwork Preview Modal */}
      {previewArtwork && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Dark Blur Backdrop */}
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
            onClick={() => setPreviewArtwork(null)}
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
                    Order {order.id}
                  </span>
                  {previewArtwork.type === "Combined" ? (
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
                  {previewArtwork.name}
                </h3>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setPreviewArtwork(null)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-secondary cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body - Image Preview */}
            <div className="relative w-full rounded-lg bg-black/80 border border-border/60 p-3 sm:p-4 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[52vh]">
              {previewArtwork.image ? (
                <div className="relative w-full h-[46vh] flex items-center justify-center">
                  <Image
                    src={previewArtwork.image}
                    alt={previewArtwork.name}
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
                <span className="text-muted-foreground block text-[11px]">Print Size</span>
                <span className="font-medium text-foreground">{previewArtwork.size}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Quantity</span>
                <span className="font-medium text-foreground">{previewArtwork.qty}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Unit Price</span>
                <span className="font-medium text-foreground">{previewArtwork.unitPrice}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Line Total</span>
                <span className="font-semibold text-foreground">{previewArtwork.lineTotal}</span>
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
                  onClick={() => setPreviewArtwork(null)}
                  className="rounded-md border border-border/80 bg-secondary/40 text-foreground hover:bg-secondary/70 text-xs sm:text-sm font-medium px-4 py-2 transition-colors cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadArt(previewArtwork)}
                  disabled={downloadingId === previewArtwork.id}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-primary hover:bg-brand-red-hover text-primary-foreground text-xs sm:text-sm font-medium px-4 py-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className={`size-4 ${downloadingId === previewArtwork.id ? "animate-bounce" : ""}`} />
                  <span>
                    {downloadingId === previewArtwork.id ? "Downloading..." : "Download Picture"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-zinc-900 border border-primary/40 text-foreground px-4 py-2.5 rounded-md shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <Check className="size-4 text-primary shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
}
