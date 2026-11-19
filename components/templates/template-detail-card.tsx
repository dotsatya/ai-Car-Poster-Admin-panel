"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  FileText,
  ChevronDown,
} from "lucide-react"
import { TemplatePhoto, TEMPLATE_PHOTOS } from "@/lib/templatePhotos"

const ALL_SIZES = ["8 × 10 in", "12 × 18 in", "18 × 24 in", "24 × 36 in"]

const ALL_CATEGORIES = [
  "Heritage Racing",
  "Modern Performance",
  "JDM Icons",
  "Vintage Classic",
  "Technical Spec",
  "Cyberpunk / Neon",
  "Hypercar",
  "Signature Luxury",
  "Atelier Classics",
  "Muscle & Pony",
]

const ALL_TAGS = [
  "Collector's Pick",
  "Most Popular",
  "Trending",
  "New Arrival",
  "Staff Pick",
  "Limited Edition",
  "Bestseller",
  "Record Breaker",
  "V10 Exotica",
  "None",
]

const STORAGE_KEY = "poster_gen_templates_v1"

interface TemplateDetailCardProps {
  template: TemplatePhoto
}

export function TemplateDetailCard({ template: initialTemplate }: TemplateDetailCardProps) {
  const [template, setTemplate] = React.useState<TemplatePhoto>(initialTemplate)
  const [feedback, setFeedback] = React.useState<{ text: string; error?: boolean } | null>(null)

  // Form states
  const [name, setName] = React.useState(initialTemplate.name || "")
  const [vehicle, setVehicle] = React.useState(initialTemplate.vehicle || "")
  const [tag, setTag] = React.useState(initialTemplate.tag || "Collector's Pick")
  const [category, setCategory] = React.useState(initialTemplate.category || "Heritage Racing")
  const [price, setPrice] = React.useState(
    initialTemplate.price !== undefined
      ? initialTemplate.price.toFixed(2)
      : (32.0).toFixed(2)
  )
  const [description, setDescription] = React.useState(initialTemplate.description || "")
  const [eligibleSizes, setEligibleSizes] = React.useState<string[]>(
    initialTemplate.eligibleSizes || ["12 × 18 in", "18 × 24 in", "24 × 36 in"]
  )
  const [allowCustomerText, setAllowCustomerText] = React.useState(
    initialTemplate.allowCustomerText ?? true
  )
  const [maxCustomerTextChars, setMaxCustomerTextChars] = React.useState(
    initialTemplate.maxCustomerTextChars ?? 30
  )
  const [status, setStatus] = React.useState<"Published" | "Draft" | "Archived">(
    initialTemplate.status || "Published"
  )

  // Master asset state
  const [masterAsset, setMasterAsset] = React.useState(
    initialTemplate.masterAsset || initialTemplate.src || "/template photo/2.webp"
  )
  const [masterFileName, setMasterFileName] = React.useState(
    initialTemplate.masterFileName || `${initialTemplate.slug || "template"}-master.png`
  )
  const masterFileInputRef = React.useRef<HTMLInputElement>(null)

  // Thumbnail asset state
  const [thumbAsset, setThumbAsset] = React.useState(
    initialTemplate.src || "/template photo/2.webp"
  )
  const [thumbFileName, setThumbFileName] = React.useState(
    initialTemplate.thumbFileName || `${initialTemplate.slug || "template"}-thumb.webp`
  )
  const thumbFileInputRef = React.useRef<HTMLInputElement>(null)

  // Check localStorage for previously saved edits
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          const found = parsed.find(
            (t: TemplatePhoto) =>
              t.id === initialTemplate.id ||
              t.slug === initialTemplate.slug ||
              t.id.toString() === initialTemplate.id.toString()
          )
          if (found) {
            setTemplate(found)
            setName(found.name || "")
            setVehicle(found.vehicle || "")
            setTag(found.tag || "Collector's Pick")
            setCategory(found.category || "Heritage Racing")
            setPrice(
              found.price !== undefined
                ? found.price.toFixed(2)
                : (32.0).toFixed(2)
            )
            setDescription(found.description || "")
            setEligibleSizes(
              found.eligibleSizes || ["12 × 18 in", "18 × 24 in", "24 × 36 in"]
            )
            setAllowCustomerText(found.allowCustomerText ?? true)
            setMaxCustomerTextChars(found.maxCustomerTextChars ?? 30)
            setStatus(found.status || "Published")
            setMasterAsset(found.masterAsset || found.src || "/template photo/2.webp")
            setMasterFileName(
              found.masterFileName || `${found.slug || "template"}-master.png`
            )
            setThumbAsset(found.src || "/template photo/2.webp")
            setThumbFileName(
              found.thumbFileName || `${found.slug || "template"}-thumb.webp`
            )
          }
        }
      }
    } catch {
      // ignore
    }
  }, [initialTemplate])

  const showNotification = (text: string, error = false) => {
    setFeedback({ text, error })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Toggle eligible size
  function handleToggleSize(size: string) {
    setEligibleSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    )
  }

  // Handle Master Asset file upload
  function handleMasterUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMasterFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setMasterAsset(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Handle Thumbnail file upload
  function handleThumbUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setThumbFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbAsset(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  // Synchronize changes to localStorage
  const syncToStorage = (updated: TemplatePhoto) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      let list: TemplatePhoto[] = []
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed
      }
      if (list.length === 0) {
        list = [...TEMPLATE_PHOTOS]
      }
      const idx = list.findIndex(
        (t) =>
          t.id === updated.id ||
          t.slug === updated.slug ||
          t.id.toString() === updated.id.toString()
      )
      if (idx >= 0) {
        list[idx] = updated
      } else {
        list.push(updated)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  }

  // Submit / Save form
  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!name.trim()) {
      showNotification("Please enter a template name.", true)
      return
    }
    if (!vehicle.trim()) {
      showNotification("Please enter a vehicle name.", true)
      return
    }

    const numericPrice = parseFloat(price) || 32.0

    const updated: TemplatePhoto = {
      ...template,
      name: name.trim(),
      vehicle: vehicle.trim(),
      tag: tag === "None" ? "" : tag,
      category,
      price: numericPrice,
      formattedPrice: `$${numericPrice.toFixed(2)}`,
      formattedStartingPrice: `$${numericPrice.toFixed(2)}`,
      description: description.trim(),
      eligibleSizes,
      allowCustomerText,
      maxCustomerTextChars: Number(maxCustomerTextChars) || 30,
      status,
      masterAsset: masterAsset || template.masterAsset,
      masterFileName,
      src: thumbAsset || template.src,
      thumbFileName,
      lastEdited: "Just now by Riya",
    }

    setTemplate(updated)
    syncToStorage(updated)
    showNotification("Template details saved successfully.")
  }

  // Archive toggle
  function handleArchiveClick() {
    const newStatus = status === "Archived" ? "Published" : "Archived"
    setStatus(newStatus)
    const updated: TemplatePhoto = {
      ...template,
      status: newStatus,
      lastEdited: "Just now by Riya",
    }
    setTemplate(updated)
    syncToStorage(updated)
    showNotification(
      newStatus === "Archived"
        ? "Template moved to Archive."
        : "Template unarchived and active."
    )
  }

  // Publish toggle
  function handlePublishClick() {
    const newStatus = status === "Published" ? "Draft" : "Published"
    setStatus(newStatus)
    const updated: TemplatePhoto = {
      ...template,
      status: newStatus,
      lastEdited: "Just now by Riya",
    }
    setTemplate(updated)
    syncToStorage(updated)
    showNotification(
      newStatus === "Published"
        ? "Template published to public gallery."
        : "Template reverted to Draft."
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      {/* Top back navigation and quick stats */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Templates</span>
        </Link>
        <span className="text-xs text-muted-foreground">
          Template ID: <span className="font-mono text-foreground font-semibold">#{template.id}</span>
        </span>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {name || template.name}
            </h1>
            {status === "Published" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Published
              </span>
            ) : status === "Draft" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border bg-amber-950/70 text-amber-400 border-amber-800/40">
                <span className="size-1.5 rounded-full bg-amber-400" />
                Draft
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-md border bg-zinc-800/70 text-zinc-400 border-zinc-700/40">
                <span className="size-1.5 rounded-full bg-zinc-400" />
                Archived
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Vehicle: <span className="text-foreground font-medium">{vehicle || template.vehicle}</span> • Category: <span className="text-foreground font-medium">{category}</span>
          </p>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={handleArchiveClick}
            className="rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer shadow-sm"
          >
            {status === "Archived" ? "Unarchive" : "Archive"}
          </button>

          <button
            type="button"
            onClick={handlePublishClick}
            className="rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer shadow-sm"
          >
            {status === "Published" ? "Unpublish" : "Publish"}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>Save Changes</span>
          </button>
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
            <AlertCircle className="size-4 shrink-0" />
          ) : (
            <CheckCircle2 className="size-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main 2-Column Responsive Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (2 cols): Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: General Information */}
            <div className="rounded-md border border-border/80 bg-card p-4 sm:p-6 text-card-foreground shadow-sm space-y-5">
              <div className="pb-2 border-b border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Template Information
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Core metadata, naming, automotive brand tag, and customer-facing description.
                </p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Template Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Porsche 911 GT3 RS British Racing Green & Gold"
                      className="w-full rounded-md border border-border/80 bg-[#131418] pl-3.5 pr-24 focus:pr-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>

                {/* Vehicle Name & Tag (2 in a row) */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground block truncate">
                      Vehicle Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        placeholder="e.g. Porsche 911"
                        className="w-full rounded-md border border-border/80 bg-[#131418] pl-3 pr-20 focus:pr-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                        Click to edit
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground block truncate">
                      Tag
                    </label>
                    <div className="relative">
                      <select
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3 pr-8 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
                      >
                        {ALL_TAGS.map((t) => (
                          <option key={t} value={t} className="bg-[#121315] text-foreground">
                            {t}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
                    </div>
                  </div>
                </div>

                {/* Category & Price (2 in a row) */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground block truncate">
                      Category <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none rounded-md border border-border/80 bg-[#131418] pl-3 pr-8 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer"
                      >
                        {ALL_CATEGORIES.map((c) => (
                          <option key={c} value={c} className="bg-[#121315] text-foreground">
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/70" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground block truncate">
                      Price (per poster) <span className="text-primary">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="32.00"
                        className="w-full rounded-md border border-border/80 bg-[#131418] pl-3 pr-20 focus:pr-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] sm:text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                        Click to edit
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Description <span className="text-primary">*</span>
                  </label>
                  <div className="relative group">
                    <textarea
                      rows={4}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Deep British racing green backdrop with distressed gold lettering..."
                      className="w-full rounded-md border border-border/80 bg-[#131418] p-3 pr-24 focus:pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-150 resize-y leading-relaxed"
                    />
                    <span className="pointer-events-none absolute right-3 top-3 text-[11px] font-normal text-muted-foreground/50 group-hover:text-muted-foreground/80 group-focus-within:hidden select-none transition-colors">
                      Click to edit
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Print Sizes & Customization */}
            <div className="rounded-md border border-border/80 bg-card p-4 sm:p-6 text-card-foreground shadow-sm space-y-5">
              <div className="pb-2 border-b border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Print Sizes & Customization
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure available physical dimensions and optional custom customer typography.
                </p>
              </div>

              {/* Eligible Print Sizes */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground block">
                  Eligible print sizes
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {ALL_SIZES.map((size) => {
                    const isSelected = eligibleSizes.includes(size)
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer shadow-sm ${
                          isSelected
                            ? "bg-primary text-primary-foreground border border-primary shadow-xs"
                            : "bg-[#131418] hover:bg-secondary border border-border/80 hover:border-primary/40 text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Customer Text Checkbox & Max Characters */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/50 text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowCustomerText}
                    onChange={(e) => setAllowCustomerText(e.target.checked)}
                    className="size-4 rounded accent-primary cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    Allow optional short text on this template
                  </span>
                </label>

                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto sm:ml-0">
                  <span>Max</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={maxCustomerTextChars}
                    onChange={(e) => setMaxCustomerTextChars(Number(e.target.value))}
                    className="w-14 text-center rounded-md border border-border/80 bg-[#131418] py-1 text-xs text-foreground outline-none focus:border-primary/50"
                  />
                  <span>characters</span>
                </div>
              </div>
            </div>

            {/* Card 3: Usage & History */}
            <div className="rounded-md border border-border/80 bg-card p-4 sm:p-6 text-card-foreground shadow-sm space-y-4">
              <div className="pb-2 border-b border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Usage & Lifecycle
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-md border border-border/60 bg-[#131418]/60 space-y-1">
                  <span className="text-xs text-muted-foreground block">Used in Orders</span>
                  <span className="text-base font-semibold text-foreground">
                    {template.usedInOrders ?? 128} orders
                  </span>
                </div>

                <div className="p-3 rounded-md border border-border/60 bg-[#131418]/60 space-y-1">
                  <span className="text-xs text-muted-foreground block">Last Edited</span>
                  <span className="text-base font-semibold text-foreground">
                    {template.lastEdited ?? "12 Nov by Riya"}
                  </span>
                </div>

                <div className="p-3 rounded-md border border-border/60 bg-[#131418]/60 space-y-1">
                  <span className="text-xs text-muted-foreground block">Starting Price</span>
                  <span className="text-base font-mono font-semibold text-emerald-400">
                    ${parseFloat(price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1 col): Assets & Actions */}
          <div className="space-y-6">
            {/* 1. Master / Reference Asset */}
            <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm space-y-4">
              <div className="pb-2 border-b border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Master Asset (High Resolution)
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Private print reference, never shown directly to customers.
                </p>
              </div>

              <div className="rounded-md border border-dashed border-border/80 bg-[#131418]/60 p-3.5 flex flex-col items-center gap-3">
                <div className="relative aspect-[3/4] w-full max-w-[180px] rounded-sm overflow-hidden border border-border/60 bg-black/80 shadow-md">
                  {masterAsset ? (
                    <Image
                      src={masterAsset}
                      alt="Master asset preview"
                      fill
                      unoptimized
                      sizes="180px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="w-full space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-medium text-foreground truncate">
                    <FileText className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{masterFileName}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    6000 × 8000 px • 300 DPI Archival
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full justify-center sm:justify-start">
                  <input
                    type="file"
                    accept="image/*"
                    ref={masterFileInputRef}
                    onChange={handleMasterUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => masterFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/80 hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer shadow-sm"
                  >
                    <Upload className="size-3.5" />
                    <span>Replace Master</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMasterAsset("")
                      setMasterFileName("no-asset.png")
                    }}
                    title="Remove Master Asset"
                    className="rounded-md border border-border/80 bg-secondary/80 p-1.5 text-xs text-muted-foreground hover:text-rose-400 hover:border-rose-900/60 transition-colors cursor-pointer shadow-sm"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Gallery Thumbnail (Optimized) */}
            <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm space-y-4">
              <div className="pb-2 border-b border-border/60">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Gallery Thumbnail (Optimized)
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Public storefront display asset. WebP optimized.
                </p>
              </div>

              <div className="rounded-md border border-dashed border-border/80 bg-[#131418]/60 p-3.5 flex flex-col items-center gap-3">
                <div className="relative aspect-[3/4] w-full max-w-[180px] rounded-sm overflow-hidden border border-border/60 bg-black/80 shadow-md">
                  {thumbAsset ? (
                    <Image
                      src={thumbAsset}
                      alt="Thumbnail asset preview"
                      fill
                      unoptimized
                      sizes="180px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="w-full space-y-1.5 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-medium text-foreground truncate">
                    <FileText className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{thumbFileName}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    600 × 800 px • Shown in catalog
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 w-full justify-center sm:justify-start">
                  <input
                    type="file"
                    accept="image/*"
                    ref={thumbFileInputRef}
                    onChange={handleThumbUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => thumbFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/80 hover:bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors cursor-pointer shadow-sm"
                  >
                    <Upload className="size-3.5" />
                    <span>Replace Thumbnail</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setThumbAsset("")
                      setThumbFileName("no-thumb.webp")
                    }}
                    title="Remove Thumbnail"
                    className="rounded-md border border-border/80 bg-secondary/80 p-1.5 text-xs text-muted-foreground hover:text-rose-400 hover:border-rose-900/60 transition-colors cursor-pointer shadow-sm"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </h3>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  <Save className="size-4" />
                  <span>Save All Changes</span>
                </button>
                <Link
                  href="/dashboard/templates"
                  className="w-full inline-flex items-center justify-center rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary py-2 text-sm font-medium text-foreground transition-colors cursor-pointer text-center"
                >
                  Return to Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
