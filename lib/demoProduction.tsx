import {
  ORDERS,
  PRODUCTION_ORDERS,
  PRODUCTION_STAGES as DATA_STAGES,
  DISPLAY_TIME_ZONE,
  formatAddress,
  formatDateTime,
  getProductionKpis,
  type ProductionStage,
} from "./DemoData"

export type { ProductionStage }

export interface ProductionFile {
  id: string
  title: string
  isCombined?: boolean
  size: string
  qty: number
  fileStatus: string
  dimensions: string
  replacedBy?: string
  image?: string
  colorFallback: string
}

export interface ProductionAuditEntry {
  id: string
  time: string
  label: string
  author: string
  emailSent: boolean
  note?: string
}

export interface ProductionOrder {
  id: string
  cleanId: string
  customer: { name: string; email: string; phone?: string }
  itemsCount: number
  paidOn: string
  stage: ProductionStage
  flag: "File replaced" | null
  items: ProductionFile[]
  shipping: { name: string; address: string }
  carrier: string
  trackingNumber: string
  history: ProductionAuditEntry[]
}

const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: DISPLAY_TIME_ZONE }).format(new Date(iso))

export const PRODUCTION_STAGES = DATA_STAGES
export const PRODUCTION_KPIS = getProductionKpis()

export const INITIAL_PRODUCTION_ORDERS: ProductionOrder[] = [...PRODUCTION_ORDERS].reverse().map((p) => {
  const order = ORDERS.find((o) => o.id === p.orderId)!
  return {
    id: order.id,
    cleanId: order.cleanId,
    customer: { name: order.shipping.name, email: order.customerEmail },
    itemsCount: order.items.reduce((n, i) => n + i.qty, 0),
    paidOn: shortDate(order.createdAt),
    stage: p.stage,
    flag: p.flag,
    items: p.files.map((f) => ({
      id: f.id,
      title: f.title,
      isCombined: f.isCombined,
      size: f.size,
      qty: f.qty,
      fileStatus: f.fileStatus,
      dimensions: f.dimensions,
      replacedBy: f.replacedBy ?? undefined,
      image: f.image,
      colorFallback: f.colorFallback,
    })),
    shipping: { name: order.shipping.name, address: formatAddress(order.shipping) },
    carrier: p.carrier ?? "",
    trackingNumber: p.trackingNumber ?? "",
    history: p.history.map((h) => ({ ...h, time: formatDateTime(h.time) })),
  }
})

export function getDemoProductionOrderById(idOrClean: string): ProductionOrder | undefined {
  const clean = idOrClean.replace("#", "").trim().toLowerCase()
  return INITIAL_PRODUCTION_ORDERS.find(
    (o) => o.cleanId.toLowerCase() === clean || o.id.toLowerCase() === `#${clean}`
  )
}

/**
 * Cleanly merges stored updates from localStorage into the base production orders.
 * Guarantees that:
 * 1. All 22 orders from DemoData.ts are always present in the queue.
 * 2. Any stage, carrier, tracking, flag, file replacements, or audit history are safely preserved.
 * 3. Stale or invalid order IDs from legacy mocks are ignored and cannot wipe out the queue.
 */
export function mergeProductionOrders(
  baseOrders: ProductionOrder[],
  storedRaw: string | null
): ProductionOrder[] {
  if (!storedRaw) return baseOrders

  try {
    const parsed: Partial<ProductionOrder>[] = JSON.parse(storedRaw)
    if (!Array.isArray(parsed) || parsed.length === 0) return baseOrders

    const updateMap = new Map<string, Partial<ProductionOrder>>()
    for (const item of parsed) {
      if (!item) continue
      const clean = (item.cleanId || item.id || "").toString().replace("#", "").trim().toLowerCase()
      if (clean) {
        updateMap.set(clean, item)
      }
    }

    return baseOrders.map((base) => {
      const update = updateMap.get(base.cleanId.toLowerCase())
      if (!update) return base

      let s: string = (update.stage as string) || base.stage
      if (s === "Received") s = "Order Received"
      else if (s === "Preparing artwork") s = "Preparing Artwork"
      else if (s === "Sent to printer" || s === "Order confirmed and logged") s = "Order Confirmed"
      else if (s === "Ready for shipment") s = "Quality Check & Packing"
      else if (s === "Completed") s = "Delivered"

      return {
        ...base,
        stage: s as ProductionStage,
        carrier: update.carrier !== undefined ? update.carrier : base.carrier,
        trackingNumber: update.trackingNumber !== undefined ? update.trackingNumber : base.trackingNumber,
        flag: update.flag !== undefined ? update.flag : base.flag,
        items: Array.isArray(update.items) && update.items.length > 0 ? update.items : base.items,
        history: Array.isArray(update.history) && update.history.length > 0 ? update.history : base.history,
      }
    })
  } catch {
    return baseOrders
  }
}

