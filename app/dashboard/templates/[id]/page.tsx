import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  TEMPLATE_PHOTOS,
  getTemplatePhotoById,
  getTemplatePhotoBySlug,
} from "@/lib/templatePhotos"
import { TemplateDetailCard } from "@/components/templates/template-detail-card"

export async function generateStaticParams() {
  return TEMPLATE_PHOTOS.map((tpl) => ({
    id: tpl.id.toString(),
  }))
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numId = parseInt(id, 10)
  const template = !isNaN(numId)
    ? getTemplatePhotoById(numId)
    : getTemplatePhotoBySlug(id)

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Template Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          We could not find a poster template matching &ldquo;{id}&rdquo;.
        </p>
        <Link
          href="/dashboard/templates"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Poster Templates</span>
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
        <TemplateDetailCard template={template} />
      </React.Suspense>
    </div>
  )
}
