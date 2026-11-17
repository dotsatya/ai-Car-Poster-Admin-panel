import { TEMPLATE_PHOTOS } from "@/lib/templatePhotos"

export interface OrderItem {
  id: string
  name: string
  type: "Individual" | "Combined"
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

export interface DemoOrder {
  id: string
  cleanId: string
  customer: {
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
    status: "Paid" | "Pending" | "Refunded" | "Cancelled"
    stripeRef: string
    stripeUrl?: string
  }
  stage: "Printing" | "Painting" | "Packing" | "Shipped" | "Delivered" | "Received" | "None"
  items: OrderItem[]
  subtotal: string
  shippingFee: string
  total: string
  numericTotal: number
  date: string
  daysAgo: number
  statusHistory: StatusHistoryItem[]
  notes: string[]
}

// 6 Demo Orders leveraging real template poster photos from TEMPLATE_PHOTOS
export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: "#1042",
    cleanId: "1042",
    customer: {
      name: "Ayaan Khan",
      email: "a.khan@mail.com",
      phone: "+91 98xxx xxxxx",
    },
    shipping: {
      address: "12 Park Street, Kolkata",
      cityStateZip: "West Bengal 700016",
      country: "India",
    },
    payment: {
      status: "Paid",
      stripeRef: "pi_3Q...x9",
      stripeUrl: "https://stripe.com",
    },
    stage: "Printing",
    items: [
      {
        id: "art-1",
        name: "Retro Racer",
        type: "Individual",
        size: "18 x 24 in",
        qty: 1,
        unitPrice: "$32.00",
        lineTotal: "$32.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 1)?.src || "/template photo/1.webp",
      },
      {
        id: "art-2",
        name: "Neon Night",
        type: "Individual",
        size: "12 x 18 in",
        qty: 2,
        unitPrice: "$22.00",
        lineTotal: "$44.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 4)?.src || "/template photo/4.webp",
      },
      {
        id: "art-3",
        name: "Retro Racer + Neon Night",
        type: "Combined",
        size: "12 x 18 in",
        qty: 1,
        unitPrice: "$20.00",
        lineTotal: "$20.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 13)?.src || "/template photo/13.webp",
      },
    ],
    subtotal: "$96.00",
    shippingFee: "$0.00",
    total: "$96.00",
    numericTotal: 96.0,
    date: "17 Nov",
    daysAgo: 1,
    statusHistory: [
      { time: "17 Nov, 10:42", label: "Order received" },
      { time: "17 Nov, 11:05", label: "Preparing artwork" },
      { time: "17 Nov, 14:20", label: "Printing" },
    ],
    notes: [],
  },
  {
    id: "#1041",
    cleanId: "1041",
    customer: {
      name: "Subhajit Roy",
      email: "s.roy@mail.com",
      phone: "+91 91xxx xxxxx",
    },
    shipping: {
      address: "45 Salt Lake Sector V",
      cityStateZip: "Kolkata, WB 700091",
      country: "India",
    },
    payment: {
      status: "Paid",
      stripeRef: "pi_3Q...a2",
      stripeUrl: "https://stripe.com",
    },
    stage: "Shipped",
    items: [
      {
        id: "art-4",
        name: "Porsche 911 British Racing Green",
        type: "Individual",
        size: "12 x 18 in",
        qty: 1,
        unitPrice: "$29.00",
        lineTotal: "$29.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 2)?.src || "/template photo/2.webp",
      },
    ],
    subtotal: "$29.00",
    shippingFee: "$0.00",
    total: "$29.00",
    numericTotal: 29.0,
    date: "16 Nov",
    daysAgo: 2,
    statusHistory: [
      { time: "16 Nov, 09:14", label: "Order received" },
      { time: "16 Nov, 12:30", label: "Artwork approved" },
      { time: "16 Nov, 16:45", label: "Shipped via DHL Express" },
    ],
    notes: ["Dispatched with tracking AWB #DHL-882914"],
  },
  {
    id: "#1040",
    cleanId: "1040",
    customer: {
      name: "Jessica Lee",
      email: "j.lee@mail.com",
      phone: "+1 415-555-0192",
    },
    shipping: {
      address: "742 Evergreen Terrace",
      cityStateZip: "San Francisco, CA 94107",
      country: "United States",
    },
    payment: {
      status: "Pending",
      stripeRef: "pi_3Q...f7",
      stripeUrl: "https://stripe.com",
    },
    stage: "None",
    items: [
      {
        id: "art-5",
        name: "Aventador SVJ Crimson Storm",
        type: "Individual",
        size: "18 x 24 in",
        qty: 1,
        unitPrice: "$38.00",
        lineTotal: "$38.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 8)?.src || "/template photo/8.webp",
      },
      {
        id: "art-6",
        name: "Pagani Zonda Obsidian Noir",
        type: "Individual",
        size: "12 x 18 in",
        qty: 1,
        unitPrice: "$30.00",
        lineTotal: "$30.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 6)?.src || "/template photo/6.webp",
      },
    ],
    subtotal: "$68.00",
    shippingFee: "$0.00",
    total: "$68.00",
    numericTotal: 68.0,
    date: "16 Nov",
    daysAgo: 2,
    statusHistory: [
      { time: "16 Nov, 18:20", label: "Order initiated" },
      { time: "16 Nov, 18:22", label: "Awaiting bank authorization" },
    ],
    notes: [],
  },
  {
    id: "#1039",
    cleanId: "1039",
    customer: {
      name: "Manish Das",
      email: "m.das@mail.com",
      phone: "+91 97xxx xxxxx",
    },
    shipping: {
      address: "88 Gariahat Road",
      cityStateZip: "Kolkata, WB 700029",
      country: "India",
    },
    payment: {
      status: "Refunded",
      stripeRef: "pi_3Q...r4",
      stripeUrl: "https://stripe.com",
    },
    stage: "Received",
    items: [
      {
        id: "art-7",
        name: "Bugatti Chiron Super Sport 300+",
        type: "Individual",
        size: "12 x 18 in",
        qty: 1,
        unitPrice: "$35.00",
        lineTotal: "$35.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 10)?.src || "/template photo/10.webp",
      },
    ],
    subtotal: "$35.00",
    shippingFee: "$0.00",
    total: "$35.00",
    numericTotal: 35.0,
    date: "15 Nov",
    daysAgo: 3,
    statusHistory: [
      { time: "15 Nov, 11:10", label: "Order received" },
      { time: "15 Nov, 14:00", label: "Customer requested cancellation" },
      { time: "15 Nov, 14:30", label: "Refund issued via Stripe" },
    ],
    notes: ["Customer ordered incorrect size, requested refund to reorder."],
  },
  {
    id: "#1038",
    cleanId: "1038",
    customer: {
      name: "Liam Vance",
      email: "k.vance@mail.com",
      phone: "+44 20 7946 0912",
    },
    shipping: {
      address: "14 Baker Street, Marylebone",
      cityStateZip: "London NW1 6XE",
      country: "United Kingdom",
    },
    payment: {
      status: "Paid",
      stripeRef: "pi_3Q...m5",
      stripeUrl: "https://stripe.com",
    },
    stage: "Packing",
    items: [
      {
        id: "art-8",
        name: "Ferrari F40 Atrium Spec",
        type: "Individual",
        size: "18 x 24 in",
        qty: 1,
        unitPrice: "$44.00",
        lineTotal: "$44.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 11)?.src || "/template photo/11.webp",
      },
      {
        id: "art-9",
        name: "Porsche Carrera GT Spec Sheet",
        type: "Individual",
        size: "12 x 18 in",
        qty: 1,
        unitPrice: "$35.00",
        lineTotal: "$35.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 12)?.src || "/template photo/12.webp",
      },
    ],
    subtotal: "$79.00",
    shippingFee: "$0.00",
    total: "$79.00",
    numericTotal: 79.0,
    date: "14 Nov",
    daysAgo: 4,
    statusHistory: [
      { time: "14 Nov, 08:30", label: "Order received" },
      { time: "14 Nov, 11:15", label: "Printed on 300 GSM Cotton Rag" },
      { time: "14 Nov, 16:00", label: "Quality inspected & packing" },
    ],
    notes: ["Fragile archival packaging requested."],
  },
  {
    id: "#1037",
    cleanId: "1037",
    customer: {
      name: "Tara Ross",
      email: "t.ross@mail.com",
      phone: "+1 312-555-0143",
    },
    shipping: {
      address: "300 Michigan Ave",
      cityStateZip: "Chicago, IL 60601",
      country: "United States",
    },
    payment: {
      status: "Cancelled",
      stripeRef: "pi_3Q...k1",
      stripeUrl: "https://stripe.com",
    },
    stage: "None",
    items: [
      {
        id: "art-10",
        name: "Koenigsegg Jesko Absolut Red Studio",
        type: "Individual",
        size: "18 x 24 in",
        qty: 1,
        unitPrice: "$45.00",
        lineTotal: "$45.00",
        image: TEMPLATE_PHOTOS.find((t) => t.id === 18)?.src || "/template photo/18.webp",
      },
    ],
    subtotal: "$45.00",
    shippingFee: "$0.00",
    total: "$45.00",
    numericTotal: 45.0,
    date: "12 Nov",
    daysAgo: 6,
    statusHistory: [
      { time: "12 Nov, 15:20", label: "Order created" },
      { time: "12 Nov, 15:45", label: "Cancelled by buyer" },
    ],
    notes: [],
  },
]

export function getDemoOrderById(id: string): DemoOrder | undefined {
  const clean = id.replace("#", "").trim()
  return (
    DEMO_ORDERS.find((o) => o.cleanId === clean || o.id === id) ||
    DEMO_ORDERS[0]
  )
}
