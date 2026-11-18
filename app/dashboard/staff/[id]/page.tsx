import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DEMO_STAFF, getDemoStaffById } from "@/lib/demoStaff"
import { StaffDetailCard } from "@/components/staff/staff-detail-card"

export async function generateStaticParams() {
  return DEMO_STAFF.map((member) => ({
    id: member.cleanId,
  }))
}

export default async function StaffMemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const staff = getDemoStaffById(id)

  if (!staff) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Staff Member Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          We could not find a team member matching &ldquo;{id}&rdquo;.
        </p>
        <Link
          href="/dashboard/staff"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Staff & Roles</span>
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
        <StaffDetailCard staff={staff} />
      </React.Suspense>
    </div>
  )
}
