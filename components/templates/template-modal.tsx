"use client"

import * as React from "react"
import Image from "next/image"
import { X, Upload, Trash2, FileText, ChevronDown } from "lucide-react"
import { TemplatePhoto } from "@/lib/templatePhotos"

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

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: TemplatePhoto | null // null for Create mode, TemplatePhoto for Edit mode
  onSave: (updated: TemplatePhoto) => void
  onCreate: (newTemplate: TemplatePhoto) => void
  onArchive?: (template: TemplatePhoto) => void
  onTogglePublish?: (template: TemplatePhoto) => void
}

export function TemplateModal({
  isOpen,
  onClose,
  template,
  onSave,
  onCreate,
  onArchive,
  onTogglePublish,
}: TemplateModalProps) {
  const isEditMode = Boolean(template)

  // Form states
  const [name, setName] = React.useState("")
  const [vehicle, setVehicle] = React.useState("")
  const [tag, setTag] = React.useState("Collector's Pick")
  const [category, setCategory] = React.useState("Heritage Racing")
  const [price, setPrice] = React.useState("32.00")
  const [description, setDescription] = React.useState("")
  const [eligibleSizes, setEligibleSizes] = React.useState<string[]>([
    "12 × 18 in",
    "18 × 24 in",
    "24 × 36 in",
  ])
  const [allowCustomerText, setAllowCustomerText] = React.useState(true)
  const [maxCustomerTextChars, setMaxCustomerTextChars] = React.useState(30)
  const [status, setStatus] = React.useState<"Published" | "Draft" | "Archived">("Published")

  // Master asset state
  const [masterAsset, setMasterAsset] = React.useState("")
  const [masterFileName, setMasterFileName] = React.useState("porsche-911-gt3-rs-master.png")
  const masterFileInputRef = React.useRef<HTMLInputElement>(null)

  // Thumbnail asset state
  const [thumbAsset, setThumbAsset] = React.useState("")
  const [thumbFileName, setThumbFileName] = React.useState("porsche-911-gt3-rs-thumb.webp")
  const thumbFileInputRef = React.useRef<HTMLInputElement>(null)

  // Initialize or reset form fields whenever template or isOpen changes
  React.useEffect(() => {
    if (!isOpen) return

    if (template) {
      // Edit mode: Populate with existing template data
      setName(template.name || "")
      setVehicle(template.vehicle || "")
      setTag(template.tag || "Collector's Pick")
      setCategory(template.category || "Heritage Racing")
      setPrice(
        template.price !== undefined
          ? template.price.toFixed(2)
          : (32.0).toFixed(2)
      )
      setDescription(template.description || "")
      setEligibleSizes(
        template.eligibleSizes || ["12 × 18 in", "18 × 24 in", "24 × 36 in"]
      )
      setAllowCustomerText(template.allowCustomerText ?? true)
      setMaxCustomerTextChars(template.maxCustomerTextChars ?? 30)
      setStatus(template.status || "Published")

      // Image assets
      setMasterAsset(template.masterAsset || template.src || "/template photo/2.webp")
      setMasterFileName(
        template.masterFileName ||
          `${template.slug || "template"}-master.png`
      )
      setThumbAsset(template.src || "/template photo/2.webp")
      setThumbFileName(
        template.thumbFileName ||
          `${template.slug || "template"}-thumb.webp`
      )
    } else {
      // Create mode: Empty/default form fields
      setName("")
      setVehicle("")
      setTag("Collector's Pick")
      setCategory("Heritage Racing")
      setPrice("32.00")
      setDescription("")
      setEligibleSizes(["8 × 10 in", "12 × 18 in", "18 × 24 in", "24 × 36 in"])
      setAllowCustomerText(true)
      setMaxCustomerTextChars(30)
      setStatus("Draft")

      setMasterAsset("/template photo/2.webp")
      setMasterFileName("new-template-master.png")
      setThumbAsset("/template photo/2.webp")
      setThumbFileName("new-template-thumb.webp")
    }
  }, [isOpen, template])

  // Handle ESC key to close
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

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

  // Submit / Save form
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      alert("Please enter a template name.")
      return
    }
    if (!vehicle.trim()) {
      alert("Please enter a vehicle name.")
      return
    }

    const numericPrice = parseFloat(price) || 32.0

    if (isEditMode && template) {
      const updated: TemplatePhoto = {
        ...template,
        name: name.trim(),
        vehicle: vehicle.trim(),
        tag: tag === "None" ? "" : tag,
        category,
        price: numericPrice,
        formattedPrice: `$${numericPrice.toFixed(2)}`,
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
      onSave(updated)
    } else {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const newTemplate: TemplatePhoto = {
        id: Date.now(),
        name: name.trim(),
        slug: slug || `template-${Date.now()}`,
        src: thumbAsset || "/template photo/2.webp",
        vehicle: vehicle.trim(),
        category,
        tag: tag === "None" ? "" : tag,
        description: description.trim(),
        availableSizes: [],
        availableGsm: [],
        pricing: [],
        startingPrice: numericPrice,
        formattedStartingPrice: `$${numericPrice.toFixed(2)}`,
        status: status === "Draft" ? "Draft" : "Published",
        price: numericPrice,
        formattedPrice: `$${numericPrice.toFixed(2)}`,
        eligibleSizes,
        allowCustomerText,
        maxCustomerTextChars: Number(maxCustomerTextChars) || 30,
        masterAsset: masterAsset || "/template photo/2.webp",
        masterFileName,
        thumbFileName,
        usedInOrders: 0,
        lastEdited: "Just now by Riya",
      }
      onCreate(newTemplate)
    }
    onClose()
  }

  // Handle Archive toggle
  function handleArchiveClick() {
    if (!template) return
    const newStatus = status === "Archived" ? "Published" : "Archived"
    setStatus(newStatus)
    const updated: TemplatePhoto = {
      ...template,
      status: newStatus,
      lastEdited: "Just now by Riya",
    }
    onArchive?.(updated)
    onSave(updated)
  }

  // Handle Publish / Unpublish toggle
  function handlePublishClick() {
    if (!template) return
    const newStatus = status === "Published" ? "Draft" : "Published"
    setStatus(newStatus)
    const updated: TemplatePhoto = {
      ...template,
      status: newStatus,
      lastEdited: "Just now by Riya",
    }
    onTogglePublish?.(updated)
    onSave(updated)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-5xl rounded-xl border border-border/80 bg-[#121315] text-card-foreground shadow-2xl p-5 sm:p-7 space-y-6 my-auto max-h-[92vh] overflow-y-auto outline-none"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-4">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-1">
            {isEditMode ? `Edit Template: ${name || template?.name}` : "Create Template"}
          </h2>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Status Pill Badge */}
            {status === "Published" ? (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-emerald-950/70 text-emerald-400 border-emerald-800/40">
                Published
              </span>
            ) : status === "Draft" ? (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-amber-950/70 text-amber-400 border-amber-800/40">
                Draft
              </span>
            ) : (
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-zinc-800/70 text-zinc-400 border-zinc-700/40">
                Archived
              </span>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Porsche 911 GT3 RS British Racing Green & Gold"
                  className="w-full rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>

              {/* Vehicle Name & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Vehicle Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Porsche 911 GT3 RS"
                    className="w-full rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Tag
                  </label>
                  <div className="relative">
                    <select
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
                    >
                      {ALL_TAGS.map((t) => (
                        <option key={t} value={t} className="bg-[#121315] text-foreground">
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                  </div>
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors cursor-pointer pr-9"
                    >
                      {ALL_CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#121315] text-foreground">
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Price (per poster) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="32.00"
                    className="w-full rounded-md border border-border/80 bg-card/60 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deep British racing green backdrop with distressed gold lettering..."
                  className="w-full rounded-md border border-border/80 bg-card/60 p-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Eligible Print Sizes */}
              <div className="space-y-2 pt-1">
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
                            ? "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500"
                            : "bg-card/60 hover:bg-secondary border border-border/80 text-foreground"
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Customer Text Checkbox & Max Characters */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={allowCustomerText}
                    onChange={(e) => setAllowCustomerText(e.target.checked)}
                    className="size-4 rounded border-border/80 bg-card/80 text-primary focus:ring-primary/40 cursor-pointer accent-primary"
                  />
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    Allow optional short text on this template
                  </span>
                </label>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto sm:ml-0">
                  <span>Max</span>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={maxCustomerTextChars}
                    onChange={(e) => setMaxCustomerTextChars(Number(e.target.value))}
                    className="w-12 text-center rounded-md border border-border/80 bg-card/80 py-1 text-xs text-foreground outline-none focus:border-primary/50"
                  />
                  <span>characters</span>
                </div>
              </div>
            </div>

            {/* Right Column: Asset Upload & Previews */}
            <div className="space-y-4">
              {/* 1. Master / Reference Asset */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Master / reference asset (high resolution)
                </label>
                <div className="rounded-md border border-dashed border-border/80 bg-card/30 p-4 flex items-center gap-4">
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-sm overflow-hidden border border-border/60 bg-black/80 shrink-0 shadow-md">
                    {masterAsset ? (
                      <Image
                        src={masterAsset}
                        alt="Master asset preview"
                        fill
                        unoptimized
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Metadata and Actions */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground truncate">
                        <FileText className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{masterFileName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        6000 × 8000 px
                      </p>
                      <p className="text-[11px] text-muted-foreground/70">
                        Private, never shown to customers
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
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
                        className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-sm"
                      >
                        <Upload className="size-3.5" />
                        <span>Replace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMasterAsset("")
                          setMasterFileName("no-asset.png")
                        }}
                        title="Remove Master Asset"
                        className="rounded-md border border-border/80 bg-card p-1.5 text-xs text-muted-foreground hover:text-rose-400 hover:border-rose-800 transition-colors cursor-pointer shadow-sm"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Gallery Thumbnail (Optimized) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground block">
                  Gallery thumbnail (optimized)
                </label>
                <div className="rounded-md border border-dashed border-border/80 bg-card/30 p-4 flex items-center gap-4">
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-[3/4] w-28 sm:w-32 rounded-sm overflow-hidden border border-border/60 bg-black/80 shrink-0 shadow-md">
                    {thumbAsset ? (
                      <Image
                        src={thumbAsset}
                        alt="Thumbnail asset preview"
                        fill
                        unoptimized
                        sizes="128px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Metadata and Actions */}
                  <div className="flex flex-col justify-between flex-1 min-w-0 space-y-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground truncate">
                        <FileText className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{thumbFileName}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        600 × 800 px
                      </p>
                      <p className="text-[11px] text-muted-foreground/70">
                        Shown in the public gallery
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
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
                        className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors cursor-pointer shadow-sm"
                      >
                        <Upload className="size-3.5" />
                        <span>Replace</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setThumbAsset("")
                          setThumbFileName("no-thumb.webp")
                        }}
                        title="Remove Thumbnail"
                        className="rounded-md border border-border/80 bg-card p-1.5 text-xs text-muted-foreground hover:text-rose-400 hover:border-rose-800 transition-colors cursor-pointer shadow-sm"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
            {/* Left metadata info */}
            <div className="text-xs text-muted-foreground text-center sm:text-left">
              {isEditMode ? (
                <span>
                  Used in {template?.usedInOrders ?? 128} orders • Last edited{" "}
                  {template?.lastEdited ?? "12 Nov by Riya"}
                </span>
              ) : (
                <span>
                  New template will be saved to your catalog and visible in the dashboard.
                </span>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5">
              {isEditMode ? (
                <>
                  <button
                    type="button"
                    onClick={handleArchiveClick}
                    className="rounded-md border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-border transition-colors cursor-pointer shadow-sm"
                  >
                    {status === "Archived" ? "Unarchive" : "Archive"}
                  </button>

                  <button
                    type="button"
                    onClick={handlePublishClick}
                    className="rounded-md border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-border transition-colors cursor-pointer shadow-sm"
                  >
                    {status === "Published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    type="submit"
                    className="rounded-md bg-white text-black hover:bg-zinc-200 px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-border/80 bg-card/80 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary hover:border-border transition-colors cursor-pointer shadow-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-md bg-white text-black hover:bg-zinc-200 px-4 py-2 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    Create Template
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
