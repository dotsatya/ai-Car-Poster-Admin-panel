"use client"

import * as React from "react"
import Image from "next/image"
import { TemplatePhoto } from "@/lib/templatePhotos"
import { Edit2 } from "lucide-react"

const PAGE_SIZE = 10

interface TemplateTableProps {
  templates: TemplatePhoto[]
  onSelectTemplate?: (template: TemplatePhoto) => void
  onEditTemplate?: (template: TemplatePhoto) => void
}

export function TemplateTable({
  templates,
  onSelectTemplate,
  onEditTemplate,
}: TemplateTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)

  // Reset to page 1 whenever the templates list length changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [templates.length])

  // Pagination calculations: 10 templates per page
  const totalPages = Math.max(1, Math.ceil(templates.length / PAGE_SIZE))
  const validPage = Math.min(currentPage, totalPages)
  const startIndex = (validPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, templates.length)
  const paginatedTemplates = templates.slice(startIndex, endIndex)

  if (templates.length === 0) {
    return (
      <div className="rounded-md border border-border/80 bg-card p-12 text-center text-muted-foreground shadow-sm">
        <p className="text-sm">No poster templates found matching your criteria.</p>
      </div>
    )
  }

  const getStatusBadge = (status?: "Published" | "Draft" | "Archived") => {
    switch (status) {
      case "Draft":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-500 border border-amber-900/60">
            Draft
          </span>
        )
      case "Archived":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            Archived
          </span>
        )
      case "Published":
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">
            Published
          </span>
        )
    }
  }

  return (
    <div className="rounded-md border border-border/80 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
              <th className="py-3.5 px-4 font-medium">Template</th>
              <th className="py-3.5 px-4 font-medium">Category</th>
              <th className="py-3.5 px-4 font-medium">Available Sizes</th>
              <th className="py-3.5 px-4 font-medium">Starting Price</th>
              <th className="py-3.5 px-4 font-medium">Status</th>
              <th className="py-3.5 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paginatedTemplates.map((tpl) => {
              const displayPrice =
                tpl.price !== undefined
                  ? `$${tpl.price.toFixed(2)}`
                  : tpl.formattedStartingPrice || "$32.00"

              const sizesList =
                tpl.eligibleSizes && tpl.eligibleSizes.length > 0
                  ? tpl.eligibleSizes
                  : tpl.availableSizes?.map((s) => s.name) || ["A4", "A3", "12 × 18 in"]

              return (
                <tr
                  key={tpl.id}
                  onClick={() => onEditTemplate?.(tpl)}
                  className="hover:bg-secondary/40 cursor-pointer transition-colors group"
                >
                  {/* Template Image & Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative aspect-[3/4] w-10 sm:w-12 shrink-0 rounded-sm overflow-hidden bg-black/80 border border-border/70 group-hover:border-primary/50 transition-colors">
                        <Image
                          src={tpl.src}
                          alt={tpl.name}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {tpl.name}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {tpl.vehicle}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-secondary/80 border border-border/60 text-foreground">
                      {tpl.category}
                    </span>
                  </td>

                  {/* Available Sizes */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1 max-w-xs">
                      {sizesList.map((sz) => (
                        <span
                          key={sz}
                          className="rounded-sm bg-secondary/60 border border-border/50 px-1.5 py-0.5 text-[10px] text-muted-foreground whitespace-nowrap"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </td>


                  {/* Starting Price */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-foreground text-sm">
                    {displayPrice}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(tpl.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditTemplate?.(tpl)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-secondary/60 hover:bg-secondary hover:border-primary/40 text-foreground text-xs font-medium px-3 py-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Edit2 className="size-3 text-muted-foreground" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination: Showing 10 templates per page */}
      <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-card">
        <span>
          Showing {templates.length === 0 ? 0 : startIndex + 1} to {endIndex} of {templates.length} templates
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={validPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 rounded-md text-xs font-medium hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1 px-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum, idx) => (
              <React.Fragment key={pageNum}>
                {idx > 0 && <span className="text-muted-foreground/60 select-none">·</span>}
                <button
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium hover:text-foreground hover:bg-secondary/60 transition-colors cursor-pointer ${
                    validPage === pageNum
                      ? "font-semibold text-foreground underline underline-offset-4"
                      : "text-muted-foreground"
                  }`}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            disabled={validPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 rounded-md text-xs font-medium hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
