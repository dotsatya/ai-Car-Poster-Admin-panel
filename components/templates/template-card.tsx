"use client"

import * as React from "react"
import Image from "next/image"
import { TemplatePhoto } from "@/lib/templatePhotos"

interface TemplateCardProps {
  template: TemplatePhoto
  onSelect?: (template: TemplatePhoto) => void
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const [isConfiguring, setIsConfiguring] = React.useState(false)

  return (
    <div className="group relative flex flex-col justify-between rounded-md border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-red-950/20 overflow-hidden">
      {/* Poster Preview Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/80 border-b border-border/60">
        <Image
          src={template.src}
          alt={template.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 px-2 py-0.5 text-[10px] font-medium text-foreground">
            {template.category}
          </span>
          {template.tag ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/20 backdrop-blur-md border border-primary/40 px-2 py-0.5 text-[10px] font-medium text-primary">
              {template.tag}
            </span>
          ) : null}
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-white drop-shadow-sm">
            {template.formattedStartingPrice}
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
            {template.availableSizes?.map((s) => (
              <span
                key={s.id}
                className="rounded-sm bg-secondary/80 border border-border/60 px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/40 text-xs">
          <span className="text-muted-foreground text-[11px] font-normal">
            {template.availableGsm?.length || 3} Paper Finishes
          </span>
          <button
            type="button"
            onClick={() => {
              setIsConfiguring(!isConfiguring)
              onSelect?.(template)
            }}
            className="rounded-md bg-secondary text-foreground hover:bg-primary/20 hover:text-primary hover:border-primary/40 border border-border/60 px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
          >
            {isConfiguring ? "Configured" : "Configure"}
          </button>
        </div>
      </div>
    </div>
  )
}
