"use client"

import * as React from "react"
import { TemplatePhoto } from "@/lib/templatePhotos"
import { TemplateCard } from "./template-card"

interface TemplateGridProps {
  templates: TemplatePhoto[]
  onSelectTemplate?: (template: TemplatePhoto) => void
  onEditTemplate?: (template: TemplatePhoto) => void
}

export function TemplateGrid({
  templates,
  onSelectTemplate,
  onEditTemplate,
}: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="rounded-md border border-border/80 bg-card p-12 text-center text-muted-foreground">
        <p className="text-sm">No poster templates found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {templates.map((tpl) => (
        <TemplateCard
          key={tpl.id}
          template={tpl}
          onSelect={onSelectTemplate}
          onEdit={onEditTemplate}
        />
      ))}
    </div>
  )
}
