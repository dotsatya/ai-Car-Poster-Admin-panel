import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { DEMO_AI_JOBS, getDemoAiJobById } from "@/lib/demoAiGenerations"
import { AiJobDetailCard } from "@/components/ai-generations/ai-job-detail-card"

export async function generateStaticParams() {
  return DEMO_AI_JOBS.map((j) => ({
    id: j.cleanId,
  }))
}

export default async function AiJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = getDemoAiJobById(id)

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Job Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          We could not find an AI generation job matching ID &ldquo;{id}&rdquo;.
        </p>
        <Link
          href="/dashboard/ai-generations"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to AI generations</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6">
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <AiJobDetailCard job={job} />
      </React.Suspense>
    </div>
  )
}
