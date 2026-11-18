import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  INITIAL_PRODUCTION_ORDERS,
  getDemoProductionOrderById,
} from "@/lib/demoProduction"
import { ProductionOrderDetail } from "@/components/production/production-order-detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return INITIAL_PRODUCTION_ORDERS.map((order) => ({
    id: order.cleanId,
  }))
}

export default async function ProductionDetailPage({ params }: PageProps) {
  const { id } = await params
  const order = getDemoProductionOrderById(id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Production Order Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          We could not find a production order matching ID &ldquo;{id}&rdquo;.
        </p>
        <Link
          href="/dashboard/production"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Production</span>
        </Link>
      </div>
    )
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ProductionOrderDetail initialOrder={order} />
    </React.Suspense>
  )
}
