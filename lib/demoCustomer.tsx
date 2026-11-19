import {
  CUSTOMERS,
  DATA_AS_OF,
  DISPLAY_TIME_ZONE,
  formatDate,
  formatDateTime,
  formatMoney,
  getCustomerSummary,
  getGenerationsByEmail,
  getOrdersByEmail,
  getOrderStage,
  type Address,
  type JobState,
  type JobType,
  type PaymentStatus,
  type ProductionStage,
} from "./DemoData"

// Adapter: same exports and shape as the old file, but all data comes from DemoData.ts.
// Do not add data here. Edit DemoData.ts instead.

export interface GenerationHistoryItem {
  id: string
  jobId?: string
  date: string
  template: string
  type: JobType
  status: JobState // now also "Processing" and "Queued"
}

export type CustomerOrderStage = ProductionStage

export interface CustomerOrderHistoryItem {
  id: string
  cleanId: string
  itemsCount: number
  total: string
  payment: PaymentStatus
  stage: CustomerOrderStage
  date: string
}

export interface ActionHistoryItem {
  id: string
  date: string
  actor: string
  action: "Enabled" | "Disabled"
  reason: string
}

export interface DemoCustomer {
  id: string
  cleanId: string
  name: string
  email: string
  phone?: string
  address?: Address
  formattedAddress?: string
  account: "Active" | "Disabled"
  verified: boolean
  posters: number
  orders?: number
  combinedUsed: number
  failedJobs: number
  totalSpent: string
  joined: string
  joinedFull: string
  joinedAt: string
  daysAgo: number
  lastSignIn: string
  generationAllowance: { used: number; total: number }
  generations: GenerationHistoryItem[]
  ordersList: CustomerOrderHistoryItem[]
  actions: ActionHistoryItem[]
}

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: DISPLAY_TIME_ZONE }).format(new Date(iso))

const calcDaysAgo = (iso: string) => {
  const asOf = new Date(DATA_AS_OF).getTime()
  const created = new Date(iso).getTime()
  return Math.max(0, Math.floor((asOf - created) / (1000 * 60 * 60 * 24)))
}

export const DEMO_CUSTOMERS: DemoCustomer[] = CUSTOMERS.map((c) => {
  const s = getCustomerSummary(c.email)
  return {
    id: c.id,
    cleanId: c.cleanId,
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    formattedAddress: [
      c.address?.line1,
      c.address?.line2,
      c.address ? `${c.address.city}, ${c.address.state} ${c.address.zip}` : null,
      c.address?.country,
    ]
      .filter(Boolean)
      .join(", "),
    account: c.account,
    verified: c.verified,
    posters: s.posters,
    orders: s.orders,
    combinedUsed: s.combinedUsed,
    failedJobs: s.failedJobs,
    totalSpent: `$${Math.round(s.totalSpent).toLocaleString("en-US")}`,
    joined: shortDate(c.joinedAt),
    joinedFull: formatDate(c.joinedAt),
    joinedAt: c.joinedAt,
    daysAgo: calcDaysAgo(c.joinedAt),
    lastSignIn: formatDateTime(c.lastSignInAt),
    generationAllowance: { used: s.individualUsed, total: c.generationAllowance.individualTotal },
    generations: [...getGenerationsByEmail(c.email)].reverse().map((g) => ({
      id: g.cleanId,
      jobId: g.cleanId,
      date: shortDate(g.createdAt),
      template: g.template,
      type: g.type,
      status: g.state,
    })),
    ordersList: [...getOrdersByEmail(c.email)].reverse().map((o) => ({
      id: o.id,
      cleanId: o.cleanId,
      itemsCount: o.items.reduce((n, i) => n + i.qty, 0),
      total: formatMoney(o.total),
      payment: o.payment.status,
      stage: getOrderStage(o.id)!,
      date: shortDate(o.createdAt),
    })),
    actions: c.actions.map((a) => ({
      id: a.id,
      date: shortDate(a.date),
      actor: a.actor,
      action: a.action,
      reason: a.reason,
    })),
  }
})

export function getDemoCustomerById(idOrCleanIdOrEmail: string): DemoCustomer | undefined {
  const q = idOrCleanIdOrEmail.toLowerCase().trim()
  return DEMO_CUSTOMERS.find(
    (c) => c.id.toLowerCase() === q || c.cleanId.toLowerCase() === q || c.email.toLowerCase() === q
  )
}
