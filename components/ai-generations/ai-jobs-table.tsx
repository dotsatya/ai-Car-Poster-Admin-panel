"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AiGenerationJob } from "@/lib/demoAiGenerations"

interface AiJobsTableProps {
  jobs: AiGenerationJob[]
  totalJobsCount?: number
}

const PAGE_SIZE = 10

export function AiJobsTable({ jobs, totalJobsCount = 2796 }: AiJobsTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = React.useState(1)

  // Reset page when jobs change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [jobs.length])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const validPage = Math.min(currentPage, totalPages)
  const startIndex = (validPage - 1) * PAGE_SIZE
  const endIndex = Math.min(startIndex + PAGE_SIZE, jobs.length)
  const paginatedJobs = jobs.slice(startIndex, endIndex)

  // State badge styling
  const getStateBadge = (state: AiGenerationJob["state"]) => {
    switch (state) {
      case "Completed":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40"
      case "Processing":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40"
      case "Failed":
        return "bg-rose-950/70 text-rose-400 border-rose-800/40"
      case "Queued":
        return "bg-zinc-800/70 text-zinc-300 border-zinc-700/40"
    }
  }

  return (
    <div className="rounded-md border border-border/80 bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs font-medium text-muted-foreground">
              <th className="py-3.5 px-4 font-medium">Job</th>
              <th className="py-3.5 px-4 font-medium">Customer</th>
              <th className="py-3.5 px-4 font-medium">Template(s)</th>
              <th className="py-3.5 px-4 font-medium">Type</th>
              <th className="py-3.5 px-4 font-medium">State</th>
              <th className="py-3.5 px-4 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paginatedJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 px-4 text-center text-xs text-muted-foreground">
                  No generation jobs match your current filters.
                </td>
              </tr>
            ) : (
              paginatedJobs.map((job) => (
                <tr
                  key={job.id}
                  onClick={() => router.push(`/dashboard/ai-generations/${job.cleanId}`)}
                  className="hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  {/* Job ID */}
                  <td className="py-3.5 px-4 font-semibold text-foreground text-sm">
                    {job.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4 font-normal text-muted-foreground text-sm">
                    {job.customer}
                  </td>

                  {/* Template(s) */}
                  <td className="py-3.5 px-4 font-medium text-foreground text-sm">
                    {job.templates}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    {job.type === "Combined" ? (
                      <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border bg-blue-950/80 text-blue-400 border-blue-800/40">
                        Combined
                      </span>
                    ) : (
                      <span className="text-sm font-normal text-foreground">
                        Individual
                      </span>
                    )}
                  </td>

                  {/* State */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getStateBadge(
                        job.state
                      )}`}
                    >
                      {job.state}
                    </span>
                  </td>

                  {/* Time */}
                  <td className="py-3.5 px-4 font-normal text-muted-foreground text-sm">
                    {job.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination matching mockup: Showing 1 to X of 2,796 • Previous · 1 · 2 · 3 · Next */}
      <div className="p-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground bg-card">
        <span>
          Showing {jobs.length === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
          {totalJobsCount.toLocaleString("en-US")}
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
