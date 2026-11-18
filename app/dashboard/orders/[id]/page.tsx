import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DEMO_ORDERS, getDemoOrderById } from "@/lib/demoOrder"
import { OrderDetailCard } from "@/components/orders/order-detail-card"

export function generateStaticParams() {
  return DEMO_ORDERS.map((order) => ({
    id: order.cleanId,
  }))
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = getDemoOrderById(id)

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          We could not find an order matching ID &ldquo;{id}&rdquo;.
        </p>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to orders</span>
        </Link>
      </div>
    )
  }

  return (
    <React.Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading order details...</div>}>
      <OrderDetailCard order={order} />
    </React.Suspense>
  )
}
