import {
  GENERATIONS,
  DISPLAY_TIME_ZONE,
  formatDateTime,
  getAiStats,
  getCustomerByEmail,
  getCustomerSummary,
} from "./DemoData"

// Adapter: same exports and shape as the old file, but all data comes from DemoData.ts.
// Do not add data here. Edit DemoData.ts instead.

export interface TimelineItem {
  time: string
  label: string
}

export interface AiGenerationJob {
  id: string
  cleanId: string
  customer: string // customer email
  customerId?: string
  template: string
  templates: string
  type: "Individual" | "Combined"
  state: "Completed" | "Processing" | "Failed" | "Queued"
  time: string
  customText?: string
  attempt: string
  carPhotoInfo: {
    fileName: string
    dimensions: string
    image?: string
  }
  outputInfo?: {
    image?: string
    dimensions?: string
  } | null
  error?: string | null
  timeline: TimelineItem[]
  customerUsage: {
    individualUsed: number
    individualTotal: number
    combinedUsed: number
    combinedTotal: number
  }
}

export interface AiGenerationStats {
  totalGenerations: number
  queued?: number
  processing: number
  completedToday: number
  failedToday: number
}

const formatClock = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(new Date(iso))

export const AI_STATS: AiGenerationStats = getAiStats()

export const DEMO_AI_JOBS: AiGenerationJob[] = [...GENERATIONS]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) // newest first
  .map((g) => {
    const customer = getCustomerByEmail(g.customerEmail)
    const usage = getCustomerSummary(g.customerEmail)
    return {
      id: g.id,
      cleanId: g.cleanId,
      customer: g.customerEmail,
      customerId: customer?.cleanId,
      template: g.template,
      templates: g.template,
      type: g.type,
      state: g.state,
      time: formatDateTime(g.createdAt), // e.g. "Nov 17, 5:12 AM"
      customText: g.customText ?? "Not used",
      attempt: `${g.attempt.used} of ${g.attempt.allowed} allowed`,
      carPhotoInfo: {
        fileName: g.carPhoto.fileName,
        dimensions: g.carPhoto.dimensions,
        image: g.carPhoto.image ?? undefined,
      },
      outputInfo: g.output
        ? { image: g.output.image, dimensions: g.output.dimensions }
        : null,
      error: g.error,
      timeline: g.timeline.map((t) => ({ time: formatClock(t.time), label: t.label })),
      customerUsage: {
        individualUsed: usage.individualUsed,
        individualTotal: customer?.generationAllowance.individualTotal ?? 20,
        combinedUsed: usage.combinedUsed,
        combinedTotal: customer?.generationAllowance.combinedTotal ?? 5,
      },
    }
  })

export function getDemoAiJobById(idOrCleanId: string): AiGenerationJob | undefined {
  const q = idOrCleanId.toLowerCase().replace(/^#/, "").trim()
  return DEMO_AI_JOBS.find((j) => j.cleanId.toLowerCase() === q)
}