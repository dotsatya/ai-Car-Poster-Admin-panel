"use client"

import * as React from "react"
import { DEMO_AI_JOBS, AI_STATS, AiGenerationJob } from "@/lib/demoAiGenerations"
import { AiHeader } from "@/components/ai-generations/ai-header"
import { AiKpiCards } from "@/components/ai-generations/ai-kpi-cards"
import { AiFilters } from "@/components/ai-generations/ai-filters"
import { AiJobsTable } from "@/components/ai-generations/ai-jobs-table"

export default function AiGenerationsPage() {
  const [search, setSearch] = React.useState("")
  const [stateFilter, setStateFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [timeFilter, setTimeFilter] = React.useState("today")

  // Filter jobs based on user criteria
  const filteredJobs = React.useMemo(() => {
    return DEMO_AI_JOBS.filter((job) => {
      // 1. Search filter: customer email or job ID
      const q = search.trim().toLowerCase()
      if (q) {
        const matchesId = job.id.toLowerCase().includes(q)
        const matchesCustomer = job.customer.toLowerCase().includes(q)
        const matchesTemplate = job.templates.toLowerCase().includes(q)
        if (!matchesId && !matchesCustomer && !matchesTemplate) return false
      }

      // 2. State filter: completed, processing, failed, queued
      if (stateFilter !== "all") {
        if (job.state.toLowerCase() !== stateFilter.toLowerCase()) {
          return false
        }
      }

      // 3. Type filter: individual, combined
      if (typeFilter !== "all") {
        if (job.type.toLowerCase() !== typeFilter.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [search, stateFilter, typeFilter])

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <AiHeader onRefresh={() => console.log("Refreshed AI generation jobs")} />

      {/* 4 Metric KPI Cards */}
      <AiKpiCards stats={AI_STATS} />

      {/* Filter Row */}
      <AiFilters
        search={search}
        onSearchChange={setSearch}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
      />

      {/* Jobs Table & Pagination */}
      <AiJobsTable jobs={filteredJobs} totalJobsCount={2796} />
    </div>
  )
}
