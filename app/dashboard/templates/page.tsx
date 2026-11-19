"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { TEMPLATE_PHOTOS, TemplatePhoto } from "@/lib/templatePhotos"
import { TemplateHeader } from "@/components/templates/template-header"
import { TemplateFilters } from "@/components/templates/template-filters"
import { TemplateTable } from "@/components/templates/template-table"
import { TemplateModal } from "@/components/templates/template-modal"

const STORAGE_KEY = "poster_gen_templates_v1"

export default function TemplatesPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [search, setSearch] = React.useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  // Load templates from localStorage or fallback to TEMPLATE_PHOTOS
  const [templates, setTemplates] = React.useState<TemplatePhoto[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch (err) {
        console.error("Failed to parse saved templates from localStorage:", err)
      }
    }
    return TEMPLATE_PHOTOS
  })

  // Synchronize changes to localStorage
  const saveTemplatesToStorage = React.useCallback((items: TemplatePhoto[]) => {
    setTemplates(items)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch (err) {
        console.error("Failed to save templates to localStorage:", err)
      }
    }
  }, [])

  // Re-sync with localStorage when window gains focus or mounts
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTemplates(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Extract unique categories dynamically
  const categories = React.useMemo(() => {
    const set = new Set<string>()
    set.add("All")
    templates.forEach((t) => {
      if (t.category) set.add(t.category)
    })
    return Array.from(set)
  }, [templates])

  // Filter templates based on category and search
  const filteredTemplates = React.useMemo(() => {
    return templates.filter((tpl) => {
      // 1. Category filter
      if (
        activeCategory !== "All" &&
        tpl.category?.toLowerCase() !== activeCategory.toLowerCase()
      ) {
        return false
      }

      // 2. Search filter
      const q = search.trim().toLowerCase()
      if (q) {
        const matchesName = tpl.name.toLowerCase().includes(q)
        const matchesVehicle = tpl.vehicle?.toLowerCase().includes(q)
        const matchesCat = tpl.category?.toLowerCase().includes(q)
        const matchesTag = tpl.tag?.toLowerCase().includes(q)
        if (!matchesName && !matchesVehicle && !matchesCat && !matchesTag) {
          return false
        }
      }

      return true
    })
  }, [templates, activeCategory, search])

  // Open modal in Create mode
  function handleOpenCreateModal() {
    setIsCreateModalOpen(true)
  }

  // Create brand new template
  function handleCreateTemplate(newTemplate: TemplatePhoto) {
    const nextList = [newTemplate, ...templates]
    saveTemplatesToStorage(nextList)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Templates Header */}
      <TemplateHeader onNewTemplate={handleOpenCreateModal} />

      {/* Templates Category and Search Filters */}
      <TemplateFilters
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        search={search}
        onSearchChange={setSearch}
      />

      {/* All Templates in Paginated Table View (10 per page) - clicking row navigates to dedicated template details page */}
      <TemplateTable
        templates={filteredTemplates}
        onEditTemplate={(tpl) => router.push(`/dashboard/templates/${tpl.id}`)}
      />

      {/* Create New Template Modal */}
      <TemplateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        template={null}
        onSave={() => {}}
        onCreate={handleCreateTemplate}
      />
    </div>
  )
}
