import * as React from "react"
import { ProductionClientView } from "@/components/production/production-client-view"

export default function ProductionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <ProductionClientView />
    </React.Suspense>
  )
}
