"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Check,
  SlidersHorizontal,
  ArrowRight,
  WandSparkles,
  Package,
} from "lucide-react";
import { DemoOrder } from "@/lib/demoOrder";

interface OrderDetailCardProps {
  order: DemoOrder;
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  const router = useRouter();
  const [note, setNote] = React.useState("");
  const [savedNotes, setSavedNotes] = React.useState<string[]>(
    order.notes || [],
  );
  const [isSaved, setIsSaved] = React.useState(false);
  const [currentStage, setCurrentStage] = React.useState<DemoOrder["stage"]>(
    order.stage,
  );

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

  function handleDownloadArt(itemName: string) {
    alert(`Downloading 300 DPI museum-grade print asset for: ${itemName}`);
  }

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
    <div className="flex flex-col gap-4 max-w-5xl">
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
      <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-6">
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
            <p>Go to Production Page and uypdate the current Stage</p>
            <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Customer / Shipping / Payment Metadata: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Customer */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block">
              Customer
            </span>
            <p className="text-sm font-medium text-foreground leading-tight">
              {order.customer.email}
            </p>
            <p className="text-sm font-normal text-muted-foreground">
              {order.customer.name}, {order.customer.phone}
            </p>
          </div>

          {/* Ship to */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block">
              Ship to
            </span>
            <p className="text-sm font-medium text-foreground leading-tight">
              {order.shipping.address}
            </p>
            <p className="text-sm font-normal text-muted-foreground">
              {order.shipping.cityStateZip}, {order.shipping.country}
            </p>
          </div>

          {/* Payment */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground block">
              Payment
            </span>
            <p className="text-sm font-medium text-foreground leading-tight">
              Stripe ref {order.payment.stripeRef}
            </p>
            <a
              href={order.payment.stripeUrl || "https://stripe.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-normal text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              <span>Open in Stripe</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>

        {/* Artwork items section */}
        <div className="pt-2">
          <span className="text-xs font-normal text-muted-foreground block mb-3">
            Artwork items
          </span>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                  <th className="py-3.5 px-4 font-medium">Artwork</th>
                  <th className="py-3.5 px-4 font-medium">Size</th>
                  <th className="py-3.5 px-4 font-medium">Qty</th>
                  <th className="py-3.5 px-4 font-medium">Unit</th>
                  <th className="py-3.5 px-4 font-medium">Line total</th>
                  <th className="py-3.5 px-4 font-medium w-10 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {order.items.map((art) => (
                  <tr
                    key={art.id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    {/* Artwork name & poster photo thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative size-12 rounded-sm overflow-hidden bg-black/60 border border-border/60 shrink-0 shadow-sm">
                          {art.image ? (
                            <Image
                              src={art.image}
                              alt={art.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              ART
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground text-sm leading-snug">
                            {art.name}
                          </span>
                          {art.type === "Combined" ? (
                            <span className="inline-block mt-1 w-fit rounded-sm bg-blue-950/80 text-blue-400 border border-blue-800/40 px-2 py-0.5 text-[10px] font-medium leading-none">
                              Combined
                            </span>
                          ) : (
                            <span className="text-xs font-normal text-muted-foreground mt-0.5">
                              Individual
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-normal text-foreground text-sm">
                      {art.size}
                    </td>

                    <td className="py-3.5 px-4 font-normal text-foreground text-sm">
                      {art.qty}
                    </td>

                    <td className="py-3.5 px-4 font-normal text-foreground text-sm">
                      {art.unitPrice}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground text-sm">
                      {art.lineTotal}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadArt(art.name)}
                        title="Download Artwork"
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary cursor-pointer"
                      >
                        <Download className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotal / Shipping / Total Line */}
          <div className="flex items-center justify-end gap-6 pt-5 pb-1 text-sm">
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
            <span className="font-bold text-foreground text-sm sm:text-base ml-2">
              Total {order.total}
            </span>
          </div>
        </div>

        {/* Bottom Section: Status history (left) and Internal notes (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Status history */}
          <div className="space-y-2">
            <span className="text-xs font-normal text-muted-foreground block mb-3">
              Status history
            </span>
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
            <span className="text-xs font-normal text-muted-foreground block mb-2">
              Internal notes
            </span>
            <form onSubmit={handleSaveNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Add a note for staff"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-md border border-border/80 bg-background/50 p-3 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-y"
              />

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

        {/* Customer's Recent AI Generations (Max 5 Latest) */}
        <div className="pt-4 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal text-muted-foreground block">
                Customer&apos;s Recent AI Generations
              </span>
              <span className="text-xs text-muted-foreground">
                (Latest {order.customerRecentGenerations?.length || 0})
              </span>
            </div>
            <Link
              href={`/dashboard/ai-generations?search=${encodeURIComponent(order.customer.email)}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              <WandSparkles className="size-3 text-muted-foreground" />
              <span>View All Generations</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                  <th className="py-3.5 px-4 font-medium">Date</th>
                  <th className="py-3.5 px-4 font-medium">Template</th>
                  <th className="py-3.5 px-4 font-medium">Type</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {!order.customerRecentGenerations ||
                order.customerRecentGenerations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 px-4 text-center text-xs text-muted-foreground"
                    >
                      No recent AI generations recorded for this customer.
                    </td>
                  </tr>
                ) : (
                  order.customerRecentGenerations.map((gen) => (
                    <tr
                      key={gen.id}
                      onClick={() =>
                        router.push(`/dashboard/ai-generations/${gen.jobId}`)
                      }
                      className="hover:bg-secondary/20 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                        {gen.date}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-foreground text-sm">
                        {gen.template}
                      </td>
                      <td className="py-3.5 px-4 font-normal text-muted-foreground text-sm">
                        {gen.type}
                      </td>
                      <td className="py-3.5 px-4">
                        {gen.status === "Completed" ? (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                            Completed
                          </span>
                        ) : gen.status === "Processing" ? (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-amber-950/70 text-amber-400 border-amber-800/40">
                            Processing
                          </span>
                        ) : gen.status === "Queued" ? (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-zinc-800/70 text-zinc-300 border-zinc-700/40">
                            Queued
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-rose-950/70 text-rose-400 border-rose-800/40">
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer's Recent Orders (Max 5 Latest) */}
        <div className="pt-4 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-normal text-muted-foreground block">
                Customer&apos;s Other Recent Orders
              </span>
              <span className="text-xs text-muted-foreground">
                (Latest {order.customerRecentOrders?.length || 0})
              </span>
            </div>
            <Link
              href={`/dashboard/orders?search=${encodeURIComponent(order.customer.email)}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
            >
              <Package className="size-3 text-muted-foreground" />
              <span>View All Order History</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
                  <th className="py-3.5 px-4 font-medium">Order</th>
                  <th className="py-3.5 px-4 font-medium">Items</th>
                  <th className="py-3.5 px-4 font-medium">Total</th>
                  <th className="py-3.5 px-4 font-medium">Payment</th>
                  <th className="py-3.5 px-4 font-medium">Stage</th>
                  <th className="py-3.5 px-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {!order.customerRecentOrders ||
                order.customerRecentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 px-4 text-center text-xs text-muted-foreground"
                    >
                      No other orders recorded for this customer.
                    </td>
                  </tr>
                ) : (
                  order.customerRecentOrders.map((ord) => {
                    const isCurrent = ord.cleanId === order.cleanId;
                    return (
                      <tr
                        key={ord.id}
                        onClick={() =>
                          router.push(`/dashboard/orders/${ord.cleanId}`)
                        }
                        className={`transition-colors cursor-pointer group ${
                          isCurrent
                            ? "bg-secondary/40 font-medium"
                            : "hover:bg-secondary/20"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                          {ord.id}{" "}
                          {isCurrent && (
                            <span className="text-[10px] text-primary font-normal ml-1 border border-primary/40 bg-primary/10 px-1.5 py-0.2 rounded">
                              Current
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-normal text-foreground text-sm">
                          {ord.itemsCount}{" "}
                          {ord.itemsCount === 1 ? "item" : "items"}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                          {ord.total}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getPaymentBadge(
                              ord.payment,
                            )}`}
                          >
                            {ord.payment}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getStageBadge(
                              ord.stage,
                            )}`}
                          >
                            {ord.stage}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-normal text-muted-foreground text-sm">
                          {ord.date}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
