"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink, Download, Check } from "lucide-react"
import { DemoOrder } from "@/lib/demoOrder"

interface OrderDetailCardProps {
  order: DemoOrder
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  const [note, setNote] = React.useState("")
  const [savedNotes, setSavedNotes] = React.useState<string[]>(order.notes || [])
  const [isSaved, setIsSaved] = React.useState(false)

  function handleSaveNote(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setSavedNotes((prev) => [...prev, note.trim()])
    setNote("")
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  function handleDownloadArt(itemName: string) {
    alert(`Downloading 300 DPI museum-grade print asset for: ${itemName}`)
  }

  const getPaymentBadge = (status: DemoOrder["payment"]["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
      case "Pending":
        return "bg-amber-950/60 text-amber-400 border-amber-800/40"
      case "Refunded":
        return "bg-rose-950/60 text-rose-400 border-rose-800/40"
      case "Cancelled":
        return "bg-zinc-800/60 text-zinc-400 border-zinc-700/40"
    }
  }

  const getStageBadge = (stage: DemoOrder["stage"]) => {
    switch (stage) {
      case "Printing":
      case "Painting":
        return "bg-blue-950/70 text-blue-400 border-blue-800/40"
      case "Shipped":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40"
      case "Received":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40"
      case "Packing":
        return "bg-purple-950/70 text-purple-400 border-purple-800/40"
      case "Delivered":
        return "bg-teal-950/70 text-teal-400 border-teal-800/40"
      case "None":
        return null
    }
  }

  const stageBadge = getStageBadge(order.stage)

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
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Order {order.id}
          </h1>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getPaymentBadge(
                order.payment.status
              )}`}
            >
              {order.payment.status}
            </span>
            {stageBadge ? (
              <span
                className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${stageBadge}`}
              >
                {order.stage}
              </span>
            ) : null}
          </div>
        </div>

        {/* Customer / Shipping / Payment Metadata: 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {/* Customer */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground">
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
            <span className="text-xs font-normal text-muted-foreground">
              Ship to
            </span>
            <p className="text-sm font-normal text-foreground leading-tight">
              {order.shipping.address}
            </p>
            <p className="text-sm font-normal text-muted-foreground">
              {order.shipping.cityStateZip}, {order.shipping.country}
            </p>
          </div>

          {/* Payment */}
          <div className="space-y-1">
            <span className="text-xs font-normal text-muted-foreground">
              Payment
            </span>
            <p className="text-sm font-normal text-foreground leading-tight">
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
                <tr className="border-b border-border/40 text-xs font-normal text-muted-foreground">
                  <th className="pb-2.5 font-normal">Artwork</th>
                  <th className="pb-2.5 font-normal">Size</th>
                  <th className="pb-2.5 font-normal">Qty</th>
                  <th className="pb-2.5 font-normal">Unit</th>
                  <th className="pb-2.5 font-normal">Line total</th>
                  <th className="pb-2.5 font-normal w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {order.items.map((art) => (
                  <tr key={art.id} className="hover:bg-secondary/20 transition-colors">
                    {/* Artwork name & poster photo thumbnail */}
                    <td className="py-4">
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

                    <td className="py-4 font-normal text-foreground text-sm">
                      {art.size}
                    </td>

                    <td className="py-4 font-normal text-foreground text-sm">
                      {art.qty}
                    </td>

                    <td className="py-4 font-normal text-foreground text-sm">
                      {art.unitPrice}
                    </td>

                    <td className="py-4 font-medium text-foreground text-sm">
                      {art.lineTotal}
                    </td>

                    <td className="py-4 text-right">
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
          <div className="flex items-center justify-end gap-6 pt-5 pb-2 text-sm border-b border-border/40">
            <span className="font-normal text-foreground">
              Subtotal <span className="font-medium">{order.subtotal}</span>
            </span>
            <span className="font-normal text-foreground">
              Shipping <span className="font-medium">{order.shippingFee}</span>
            </span>
            <span className="font-semibold text-foreground text-base">
              Total {order.total}
            </span>
          </div>
        </div>

        {/* Bottom Section: Status history (left) and Internal notes (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* Status history */}
          <div className="space-y-2">
            <span className="text-xs font-normal text-muted-foreground block mb-2">
              Status history
            </span>
            <div className="space-y-2">
              {order.statusHistory.map((step, idx) => (
                <div
                  key={idx}
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <span className="size-1.5 rounded-full bg-primary/80 shrink-0" />
                  <span>
                    {step.time} · {step.label}
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
                  className="rounded-md border border-border/80 bg-card px-4 py-1.5 text-sm font-medium text-foreground hover:bg-secondary hover:border-primary/40 transition-colors cursor-pointer shadow-sm"
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
    </div>
  )
}
