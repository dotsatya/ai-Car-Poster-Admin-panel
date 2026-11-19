import {
  ORDERS,
  CUSTOMERS,
  DATA_AS_OF,
  DISPLAY_TIME_ZONE,
  formatDateTime,
  formatMoney,
  getOrderStage,
  getProductionByOrderId,
  getGenerationsByEmail,
  getOrdersByEmail,
  type JobType,
  type PaymentStatus,
  type ProductionStage,
} from "./DemoData"

// Adapter: same exports and shape as the old file, but all data comes from DemoData.ts.
// Do not add data here. Edit DemoData.ts instead.

export interface OrderItem {
  id: string
  name: string
  type: JobType
  size: string
  qty: number
  unitPrice: string
  lineTotal: string
  image: string
}

export interface StatusHistoryItem {
  time: string
  label: string
}

export interface CustomerRecentGeneration {
  id: string
  jobId: string
  date: string
  template: string
  type: JobType
  status: string
}

export interface CustomerRecentOrder {
  id: string
  cleanId: string
  itemsCount: number
  total: string
  payment: PaymentStatus
  stage: OrderStage
  date: string
}

export type OrderStage = ProductionStage

export interface DemoOrder {
  id: string
  cleanId: string
  customer: {
    id?: string
    cleanId?: string
    name: string
    email: string
    phone: string
  }
  shipping: {
    address: string
    cityStateZip: string
    country: string
  }
  payment: {
    status: PaymentStatus
    stripeRef: string
    stripeUrl?: string
  }
  stage: OrderStage
  items: OrderItem[]
  subtotal: string
  shippingFee: string
  total: string
  numericTotal: number
  date: string
  daysAgo: number
  statusHistory: StatusHistoryItem[]
  notes: string[]
  customerRecentGenerations: CustomerRecentGeneration[]
  customerRecentOrders: CustomerRecentOrder[]
}

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(new Date(iso))

const calcDaysAgo = (iso: string) => {
  const asOf = new Date(DATA_AS_OF).getTime()
  const created = new Date(iso).getTime()
  return Math.max(0, Math.floor((asOf - created) / (1000 * 60 * 60 * 24)))
}

export const DEMO_ORDERS: DemoOrder[] = [...ORDERS].reverse().map((o) => {
  const customer = CUSTOMERS.find(
    (c) => c.email.toLowerCase() === o.customerEmail.toLowerCase()
  )
  const prod = getProductionByOrderId(o.id)

  const items: OrderItem[] = o.items.map((it) => ({
    id: it.id,
    name: it.name,
    type: it.type,
    size: it.size,
    qty: it.qty,
    unitPrice: formatMoney(it.unitPrice),
    lineTotal: formatMoney(it.lineTotal),
    image: it.image,
  }))

  const statusHistory: StatusHistoryItem[] = prod
    ? prod.history.map((h) => ({
        time: formatDateTime(h.time),
        label: h.label,
      }))
    : [
        {
          time: formatDateTime(o.createdAt),
          label: "Order Received",
        },
      ]

  const line2Part = o.shipping.line2 ? `, ${o.shipping.line2}` : ""

  const customerRecentGenerations: CustomerRecentGeneration[] = [
    ...getGenerationsByEmail(o.customerEmail),
  ]
    .reverse()
    .slice(0, 5)
    .map((g) => ({
      id: g.cleanId,
      jobId: g.cleanId,
      date: shortDate(g.createdAt),
      template: g.template,
      type: g.type,
      status: g.state,
    }))

  const customerRecentOrders: CustomerRecentOrder[] = [
    ...getOrdersByEmail(o.customerEmail),
  ]
    .reverse()
    .slice(0, 5)
    .map((ord) => ({
      id: ord.id,
      cleanId: ord.cleanId,
      itemsCount: ord.items.reduce((n, i) => n + i.qty, 0),
      total: formatMoney(ord.total),
      payment: ord.payment.status,
      stage: (getOrderStage(ord.id) as OrderStage) || "Order Received",
      date: shortDate(ord.createdAt),
    }))

  return {
    id: o.id,
    cleanId: o.cleanId,
    customer: {
      id: customer?.id || "",
      cleanId: customer?.cleanId || "",
      name: customer?.name || o.shipping.name,
      email: o.customerEmail,
      phone: customer?.phone || "",
    },
    shipping: {
      address: `${o.shipping.line1}${line2Part}`,
      cityStateZip: `${o.shipping.city}, ${o.shipping.state} ${o.shipping.zip}`,
      country: o.shipping.country,
    },
    payment: {
      status: o.payment.status,
      stripeRef: o.payment.stripeRef,
      stripeUrl: o.payment.stripeUrl,
    },
    stage: (getOrderStage(o.id) as OrderStage) || "Order Received",
    items,
    subtotal: formatMoney(o.subtotal),
    shippingFee: formatMoney(o.shippingFee),
    total: formatMoney(o.total),
    numericTotal: o.total,
    date: shortDate(o.createdAt),
    daysAgo: calcDaysAgo(o.createdAt),
    statusHistory,
    notes: o.notes || [],
    customerRecentGenerations,
    customerRecentOrders,
  }
})

export function getDemoOrderById(id: string): DemoOrder | undefined {
  const clean = id.replace("#", "").trim().toLowerCase()
  return DEMO_ORDERS.find(
    (o) => o.cleanId.toLowerCase() === clean || o.id.toLowerCase() === `#${clean}`
  )
}
