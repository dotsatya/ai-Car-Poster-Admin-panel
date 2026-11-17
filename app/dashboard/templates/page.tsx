"use client"

import * as React from "react"
import { TEMPLATE_PHOTOS, TemplatePhoto } from "@/lib/templatePhotos"
import { TemplateHeader } from "@/components/templates/template-header"
import { TemplateFilters } from "@/components/templates/template-filters"
import { TemplateGrid } from "@/components/templates/template-grid"

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [search, setSearch] = React.useState("")

  // Extract unique categories dynamically from TEMPLATE_PHOTOS
  const categories = React.useMemo(() => {
    const set = new Set<string>()
    set.add("All")
    TEMPLATE_PHOTOS.forEach((t) => {
      if (t.category) set.add(t.category)
    })
    return Array.from(set)
  }, [])

  // Filter templates
  const filteredTemplates = React.useMemo(() => {
    return TEMPLATE_PHOTOS.filter((tpl) => {
      // 1. Category filter
      if (
        activeCategory !== "All" &&
        tpl.category.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false
      }

      // 2. Search filter
      const q = search.trim().toLowerCase()
      if (q) {
        const matchesName = tpl.name.toLowerCase().includes(q)
        const matchesVehicle = tpl.vehicle.toLowerCase().includes(q)
        const matchesCat = tpl.category.toLowerCase().includes(q)
        if (!matchesName && !matchesVehicle && !matchesCat) return false
      }

      return true
    })
  }, [activeCategory, search])

  return (
    <div className="flex flex-col gap-6">
      {/* Templates Header */}
      <TemplateHeader
        onNewTemplate={() => alert("Opening template creator studio...")}
      />

      {/* Templates Category and Search Filters */}
      <TemplateFilters
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Templates Responsive Grid */}
      <TemplateGrid
        templates={filteredTemplates}
        onSelectTemplate={(tpl) => console.log("Selected template:", tpl.name)}
      />
    </div>
  )
}
