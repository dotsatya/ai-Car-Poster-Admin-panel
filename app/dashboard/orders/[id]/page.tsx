"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { getDemoOrderById } from "@/lib/demoOrder"
import { OrderDetailCard } from "@/components/orders/order-detail-card"

export default function OrderDetailPage() {
  const params = useParams()
  const rawId = (params?.id as string) || "1042"
  const order = getDemoOrderById(rawId) || getDemoOrderById("1042")!

  return <OrderDetailCard order={order} />
}
