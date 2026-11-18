import * as React from "react"
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
  const order = getDemoOrderById(id) || getDemoOrderById("1042")!

  return (
    <React.Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading order details...</div>}>
      <OrderDetailCard order={order} />
    </React.Suspense>
  )
}
