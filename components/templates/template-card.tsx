"use client"

import * as React from "react"
import Image from "next/image"
import { Edit2 } from "lucide-react"
import { TemplatePhoto } from "@/lib/templatePhotos"

interface TemplateCardProps {
  template: TemplatePhoto
  onSelect?: (template: TemplatePhoto) => void
  onEdit?: (template: TemplatePhoto) => void
}

export function TemplateCard({ template, onSelect, onEdit }: TemplateCardProps) {
  const displayPrice = template.price !== undefined
    ? `$${template.price.toFixed(2)}`
    : template.formattedStartingPrice || "$32.00"

  return (
    <div className="group relative flex flex-col justify-between rounded-md border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-red-950/20 overflow-hidden">
      {/* Poster Preview Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/80 border-b border-border/60">
        <Image
          src={template.src}
          alt={template.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] font-medium text-foreground">
            {template.category}
          </span>
          <div className="flex items-center gap-1.5">
            {template.status === "Draft" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-950/80 backdrop-blur-md border border-amber-800/60 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                Draft
              </span>
            ) : template.status === "Archived" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-900/80 backdrop-blur-md border border-zinc-700/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                Archived
              </span>
            ) : null}
          </div>
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-white drop-shadow-sm">
            {displayPrice}
          </span>
          <span className="text-[10px] font-medium text-zinc-300 bg-black/60 px-1.5 py-0.5 rounded-sm">
            300 DPI
          </span>
        </div>
      </div>

      {/* Poster Details */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-xs font-normal text-muted-foreground mt-1 line-clamp-1">
            {template.vehicle}
          </p>

          {/* Available Sizes Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {template.eligibleSizes && template.eligibleSizes.length > 0
              ? template.eligibleSizes.map((sizeName) => (
                  <span
                    key={sizeName}
                    className="rounded-sm bg-secondary/80 border border-border/60 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground"
                  >
                    {sizeName}
                  </span>
                ))
              : template.availableSizes?.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-sm bg-secondary/80 border border-border/60 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground"
                  >
                    {s.name}
                  </span>
                ))}
          </div>
        </div>

        {/* Footer Actions: Edit button */}
        <div className="flex items-center justify-end pt-3 mt-3 border-t border-border/40 text-xs">
          <button
            type="button"
            onClick={() => {
              onEdit?.(template)
              onSelect?.(template)
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Edit2 className="size-3 text-muted-foreground" />
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  )
}
