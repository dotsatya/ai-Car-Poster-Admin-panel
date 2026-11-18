import * as React from "react"
import { notFound } from "next/navigation"
import { DEMO_CUSTOMERS, getDemoCustomerById } from "@/lib/demoCustomer"
import { CustomerDetailCard } from "@/components/customers/customer-detail-card"

export function generateStaticParams() {
  return DEMO_CUSTOMERS.map((cust) => ({
    id: cust.cleanId,
  }))
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = getDemoCustomerById(id) || getDemoCustomerById("1")

  if (!customer) {
    notFound()
  }

  return (
    <React.Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading customer details...</div>}>
      <CustomerDetailCard customer={customer} />
    </React.Suspense>
  )
}
