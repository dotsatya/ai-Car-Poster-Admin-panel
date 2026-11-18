/**
 * unifiedDemoData.ts
 * One data source for the whole admin prototype (US client, all prices in USD).
 *
 * HOW THE DATA IS CONNECTED (works like database tables):
 *   CUSTOMERS          key: email
 *   GENERATIONS        customerEmail -> CUSTOMERS.email
 *   ORDERS             customerEmail -> CUSTOMERS.email
 *                      items[].generationId -> GENERATIONS.cleanId (always a completed job by the SAME customer)
 *   PRODUCTION_ORDERS  orderId -> ORDERS.id, customerEmail -> CUSTOMERS.email
 *
 * RULES THAT KEEP IT CONSISTENT:
 *   - Nothing is stored twice. Counts like "posters", "totalSpent", "combinedUsed", KPI counts
 *     are calculated by the helper functions at the bottom, so they can never drift.
 *   - Order stage lives only in PRODUCTION_ORDERS (single source of truth).
 *   - Dates are ISO strings in UTC. Use formatDate() / formatDateTime() to show them in US format.
 *   - Money is a number in dollars. Use formatMoney() to show it.
 *   - DATA_AS_OF is the fixed "now" of this demo. "Today" stats use it, not the real clock.
 *   - Failed jobs do not use up a customer's allowance.
 */

export type AccountStatus = "Active" | "Disabled"
export type JobType = "Individual" | "Combined"
export type JobState = "Completed" | "Processing" | "Failed" | "Queued"
export type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Cancelled"
export type ProductionStage =
  | "Order Received"
  | "Order Confirmed"
  | "Preparing Artwork"
  | "Printing"
  | "Quality Check & Packing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"

export interface Address {
  line1: string
  line2: string | null
  city: string
  state: string // 2-letter US state code
  zip: string
  country: string
}

export interface CustomerAction {
  id: string
  date: string
  actor: string
  action: "Enabled" | "Disabled"
  reason: string
}

export interface Customer {
  id: string
  cleanId: string
  name: string
  email: string
  phone: string
  account: AccountStatus
  verified: boolean
  joinedAt: string
  lastSignInAt: string
  address: Address
  generationAllowance: { individualTotal: number; combinedTotal: number }
  actions: CustomerAction[]
}

export interface TimelineItem {
  time: string
  label: string
}

export interface GenerationJob {
  id: string
  cleanId: string
  customerEmail: string
  template: string
  type: JobType
  state: JobState
  createdAt: string
  customText: string | null
  attempt: { used: number; allowed: number }
  carPhoto: { fileName: string; dimensions: string; image: string | null }
  output: { image: string; dimensions: string } | null
  error: string | null
  timeline: TimelineItem[]
}

export interface OrderItem {
  id: string
  generationId: string
  name: string
  type: JobType
  size: string
  qty: number
  unitPrice: number
  lineTotal: number
  image: string
}

export interface Order {
  id: string
  cleanId: string
  customerEmail: string
  createdAt: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  payment: { status: PaymentStatus; stripeRef: string; stripeUrl: string }
  shipping: { name: string } & Address
  notes: string[]
}

export interface ProductionFile {
  id: string // same id as the matching OrderItem
  title: string
  isCombined: boolean
  size: string
  qty: number
  fileStatus: string
  dimensions: string
  replacedBy: string | null
  image: string
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
  orderId: string
  cleanId: string
  customerEmail: string
  stage: ProductionStage
  flag: "File replaced" | null
  files: ProductionFile[]
  carrier: string | null
  trackingNumber: string | null
  history: ProductionAuditEntry[]
}

export const DATA_AS_OF = "2026-11-18T18:00:00Z"
export const DISPLAY_TIME_ZONE = "America/New_York"
export const SHIPPING_RULE = { freeOver: 50, flatFee: 7.95 }

export const PRODUCTION_STAGES: {
  key: ProductionStage
  shortLabel: string
  nextLabel: string
  emailNotice: boolean
}[] = [
  { key: "Order Received", shortLabel: "Received", nextLabel: "Confirm & log order →", emailNotice: false },
  { key: "Order Confirmed", shortLabel: "Confirmed", nextLabel: "Start preparing artwork →", emailNotice: false },
  { key: "Preparing Artwork", shortLabel: "Preparing", nextLabel: "Send to printing →", emailNotice: false },
  { key: "Printing", shortLabel: "Printing", nextLabel: "Quality check & packing →", emailNotice: true },
  { key: "Quality Check & Packing", shortLabel: "QC & Packing", nextLabel: "Mark as shipped →", emailNotice: true },
  { key: "Shipped", shortLabel: "Shipped", nextLabel: "Out for delivery →", emailNotice: true },
  { key: "Out for Delivery", shortLabel: "Out for delivery", nextLabel: "Mark as delivered →", emailNotice: true },
  { key: "Delivered", shortLabel: "Delivered", nextLabel: "Order Completed", emailNotice: true },
]

// ============================== DATA ==============================

// CUSTOMERS: who the person is. Nothing about posters, orders or shipping progress lives here.
export const CUSTOMERS: Customer[] = [
  {
    "id": "cust-1",
    "cleanId": "1",
    "name": "Ayaan Khan",
    "email": "a.khan@mail.com",
    "phone": "+1 (201) 555-0138",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-10-02T13:10:00Z",
    "lastSignInAt": "2026-11-18T17:50:00Z",
    "address": {
      "line1": "88 Newark Avenue",
      "line2": "Apt 5C",
      "city": "Jersey City",
      "state": "NJ",
      "zip": "07302",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": [
      {
        "id": "act-1-1",
        "date": "2026-11-05T14:10:00Z",
        "actor": "Riya (admin)",
        "action": "Enabled",
        "reason": "Appeal approved"
      },
      {
        "id": "act-1-2",
        "date": "2026-10-28T15:30:00Z",
        "actor": "Riya (admin)",
        "action": "Disabled",
        "reason": "Abuse reports"
      }
    ]
  },
  {
    "id": "cust-2",
    "cleanId": "2",
    "name": "Sarah Roy",
    "email": "s.roy@mail.com",
    "phone": "+1 (310) 555-0144",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-10-09T15:20:00Z",
    "lastSignInAt": "2026-11-14T15:09:32Z",
    "address": {
      "line1": "1045 Ocean Avenue",
      "line2": "Suite 300",
      "city": "Santa Monica",
      "state": "CA",
      "zip": "90401",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-3",
    "cleanId": "3",
    "name": "Jessica Lee",
    "email": "j.lee@mail.com",
    "phone": "+1 (415) 555-0192",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-11-14T17:05:00Z",
    "lastSignInAt": "2026-11-16T15:20:00Z",
    "address": {
      "line1": "742 Evergreen Terrace",
      "line2": null,
      "city": "San Francisco",
      "state": "CA",
      "zip": "94107",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-4",
    "cleanId": "4",
    "name": "Marcus Das",
    "email": "m.das@mail.com",
    "phone": "+1 (312) 555-0167",
    "account": "Disabled",
    "verified": true,
    "joinedAt": "2026-09-21T16:40:00Z",
    "lastSignInAt": "2026-11-15T15:17:00Z",
    "address": {
      "line1": "880 North Michigan Avenue",
      "line2": "Unit 19B",
      "city": "Chicago",
      "state": "IL",
      "zip": "60611",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": [
      {
        "id": "act-4-1",
        "date": "2026-11-15T16:05:00Z",
        "actor": "Riya (admin)",
        "action": "Disabled",
        "reason": "Excessive generation abuse"
      }
    ]
  },
  {
    "id": "cust-5",
    "cleanId": "5",
    "name": "Liam Vance",
    "email": "l.vance@mail.com",
    "phone": "+1 (512) 555-0188",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-09-28T14:30:00Z",
    "lastSignInAt": "2026-11-18T17:56:00Z",
    "address": {
      "line1": "1100 Congress Avenue",
      "line2": "Suite 400",
      "city": "Austin",
      "state": "TX",
      "zip": "78701",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-6",
    "cleanId": "6",
    "name": "Tara Ross",
    "email": "t.ross@mail.com",
    "phone": "+1 (305) 555-0133",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-08-15T18:00:00Z",
    "lastSignInAt": "2026-11-18T16:01:22Z",
    "address": {
      "line1": "350 South Miami Avenue",
      "line2": "Tower 2",
      "city": "Miami",
      "state": "FL",
      "zip": "33130",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-7",
    "cleanId": "7",
    "name": "Christian Martin",
    "email": "c.martin@mail.com",
    "phone": "+1 (206) 555-0176",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-11-04T19:15:00Z",
    "lastSignInAt": "2026-11-18T17:11:26Z",
    "address": {
      "line1": "1600 Pike Place",
      "line2": "Suite 800",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-8",
    "cleanId": "8",
    "name": "Ethan Drake",
    "email": "e.drake@mail.com",
    "phone": "+1 (617) 555-0155",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-07-12T13:45:00Z",
    "lastSignInAt": "2026-11-18T17:50:00Z",
    "address": {
      "line1": "210 Newbury Street",
      "line2": "3rd Floor",
      "city": "Boston",
      "state": "MA",
      "zip": "02116",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-9",
    "cleanId": "9",
    "name": "Olivia Brooks",
    "email": "o.brooks@mail.com",
    "phone": "+1 (303) 555-0182",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-11-10T16:10:00Z",
    "lastSignInAt": "2026-11-18T17:47:00Z",
    "address": {
      "line1": "1420 17th Street",
      "line2": "Suite 500",
      "city": "Denver",
      "state": "CO",
      "zip": "80202",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-10",
    "cleanId": "10",
    "name": "Marcus Sterling",
    "email": "m.sterling@mail.com",
    "phone": "+1 (214) 555-0129",
    "account": "Disabled",
    "verified": false,
    "joinedAt": "2026-10-18T14:00:00Z",
    "lastSignInAt": "2026-11-11T07:55:00Z",
    "address": {
      "line1": "2100 Ross Avenue",
      "line2": "Suite 1600",
      "city": "Dallas",
      "state": "TX",
      "zip": "75201",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": [
      {
        "id": "act-10-1",
        "date": "2026-11-11T08:00:00Z",
        "actor": "Automated System",
        "action": "Disabled",
        "reason": "Failed identity verification"
      }
    ]
  },
  {
    "id": "cust-11",
    "cleanId": "11",
    "name": "Ava Morales",
    "email": "a.morales@mail.com",
    "phone": "+1 (404) 555-0163",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-09-01T15:30:00Z",
    "lastSignInAt": "2026-11-06T01:42:16Z",
    "address": {
      "line1": "3344 Peachtree Road NE",
      "line2": "Suite 800",
      "city": "Atlanta",
      "state": "GA",
      "zip": "30326",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-12",
    "cleanId": "12",
    "name": "Jordan Hayes",
    "email": "j.hayes@mail.com",
    "phone": "+1 (503) 555-0147",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-06-25T14:20:00Z",
    "lastSignInAt": "2026-11-18T00:16:00Z",
    "address": {
      "line1": "1120 NW Couch Street",
      "line2": "Suite 600",
      "city": "Portland",
      "state": "OR",
      "zip": "97209",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-13",
    "cleanId": "13",
    "name": "Chloe Bennett",
    "email": "c.bennett@mail.com",
    "phone": "+1 (619) 555-0172",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-10-19T17:10:00Z",
    "lastSignInAt": "2026-11-10T01:31:41Z",
    "address": {
      "line1": "600 West Broadway",
      "line2": "Suite 1400",
      "city": "San Diego",
      "state": "CA",
      "zip": "92101",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-14",
    "cleanId": "14",
    "name": "Lucas Miller",
    "email": "l.miller@mail.com",
    "phone": "+1 (615) 555-0118",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-08-30T15:00:00Z",
    "lastSignInAt": "2026-11-04T19:16:46Z",
    "address": {
      "line1": "150 4th Avenue North",
      "line2": "Suite 200",
      "city": "Nashville",
      "state": "TN",
      "zip": "37219",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-15",
    "cleanId": "15",
    "name": "Natalie Coleman",
    "email": "n.coleman@mail.com",
    "phone": "+1 (212) 555-0177",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-09-14T16:25:00Z",
    "lastSignInAt": "2026-11-18T17:50:00Z",
    "address": {
      "line1": "450 Lexington Avenue",
      "line2": "14th Floor",
      "city": "New York",
      "state": "NY",
      "zip": "10017",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-16",
    "cleanId": "16",
    "name": "Dylan Ward",
    "email": "d.ward@mail.com",
    "phone": "+1 (702) 555-0158",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-07-08T14:50:00Z",
    "lastSignInAt": "2026-11-18T06:43:56Z",
    "address": {
      "line1": "3799 Las Vegas Boulevard South",
      "line2": null,
      "city": "Las Vegas",
      "state": "NV",
      "zip": "89109",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-17",
    "cleanId": "17",
    "name": "Harper Davis",
    "email": "h.davis@mail.com",
    "phone": "+1 (415) 555-0131",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-10-22T18:05:00Z",
    "lastSignInAt": "2026-11-18T16:04:16Z",
    "address": {
      "line1": "1700 California Street",
      "line2": "Suite 450",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94109",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  },
  {
    "id": "cust-18",
    "cleanId": "18",
    "name": "Isabella Rossi",
    "email": "i.rossi@mail.com",
    "phone": "+1 (312) 555-0189",
    "account": "Active",
    "verified": true,
    "joinedAt": "2026-08-17T15:40:00Z",
    "lastSignInAt": "2026-11-08T18:11:31Z",
    "address": {
      "line1": "111 South Wacker Drive",
      "line2": "28th Floor",
      "city": "Chicago",
      "state": "IL",
      "zip": "60606",
      "country": "United States"
    },
    "generationAllowance": {
      "individualTotal": 20,
      "combinedTotal": 5
    },
    "actions": []
  }
]

// GENERATIONS: AI poster jobs. Linked to a customer by customerEmail.
export const GENERATIONS: GenerationJob[] = [
  {
    "id": "#G-8801",
    "cleanId": "G-8801",
    "customerEmail": "j.hayes@mail.com",
    "template": "Porsche 992 GT3 RS Modern Minimalist",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-07-02T22:56:58Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "f150-raptor.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/7.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-07-02T22:56:58Z",
        "label": "Queued"
      },
      {
        "time": "2026-07-02T22:57:01Z",
        "label": "Processing"
      },
      {
        "time": "2026-07-02T22:57:28Z",
        "label": "Completed"
      },
      {
        "time": "2026-07-02T22:57:31Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8802",
    "cleanId": "G-8802",
    "customerEmail": "j.hayes@mail.com",
    "template": "McLaren 720S Speed Graphic",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-08-06T19:01:22Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/28.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-08-06T19:01:22Z",
        "label": "Queued"
      },
      {
        "time": "2026-08-06T19:01:30Z",
        "label": "Processing"
      },
      {
        "time": "2026-08-06T19:02:04Z",
        "label": "Completed"
      },
      {
        "time": "2026-08-06T19:02:07Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8803",
    "cleanId": "G-8803",
    "customerEmail": "j.hayes@mail.com",
    "template": "Ferrari F40 Atrium Spec + Mercedes-AMG CLE 53 Triple Panel",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-08-13T00:00:52Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "gt-r-r35.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/11.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-08-13T00:00:52Z",
        "label": "Queued"
      },
      {
        "time": "2026-08-13T00:01:00Z",
        "label": "Processing"
      },
      {
        "time": "2026-08-13T00:01:22Z",
        "label": "Completed"
      },
      {
        "time": "2026-08-13T00:01:25Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8804",
    "cleanId": "G-8804",
    "customerEmail": "e.drake@mail.com",
    "template": "BMW M4 G82 Apex Edition",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-08-26T14:14:35Z",
    "customText": null,
    "attempt": {
      "used": 3,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "porsche-gt3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": null,
    "error": "Vehicle detection model could not identify chassis orientation with confidence above 85%.",
    "timeline": [
      {
        "time": "2026-08-26T14:14:35Z",
        "label": "Queued"
      },
      {
        "time": "2026-08-26T14:14:43Z",
        "label": "Processing"
      },
      {
        "time": "2026-08-26T14:14:57Z",
        "label": "Failed"
      },
      {
        "time": "2026-08-26T14:14:58Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8805",
    "cleanId": "G-8805",
    "customerEmail": "d.ward@mail.com",
    "template": "Porsche 911 Turbo S Risograph",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-08-29T19:59:55Z",
    "customText": "Track Day",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "gt-r-r35.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/25.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-08-29T19:59:55Z",
        "label": "Queued"
      },
      {
        "time": "2026-08-29T20:00:03Z",
        "label": "Processing"
      },
      {
        "time": "2026-08-29T20:00:42Z",
        "label": "Completed"
      },
      {
        "time": "2026-08-29T20:00:45Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8806",
    "cleanId": "G-8806",
    "customerEmail": "e.drake@mail.com",
    "template": "Nissan Skyline GTR R33 1000HP",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-09-03T01:06:48Z",
    "customText": "Route 66",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "charger-srt.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/21.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-03T01:06:48Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-03T01:06:51Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-03T01:07:30Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-03T01:07:33Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8807",
    "cleanId": "G-8807",
    "customerEmail": "i.rossi@mail.com",
    "template": "Koenigsegg Agera RS Thunderstorm",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-09-08T16:13:49Z",
    "customText": "Route 66",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/29.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-08T16:13:49Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-08T16:13:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-08T16:14:32Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-08T16:14:35Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8808",
    "cleanId": "G-8808",
    "customerEmail": "d.ward@mail.com",
    "template": "Toyota Supra Crimson Red Adrenaline",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-09-11T14:19:52Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "charger-srt.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/15.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-11T14:19:52Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-11T14:19:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-11T14:20:19Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-11T14:20:22Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8809",
    "cleanId": "G-8809",
    "customerEmail": "e.drake@mail.com",
    "template": "Toyota Supra MK5 Sunburst",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-09-12T18:58:29Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "dual-cars.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/14.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-12T18:58:29Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-12T18:58:37Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-12T18:59:04Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-12T18:59:07Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8810",
    "cleanId": "G-8810",
    "customerEmail": "e.drake@mail.com",
    "template": "BMW M4 CSL One Life Just One",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-09-14T01:06:02Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "civic-type-r.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/24.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-14T01:06:02Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-14T01:06:06Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-14T01:06:31Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-14T01:06:34Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8811",
    "cleanId": "G-8811",
    "customerEmail": "e.drake@mail.com",
    "template": "Mercedes-AMG CLE 53 Triple Panel + McLaren 720S Red Street Graffiti",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-09-15T18:17:49Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/22.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-15T18:17:49Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-15T18:17:52Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-15T18:18:26Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-15T18:18:29Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8812",
    "cleanId": "G-8812",
    "customerEmail": "e.drake@mail.com",
    "template": "Aventador SVJ Crimson Storm",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-09-16T16:53:21Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": null,
    "error": "Image provider rejected the request (content check). Customer was told to try a different photo.",
    "timeline": [
      {
        "time": "2026-09-16T16:53:21Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-16T16:53:28Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-16T16:53:39Z",
        "label": "Failed"
      },
      {
        "time": "2026-09-16T16:53:40Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8813",
    "cleanId": "G-8813",
    "customerEmail": "i.rossi@mail.com",
    "template": "Nissan 240SX Rain Garage Spec + Ferrari 812 GTS Golden Hour",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-09-18T02:32:41Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/20.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-09-18T02:32:41Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-18T02:32:44Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-18T02:33:20Z",
        "label": "Completed"
      },
      {
        "time": "2026-09-18T02:33:23Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8814",
    "cleanId": "G-8814",
    "customerEmail": "d.ward@mail.com",
    "template": "Shelby GT350 Heritage Racing Stripe",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-09-25T23:43:56Z",
    "customText": null,
    "attempt": {
      "used": 2,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": null,
    "error": "Generation timed out after 60 seconds. Customer was offered a free retry.",
    "timeline": [
      {
        "time": "2026-09-25T23:43:56Z",
        "label": "Queued"
      },
      {
        "time": "2026-09-25T23:44:03Z",
        "label": "Processing"
      },
      {
        "time": "2026-09-25T23:44:22Z",
        "label": "Failed"
      },
      {
        "time": "2026-09-25T23:44:23Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8815",
    "cleanId": "G-8815",
    "customerEmail": "e.drake@mail.com",
    "template": "Neon Night",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-03T00:42:59Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/4.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-03T00:42:59Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-03T00:43:06Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-03T00:43:34Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-03T00:43:37Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8816",
    "cleanId": "G-8816",
    "customerEmail": "a.morales@mail.com",
    "template": "Retro Racer",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-08T18:13:46Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "camaro-zl1.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/1.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-08T18:13:46Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-08T18:13:53Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-08T18:14:28Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-08T18:14:31Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8817",
    "cleanId": "G-8817",
    "customerEmail": "e.drake@mail.com",
    "template": "Porsche 992 GT3 RS Modern Minimalist + Ferrari F40 Atrium Spec",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-10-09T21:10:24Z",
    "customText": "Lap Record",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/7.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-09T21:10:24Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-09T21:10:28Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-09T21:11:01Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-09T21:11:04Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8818",
    "cleanId": "G-8818",
    "customerEmail": "e.drake@mail.com",
    "template": "Shelby GT350 Heritage Racing Stripe",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-10T14:55:50Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "f150-raptor.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/5.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-10T14:55:50Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-10T14:55:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-10T14:56:35Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-10T14:56:38Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8819",
    "cleanId": "G-8819",
    "customerEmail": "t.ross@mail.com",
    "template": "McLaren P1 GTR London Golden Hour",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-10T20:21:48Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/27.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-10T20:21:48Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-10T20:21:55Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-10T20:22:18Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-10T20:22:21Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8820",
    "cleanId": "G-8820",
    "customerEmail": "a.khan@mail.com",
    "template": "Nissan 240SX Rain Garage Spec",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-11T01:09:43Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/20.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-11T01:09:43Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-11T01:09:47Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-11T01:10:22Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-11T01:10:25Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8821",
    "cleanId": "G-8821",
    "customerEmail": "a.morales@mail.com",
    "template": "Ferrari 812 GTS Golden Hour",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-13T20:23:17Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/26.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-13T20:23:17Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-13T20:23:20Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-13T20:23:48Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-13T20:23:51Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8822",
    "cleanId": "G-8822",
    "customerEmail": "s.roy@mail.com",
    "template": "Koenigsegg Agera RS Thunderstorm + Toyota Supra MK5 Sunburst",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-10-14T16:03:17Z",
    "customText": "Sunday Cruise",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "mustang-gt.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/29.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-14T16:03:17Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-14T16:03:20Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-14T16:04:01Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-14T16:04:04Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8823",
    "cleanId": "G-8823",
    "customerEmail": "a.khan@mail.com",
    "template": "Porsche GT3 RS Neon Pink Halo",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-10-15T01:14:53Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": null,
    "error": "Image provider rejected the request (content check). Customer was told to try a different photo.",
    "timeline": [
      {
        "time": "2026-10-15T01:14:53Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-15T01:14:59Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-15T01:15:13Z",
        "label": "Failed"
      },
      {
        "time": "2026-10-15T01:15:14Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8824",
    "cleanId": "G-8824",
    "customerEmail": "a.khan@mail.com",
    "template": "Toyota Supra Crimson Red Adrenaline",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-15T16:05:31Z",
    "customText": "Lap Record",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/15.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-15T16:05:31Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-15T16:05:39Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-15T16:05:58Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-15T16:06:01Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8825",
    "cleanId": "G-8825",
    "customerEmail": "a.khan@mail.com",
    "template": "Shelby GT350 Heritage Racing Stripe",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-15T22:15:50Z",
    "customText": "Class of 2026",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/5.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-15T22:15:50Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-15T22:15:54Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-15T22:16:32Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-15T22:16:35Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8826",
    "cleanId": "G-8826",
    "customerEmail": "a.morales@mail.com",
    "template": "McLaren 720S Red Street Graffiti + Ferrari 812 GTS Golden Hour",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-10-16T02:16:10Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "mustang-gt.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/3.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-16T02:16:10Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-16T02:16:13Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-16T02:16:43Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-16T02:16:46Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8827",
    "cleanId": "G-8827",
    "customerEmail": "l.vance@mail.com",
    "template": "Toyota Supra Crimson Red Adrenaline",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-21T01:31:52Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/15.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-21T01:31:52Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-21T01:31:59Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-21T01:32:34Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-21T01:32:37Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8828",
    "cleanId": "G-8828",
    "customerEmail": "a.khan@mail.com",
    "template": "Nissan 240SX Rain Garage Spec + McLaren P1 GTR London Golden Hour",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-10-21T14:21:48Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "civic-type-r.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/20.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-21T14:21:48Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-21T14:21:52Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-21T14:22:33Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-21T14:22:36Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8829",
    "cleanId": "G-8829",
    "customerEmail": "n.coleman@mail.com",
    "template": "Bugatti Chiron Super Sport 300+",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-10-21T18:55:14Z",
    "customText": "Track Day",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": null,
    "error": "Image provider rejected the request (content check). Customer was told to try a different photo.",
    "timeline": [
      {
        "time": "2026-10-21T18:55:14Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-21T18:55:18Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-21T18:55:34Z",
        "label": "Failed"
      },
      {
        "time": "2026-10-21T18:55:35Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8830",
    "cleanId": "G-8830",
    "customerEmail": "n.coleman@mail.com",
    "template": "Pagani Zonda Obsidian Noir",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-22T01:53:43Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/6.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-22T01:53:43Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-22T01:53:48Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-22T01:54:16Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-22T01:54:19Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8831",
    "cleanId": "G-8831",
    "customerEmail": "t.ross@mail.com",
    "template": "Retro Racer",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-23T01:55:19Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "miata-nd.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/1.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-23T01:55:19Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-23T01:55:24Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-23T01:55:49Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-23T01:55:52Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8832",
    "cleanId": "G-8832",
    "customerEmail": "a.khan@mail.com",
    "template": "Neon Night + Lamborghini Huracán Tecnica Sunset",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-10-23T20:06:07Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/4.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-23T20:06:07Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-23T20:06:13Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-23T20:06:42Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-23T20:06:45Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8833",
    "cleanId": "G-8833",
    "customerEmail": "l.miller@mail.com",
    "template": "Lamborghini Huracán Tecnica Sunset",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-24T17:29:41Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "tesla-plaid.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/30.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-24T17:29:41Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-24T17:29:44Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-24T17:30:19Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-24T17:30:22Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8834",
    "cleanId": "G-8834",
    "customerEmail": "j.hayes@mail.com",
    "template": "Nissan Skyline GTR R33 1000HP",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-24T22:45:47Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "tesla-plaid.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/21.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-24T22:45:47Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-24T22:45:55Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-24T22:46:25Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-24T22:46:28Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8835",
    "cleanId": "G-8835",
    "customerEmail": "l.vance@mail.com",
    "template": "Porsche GT3 RS Neon Pink Halo",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-25T01:37:49Z",
    "customText": "Lap Record",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "dual-cars.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/9.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-25T01:37:49Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-25T01:37:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-25T01:38:29Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-25T01:38:32Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8836",
    "cleanId": "G-8836",
    "customerEmail": "h.davis@mail.com",
    "template": "Aventador SVJ Crimson Storm",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-26T16:47:10Z",
    "customText": "Class of 2026",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/8.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-26T16:47:10Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-26T16:47:17Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-26T16:47:47Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-26T16:47:50Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8837",
    "cleanId": "G-8837",
    "customerEmail": "h.davis@mail.com",
    "template": "Porsche 992 GT3 RS Modern Minimalist",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-10-31T17:31:03Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/7.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-10-31T17:31:03Z",
        "label": "Queued"
      },
      {
        "time": "2026-10-31T17:31:09Z",
        "label": "Processing"
      },
      {
        "time": "2026-10-31T17:31:30Z",
        "label": "Completed"
      },
      {
        "time": "2026-10-31T17:31:33Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8838",
    "cleanId": "G-8838",
    "customerEmail": "e.drake@mail.com",
    "template": "Lamborghini Huracán Tecnica Sunset",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-01T17:28:07Z",
    "customText": "Garage 27",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/30.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-01T17:28:07Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-01T17:28:11Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-01T17:28:34Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-01T17:28:37Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8839",
    "cleanId": "G-8839",
    "customerEmail": "j.hayes@mail.com",
    "template": "McLaren 720S Red Street Graffiti",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-01T22:42:19Z",
    "customText": null,
    "attempt": {
      "used": 2,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "dual-cars.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": null,
    "error": "Generation timed out after 60 seconds. Customer was offered a free retry.",
    "timeline": [
      {
        "time": "2026-11-01T22:42:19Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-01T22:42:24Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-01T22:42:43Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-01T22:42:44Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8840",
    "cleanId": "G-8840",
    "customerEmail": "a.morales@mail.com",
    "template": "Koenigsegg Agera RS Thunderstorm",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-02T17:45:02Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/29.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-02T17:45:02Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-02T17:45:05Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-02T17:45:39Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-02T17:45:42Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8841",
    "cleanId": "G-8841",
    "customerEmail": "l.vance@mail.com",
    "template": "Porsche 992 GT3 RS Modern Minimalist",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-02T22:04:05Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "mustang-gt.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/7.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-02T22:04:05Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-02T22:04:11Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-02T22:04:48Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-02T22:04:51Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8842",
    "cleanId": "G-8842",
    "customerEmail": "c.bennett@mail.com",
    "template": "Toyota Supra MK4 2JZ Fast & Furious",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-03T21:40:00Z",
    "customText": "Class of 2026",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "charger-srt.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/17.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-03T21:40:00Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-03T21:40:06Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-03T21:40:50Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-03T21:40:53Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8843",
    "cleanId": "G-8843",
    "customerEmail": "l.miller@mail.com",
    "template": "Toyota Supra MK5 Sunburst",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-04T17:31:46Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/14.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-04T17:31:46Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-04T17:31:51Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-04T17:32:29Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-04T17:32:32Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8844",
    "cleanId": "G-8844",
    "customerEmail": "a.morales@mail.com",
    "template": "Porsche GT3 RS Neon Pink Halo",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-05T01:35:16Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "wrx-sti.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/9.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-05T01:35:16Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-05T01:35:21Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-05T01:35:42Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-05T01:35:45Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8845",
    "cleanId": "G-8845",
    "customerEmail": "e.drake@mail.com",
    "template": "Aventador SVJ Crimson Storm",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-05T19:52:42Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "civic-type-r.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/8.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-05T19:52:42Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-05T19:52:45Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-05T19:53:25Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-05T19:53:28Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8846",
    "cleanId": "G-8846",
    "customerEmail": "a.khan@mail.com",
    "template": "Toyota Supra MK5 Sunburst",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-05T20:04:05Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/14.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-05T20:04:05Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-05T20:04:10Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-05T20:04:41Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-05T20:04:44Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8847",
    "cleanId": "G-8847",
    "customerEmail": "a.khan@mail.com",
    "template": "Porsche 911 British Racing Green",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-05T20:16:32Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "dual-cars.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/2.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-05T20:16:32Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-05T20:16:36Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-05T20:16:55Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-05T20:16:58Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8848",
    "cleanId": "G-8848",
    "customerEmail": "c.martin@mail.com",
    "template": "McLaren P1 GTR London Golden Hour",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-06T02:17:34Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "tesla-plaid.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/27.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-06T02:17:34Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-06T02:17:37Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-06T02:18:14Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-06T02:18:17Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8849",
    "cleanId": "G-8849",
    "customerEmail": "a.khan@mail.com",
    "template": "Nissan 240SX Rain Garage Spec",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-06T15:00:18Z",
    "customText": "Lap Record",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "miata-nd.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/20.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-06T15:00:18Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-06T15:00:24Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-06T15:01:01Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-06T15:01:04Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8850",
    "cleanId": "G-8850",
    "customerEmail": "a.khan@mail.com",
    "template": "Porsche GT3 RS 2022 Matte Obsidian",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-07T22:02:37Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/19.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-07T22:02:37Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-07T22:02:42Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-07T22:03:15Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-07T22:03:18Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8851",
    "cleanId": "G-8851",
    "customerEmail": "s.roy@mail.com",
    "template": "BMW M4 CSL One Life Just One",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-08T14:12:16Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "wrx-sti.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/24.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-08T14:12:16Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-08T14:12:24Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-08T14:12:44Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-08T14:12:47Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8852",
    "cleanId": "G-8852",
    "customerEmail": "i.rossi@mail.com",
    "template": "Neon Night",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-08T14:30:31Z",
    "customText": "Lap Record",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "miata-nd.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/4.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-08T14:30:31Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-08T14:30:39Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-08T14:31:04Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-08T14:31:07Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8853",
    "cleanId": "G-8853",
    "customerEmail": "s.roy@mail.com",
    "template": "Toyota Supra MK4 2JZ Fast & Furious",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-08T15:51:46Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "civic-type-r.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/17.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-08T15:51:46Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-08T15:51:52Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-08T15:52:21Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-08T15:52:24Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8854",
    "cleanId": "G-8854",
    "customerEmail": "a.khan@mail.com",
    "template": "McLaren 720S Red Street Graffiti",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-08T18:33:21Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/3.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-08T18:33:21Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-08T18:33:25Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-08T18:34:04Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-08T18:34:07Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8855",
    "cleanId": "G-8855",
    "customerEmail": "c.bennett@mail.com",
    "template": "Pagani Zonda Obsidian Noir",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-09T19:44:52Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "charger-srt.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/6.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-09T19:44:52Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-09T19:45:00Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-09T19:45:36Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-09T19:45:39Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8856",
    "cleanId": "G-8856",
    "customerEmail": "a.khan@mail.com",
    "template": "Porsche 911 Turbo S Risograph",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-09T20:42:00Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "porsche-gt3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/25.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-09T20:42:00Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-09T20:42:07Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-09T20:42:50Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-09T20:42:53Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8857",
    "cleanId": "G-8857",
    "customerEmail": "m.das@mail.com",
    "template": "Neon Night",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-09T23:55:20Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": null,
    "error": "Image provider rejected the request (content check). Customer was told to try a different photo.",
    "timeline": [
      {
        "time": "2026-11-09T23:55:20Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-09T23:55:28Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-09T23:55:46Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-09T23:55:47Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8858",
    "cleanId": "G-8858",
    "customerEmail": "c.bennett@mail.com",
    "template": "Shelby GT350 Heritage Racing Stripe",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-10T00:29:41Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/5.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-10T00:29:41Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-10T00:29:48Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-10T00:30:19Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-10T00:30:22Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8859",
    "cleanId": "G-8859",
    "customerEmail": "m.das@mail.com",
    "template": "Pagani Zonda Obsidian Noir",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-10T17:05:49Z",
    "customText": "Dad's Garage",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "gt-r-r35.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/6.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-10T17:05:49Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-10T17:05:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-10T17:06:22Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-10T17:06:25Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8860",
    "cleanId": "G-8860",
    "customerEmail": "s.roy@mail.com",
    "template": "Toyota Supra Crimson Red Adrenaline",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-10T17:48:16Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/15.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-10T17:48:16Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-10T17:48:21Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-10T17:48:47Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-10T17:48:50Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8861",
    "cleanId": "G-8861",
    "customerEmail": "m.das@mail.com",
    "template": "Nissan Skyline GTR R33 1000HP",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-10T19:49:27Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "civic-type-r.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/21.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-10T19:49:27Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-10T19:49:31Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-10T19:50:14Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-10T19:50:17Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8862",
    "cleanId": "G-8862",
    "customerEmail": "m.das@mail.com",
    "template": "Porsche 911 British Racing Green + McLaren 720S Red Street Graffiti",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-11-11T18:04:53Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "dual-cars.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/2.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-11T18:04:53Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-11T18:04:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-11T18:05:16Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-11T18:05:19Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8863",
    "cleanId": "G-8863",
    "customerEmail": "m.das@mail.com",
    "template": "Toyota Supra MK5 Sunburst",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-11T18:52:38Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": null,
    "error": "Image provider rejected the request (content check). Customer was told to try a different photo.",
    "timeline": [
      {
        "time": "2026-11-11T18:52:38Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-11T18:52:41Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-11T18:53:06Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-11T18:53:07Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8864",
    "cleanId": "G-8864",
    "customerEmail": "m.das@mail.com",
    "template": "Shelby GT350 Heritage Racing Stripe + Lamborghini Huracán Tecnica Sunset",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-11-12T00:18:59Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "mustang-gt.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/5.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-12T00:18:59Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-12T00:19:05Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-12T00:19:36Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-12T00:19:39Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8865",
    "cleanId": "G-8865",
    "customerEmail": "m.das@mail.com",
    "template": "McLaren 720S Red Street Graffiti",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-12T15:30:11Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "tesla-plaid.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/3.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-12T15:30:11Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-12T15:30:18Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-12T15:30:48Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-12T15:30:51Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8866",
    "cleanId": "G-8866",
    "customerEmail": "c.martin@mail.com",
    "template": "Ferrari F40 Atrium Spec",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-12T17:28:51Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "wrx-sti.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/11.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-12T17:28:51Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-12T17:28:57Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-12T17:29:36Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-12T17:29:39Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8867",
    "cleanId": "G-8867",
    "customerEmail": "n.coleman@mail.com",
    "template": "Bugatti Chiron Super Sport 300+ + Nissan Skyline GTR R33 1000HP",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-11-13T00:49:47Z",
    "customText": "Sunday Cruise",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "miata-nd.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/10.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-13T00:49:47Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-13T00:49:52Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-13T00:50:32Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-13T00:50:35Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8868",
    "cleanId": "G-8868",
    "customerEmail": "m.das@mail.com",
    "template": "Lamborghini Huracán Tecnica Sunset",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-13T17:28:27Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": null,
    "error": "Image provider rejected the request (content check). Customer was told to try a different photo.",
    "timeline": [
      {
        "time": "2026-11-13T17:28:27Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-13T17:28:31Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-13T17:28:43Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-13T17:28:44Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8869",
    "cleanId": "G-8869",
    "customerEmail": "l.vance@mail.com",
    "template": "Ferrari 812 GTS Golden Hour + BMW M4 CSL One Life Just One",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-11-13T20:56:46Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "porsche-gt3.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/26.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-13T20:56:46Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-13T20:56:51Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-13T20:57:13Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-13T20:57:16Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8870",
    "cleanId": "G-8870",
    "customerEmail": "m.das@mail.com",
    "template": "Ferrari F40 Atrium Spec",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-14T01:38:32Z",
    "customText": "Dad's Garage",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/11.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T01:38:32Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T01:38:35Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T01:38:56Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T01:38:59Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8871",
    "cleanId": "G-8871",
    "customerEmail": "s.roy@mail.com",
    "template": "Toyota Supra Crimson Red Adrenaline",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-14T14:38:32Z",
    "customText": "Class of 2026",
    "attempt": {
      "used": 3,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "911-carrera.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": null,
    "error": "Vehicle detection model could not identify chassis orientation with confidence above 85%.",
    "timeline": [
      {
        "time": "2026-11-14T14:38:32Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T14:38:35Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T14:38:52Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-14T14:38:53Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8872",
    "cleanId": "G-8872",
    "customerEmail": "m.das@mail.com",
    "template": "Porsche 992 GT3 RS Modern Minimalist",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-14T15:43:10Z",
    "customText": "Lap Record",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/7.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T15:43:10Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T15:43:16Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T15:43:46Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T15:43:49Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8873",
    "cleanId": "G-8873",
    "customerEmail": "n.coleman@mail.com",
    "template": "Koenigsegg Agera RS Thunderstorm",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-14T17:34:16Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "charger-srt.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/29.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T17:34:16Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T17:34:22Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T17:34:51Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T17:34:54Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8874",
    "cleanId": "G-8874",
    "customerEmail": "m.das@mail.com",
    "template": "Toyota Supra MK5 Sunburst",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-14T18:25:17Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "miata-nd.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/14.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T18:25:17Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T18:25:20Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T18:26:05Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T18:26:08Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8875",
    "cleanId": "G-8875",
    "customerEmail": "m.das@mail.com",
    "template": "Toyota Supra MK4 2JZ Fast & Furious + Porsche 911 Turbo S Risograph",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-11-14T18:28:51Z",
    "customText": "Dad's Garage",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/17.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T18:28:51Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T18:28:58Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T18:29:28Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T18:29:31Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8876",
    "cleanId": "G-8876",
    "customerEmail": "m.das@mail.com",
    "template": "Pagani Zonda Obsidian Noir",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-14T20:15:14Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "wrx-sti.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/6.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T20:15:14Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T20:15:20Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T20:16:00Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T20:16:03Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8877",
    "cleanId": "G-8877",
    "customerEmail": "m.das@mail.com",
    "template": "Toyota Supra MK4 2JZ Fast & Furious",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-14T20:50:26Z",
    "customText": null,
    "attempt": {
      "used": 2,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": null,
    "error": "Generation timed out after 60 seconds. Customer was offered a free retry.",
    "timeline": [
      {
        "time": "2026-11-14T20:50:26Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T20:50:33Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T20:50:44Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-14T20:50:45Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8878",
    "cleanId": "G-8878",
    "customerEmail": "o.brooks@mail.com",
    "template": "Porsche GT3 RS 2022 Matte Obsidian",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-14T21:56:51Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/19.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-14T21:56:51Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-14T21:56:59Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-14T21:57:34Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-14T21:57:37Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8879",
    "cleanId": "G-8879",
    "customerEmail": "m.das@mail.com",
    "template": "Porsche 911 British Racing Green",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-15T00:35:56Z",
    "customText": "Track Day",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "porsche-gt3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/2.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-15T00:35:56Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-15T00:35:59Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-15T00:36:23Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-15T00:36:26Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8880",
    "cleanId": "G-8880",
    "customerEmail": "o.brooks@mail.com",
    "template": "Mazda RX-7 Veilside Tokyo Drift",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-15T17:23:19Z",
    "customText": "Dad's Garage",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/13.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-15T17:23:19Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-15T17:23:27Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-15T17:23:55Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-15T17:23:58Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8881",
    "cleanId": "G-8881",
    "customerEmail": "t.ross@mail.com",
    "template": "Retro Racer",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-15T18:04:02Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/1.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-15T18:04:02Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-15T18:04:09Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-15T18:04:54Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-15T18:04:57Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8882",
    "cleanId": "G-8882",
    "customerEmail": "l.vance@mail.com",
    "template": "Nissan 240SX Rain Garage Spec",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-15T20:38:29Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/20.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-15T20:38:29Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-15T20:38:33Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-15T20:39:10Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-15T20:39:13Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8883",
    "cleanId": "G-8883",
    "customerEmail": "n.coleman@mail.com",
    "template": "Porsche GT3 RS Neon Pink Halo",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-16T00:15:46Z",
    "customText": "Dad's Garage",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "tesla-plaid.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/9.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-16T00:15:46Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-16T00:15:52Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-16T00:16:37Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-16T00:16:40Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8884",
    "cleanId": "G-8884",
    "customerEmail": "e.drake@mail.com",
    "template": "Toyota Supra MK5 Sunburst",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-16T17:02:38Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "challenger-hellcat.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/14.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-16T17:02:38Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-16T17:02:43Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-16T17:03:04Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-16T17:03:07Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8885",
    "cleanId": "G-8885",
    "customerEmail": "d.ward@mail.com",
    "template": "Shelby GT350 Heritage Racing Stripe",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-17T01:54:56Z",
    "customText": "Born to Drive",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "corvette-c8.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/5.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-17T01:54:56Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-17T01:55:04Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-17T01:55:28Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-17T01:55:31Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8886",
    "cleanId": "G-8886",
    "customerEmail": "o.brooks@mail.com",
    "template": "Nissan 240SX Rain Garage Spec",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-17T19:38:20Z",
    "customText": "Sunday Cruise",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "civic-type-r.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": {
      "image": "/template photo/20.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-17T19:38:20Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-17T19:38:25Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-17T19:39:03Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-17T19:39:06Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8887",
    "cleanId": "G-8887",
    "customerEmail": "t.ross@mail.com",
    "template": "Retro Racer",
    "type": "Individual",
    "state": "Failed",
    "createdAt": "2026-11-18T14:08:22Z",
    "customText": null,
    "attempt": {
      "used": 3,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "charger-srt.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": null,
    "error": "Vehicle detection model could not identify chassis orientation with confidence above 85%.",
    "timeline": [
      {
        "time": "2026-11-18T14:08:22Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T14:08:29Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-18T14:08:41Z",
        "label": "Failed"
      },
      {
        "time": "2026-11-18T14:08:42Z",
        "label": "Failure email sent"
      }
    ]
  },
  {
    "id": "#G-8888",
    "cleanId": "G-8888",
    "customerEmail": "h.davis@mail.com",
    "template": "BMW M4 CSL One Life Just One",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-18T15:10:16Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "supra-mk4.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/24.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T15:10:16Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T15:10:22Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-18T15:10:57Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-18T15:11:00Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8889",
    "cleanId": "G-8889",
    "customerEmail": "c.martin@mail.com",
    "template": "Porsche 992 GT3 RS Modern Minimalist",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-18T15:18:26Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "mustang-gt.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": {
      "image": "/template photo/7.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T15:18:26Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T15:18:29Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-18T15:18:50Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-18T15:18:53Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8890",
    "cleanId": "G-8890",
    "customerEmail": "o.brooks@mail.com",
    "template": "BMW M4 G82 Apex Edition",
    "type": "Individual",
    "state": "Completed",
    "createdAt": "2026-11-18T15:53:10Z",
    "customText": "Class of 2026",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "gt-r-r35.jpg",
      "dimensions": "4000 x 3000 px",
      "image": null
    },
    "output": {
      "image": "/template photo/23.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T15:53:10Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T15:53:17Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-18T15:53:40Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-18T15:53:43Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8891",
    "cleanId": "G-8891",
    "customerEmail": "a.khan@mail.com",
    "template": "Mazda RX-7 Veilside Tokyo Drift + Mercedes-AMG CLE 53 Triple Panel",
    "type": "Combined",
    "state": "Completed",
    "createdAt": "2026-11-18T16:44:21Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "mustang-gt.jpg",
      "dimensions": "4608 x 3456 px",
      "image": null
    },
    "output": {
      "image": "/template photo/13.webp",
      "dimensions": "5400 x 7200 px"
    },
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T16:44:21Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T16:44:25Z",
        "label": "Processing"
      },
      {
        "time": "2026-11-18T16:44:56Z",
        "label": "Completed"
      },
      {
        "time": "2026-11-18T16:44:59Z",
        "label": "High-res poster generated"
      }
    ]
  },
  {
    "id": "#G-8892",
    "cleanId": "G-8892",
    "customerEmail": "a.khan@mail.com",
    "template": "Porsche Carrera GT Spec Sheet + Shelby GT350 Heritage Racing Stripe",
    "type": "Combined",
    "state": "Processing",
    "createdAt": "2026-11-18T17:22:00Z",
    "customText": "Route 66",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": null,
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T17:22:00Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T17:22:07Z",
        "label": "Processing"
      }
    ]
  },
  {
    "id": "#G-8893",
    "cleanId": "G-8893",
    "customerEmail": "n.coleman@mail.com",
    "template": "Nissan Skyline GTR R33 1000HP",
    "type": "Individual",
    "state": "Processing",
    "createdAt": "2026-11-18T17:33:00Z",
    "customText": "Class of 2026",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "camaro-zl1.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": null,
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T17:33:00Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T17:33:04Z",
        "label": "Processing"
      }
    ]
  },
  {
    "id": "#G-8894",
    "cleanId": "G-8894",
    "customerEmail": "o.brooks@mail.com",
    "template": "Aventador SVJ Crimson Storm",
    "type": "Individual",
    "state": "Queued",
    "createdAt": "2026-11-18T17:35:00Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "bmw-m3.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": null,
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T17:35:00Z",
        "label": "Queued"
      }
    ]
  },
  {
    "id": "#G-8895",
    "cleanId": "G-8895",
    "customerEmail": "e.drake@mail.com",
    "template": "Porsche 911 British Racing Green + Koenigsegg Jesko Absolut Red Studio",
    "type": "Combined",
    "state": "Processing",
    "createdAt": "2026-11-18T17:49:00Z",
    "customText": "Sunday Cruise",
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "camaro-zl1.jpg",
      "dimensions": "3840 x 2160 px",
      "image": null
    },
    "output": null,
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T17:49:00Z",
        "label": "Queued"
      },
      {
        "time": "2026-11-18T17:49:03Z",
        "label": "Processing"
      }
    ]
  },
  {
    "id": "#G-8896",
    "cleanId": "G-8896",
    "customerEmail": "l.vance@mail.com",
    "template": "Aventador SVJ Crimson Storm",
    "type": "Individual",
    "state": "Queued",
    "createdAt": "2026-11-18T17:55:00Z",
    "customText": null,
    "attempt": {
      "used": 1,
      "allowed": 3
    },
    "carPhoto": {
      "fileName": "camaro-zl1.jpg",
      "dimensions": "4032 x 3024 px",
      "image": null
    },
    "output": null,
    "error": null,
    "timeline": [
      {
        "time": "2026-11-18T17:55:00Z",
        "label": "Queued"
      }
    ]
  }
]

// ORDERS: what was bought and paid for. Each item points to a completed generation (generationId).
export const ORDERS: Order[] = [
  {
    "id": "#1001",
    "cleanId": "1001",
    "customerEmail": "e.drake@mail.com",
    "createdAt": "2026-09-14T00:27:29Z",
    "items": [
      {
        "id": "art-1001-1",
        "generationId": "G-8806",
        "name": "Nissan Skyline GTR R33 1000HP",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 2,
        "unitPrice": 24.0,
        "lineTotal": 48.0,
        "image": "/template photo/21.webp"
      },
      {
        "id": "art-1001-2",
        "generationId": "G-8809",
        "name": "Toyota Supra MK5 Sunburst",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 38.0,
        "lineTotal": 38.0,
        "image": "/template photo/14.webp"
      }
    ],
    "subtotal": 86.0,
    "shippingFee": 0.0,
    "total": 86.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3Q3I3qr2OJqHrdSRD6eRg",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Q3I3qr2OJqHrdSRD6eRg"
    },
    "shipping": {
      "name": "Ethan Drake",
      "line1": "210 Newbury Street",
      "line2": "3rd Floor",
      "city": "Boston",
      "state": "MA",
      "zip": "02116",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1002",
    "cleanId": "1002",
    "customerEmail": "e.drake@mail.com",
    "createdAt": "2026-10-04T01:50:59Z",
    "items": [
      {
        "id": "art-1002-1",
        "generationId": "G-8810",
        "name": "BMW M4 CSL One Life Just One",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 40.0,
        "lineTotal": 40.0,
        "image": "/template photo/24.webp"
      },
      {
        "id": "art-1002-2",
        "generationId": "G-8815",
        "name": "Neon Night",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 32.0,
        "lineTotal": 64.0,
        "image": "/template photo/4.webp"
      }
    ],
    "subtotal": 104.0,
    "shippingFee": 0.0,
    "total": 104.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QJcbLjjxGUPIa3a9DSKv",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QJcbLjjxGUPIa3a9DSKv"
    },
    "shipping": {
      "name": "Ethan Drake",
      "line1": "210 Newbury Street",
      "line2": "3rd Floor",
      "city": "Boston",
      "state": "MA",
      "zip": "02116",
      "country": "United States"
    },
    "notes": [
      "Standard museum tube packaging."
    ]
  },
  {
    "id": "#1003",
    "cleanId": "1003",
    "customerEmail": "a.morales@mail.com",
    "createdAt": "2026-10-09T04:36:46Z",
    "items": [
      {
        "id": "art-1003-1",
        "generationId": "G-8816",
        "name": "Retro Racer",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 38.0,
        "lineTotal": 38.0,
        "image": "/template photo/1.webp"
      }
    ],
    "subtotal": 38.0,
    "shippingFee": 7.95,
    "total": 45.95,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QbZnqdB3ekyOsFq8v4p7",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QbZnqdB3ekyOsFq8v4p7"
    },
    "shipping": {
      "name": "Ava Morales",
      "line1": "3344 Peachtree Road NE",
      "line2": "Suite 800",
      "city": "Atlanta",
      "state": "GA",
      "zip": "30326",
      "country": "United States"
    },
    "notes": [
      "Reinforced corner protectors added."
    ]
  },
  {
    "id": "#1004",
    "cleanId": "1004",
    "customerEmail": "a.khan@mail.com",
    "createdAt": "2026-10-22T04:59:48Z",
    "items": [
      {
        "id": "art-1004-1",
        "generationId": "G-8825",
        "name": "Shelby GT350 Heritage Racing Stripe",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 26.0,
        "lineTotal": 26.0,
        "image": "/template photo/5.webp"
      },
      {
        "id": "art-1004-2",
        "generationId": "G-8828",
        "name": "Nissan 240SX Rain Garage Spec + McLaren P1 GTR London Golden Hour",
        "type": "Combined",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 46.0,
        "lineTotal": 46.0,
        "image": "/template photo/20.webp"
      }
    ],
    "subtotal": 72.0,
    "shippingFee": 0.0,
    "total": 72.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QfF9wBFXRFec5cw3WF4E",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QfF9wBFXRFec5cw3WF4E"
    },
    "shipping": {
      "name": "Ayaan Khan",
      "line1": "88 Newark Avenue",
      "line2": "Apt 5C",
      "city": "Jersey City",
      "state": "NJ",
      "zip": "07302",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1005",
    "cleanId": "1005",
    "customerEmail": "c.bennett@mail.com",
    "createdAt": "2026-11-04T21:26:00Z",
    "items": [
      {
        "id": "art-1005-1",
        "generationId": "G-8842",
        "name": "Toyota Supra MK4 2JZ Fast & Furious",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 42.0,
        "lineTotal": 84.0,
        "image": "/template photo/17.webp"
      }
    ],
    "subtotal": 84.0,
    "shippingFee": 0.0,
    "total": 84.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QoOvqHWrb69JzjVdsDom",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QoOvqHWrb69JzjVdsDom"
    },
    "shipping": {
      "name": "Chloe Bennett",
      "line1": "600 West Broadway",
      "line2": "Suite 1400",
      "city": "San Diego",
      "state": "CA",
      "zip": "92101",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1006",
    "cleanId": "1006",
    "customerEmail": "a.morales@mail.com",
    "createdAt": "2026-11-05T23:21:16Z",
    "items": [
      {
        "id": "art-1006-1",
        "generationId": "G-8821",
        "name": "Ferrari 812 GTS Golden Hour",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 48.0,
        "lineTotal": 48.0,
        "image": "/template photo/26.webp"
      },
      {
        "id": "art-1006-2",
        "generationId": "G-8840",
        "name": "Koenigsegg Agera RS Thunderstorm",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 40.0,
        "lineTotal": 40.0,
        "image": "/template photo/29.webp"
      },
      {
        "id": "art-1006-3",
        "generationId": "G-8844",
        "name": "Porsche GT3 RS Neon Pink Halo",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 36.0,
        "lineTotal": 36.0,
        "image": "/template photo/9.webp"
      }
    ],
    "subtotal": 124.0,
    "shippingFee": 0.0,
    "total": 124.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3Q7hPnzkVlAhV2DXTP39x",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Q7hPnzkVlAhV2DXTP39x"
    },
    "shipping": {
      "name": "Ava Morales",
      "line1": "3344 Peachtree Road NE",
      "line2": "Suite 800",
      "city": "Atlanta",
      "state": "GA",
      "zip": "30326",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1007",
    "cleanId": "1007",
    "customerEmail": "a.khan@mail.com",
    "createdAt": "2026-11-06T01:07:05Z",
    "items": [
      {
        "id": "art-1007-1",
        "generationId": "G-8832",
        "name": "Neon Night + Lamborghini Huracán Tecnica Sunset",
        "type": "Combined",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 46.0,
        "lineTotal": 46.0,
        "image": "/template photo/4.webp"
      },
      {
        "id": "art-1007-2",
        "generationId": "G-8846",
        "name": "Toyota Supra MK5 Sunburst",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 38.0,
        "lineTotal": 38.0,
        "image": "/template photo/14.webp"
      }
    ],
    "subtotal": 84.0,
    "shippingFee": 0.0,
    "total": 84.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QeUCbYB8vkgqDbNMz9E1",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QeUCbYB8vkgqDbNMz9E1"
    },
    "shipping": {
      "name": "Ayaan Khan",
      "line1": "88 Newark Avenue",
      "line2": "Apt 5C",
      "city": "Jersey City",
      "state": "NJ",
      "zip": "07302",
      "country": "United States"
    },
    "notes": [
      "Standard museum tube packaging."
    ]
  },
  {
    "id": "#1008",
    "cleanId": "1008",
    "customerEmail": "a.khan@mail.com",
    "createdAt": "2026-11-07T09:17:18Z",
    "items": [
      {
        "id": "art-1008-1",
        "generationId": "G-8847",
        "name": "Porsche 911 British Racing Green",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 29.0,
        "lineTotal": 29.0,
        "image": "/template photo/2.webp"
      },
      {
        "id": "art-1008-2",
        "generationId": "G-8849",
        "name": "Nissan 240SX Rain Garage Spec",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 2,
        "unitPrice": 26.0,
        "lineTotal": 52.0,
        "image": "/template photo/20.webp"
      }
    ],
    "subtotal": 81.0,
    "shippingFee": 0.0,
    "total": 81.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3Q5xjKUODqURwjdYUnPj9",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Q5xjKUODqURwjdYUnPj9"
    },
    "shipping": {
      "name": "Ayaan Khan",
      "line1": "88 Newark Avenue",
      "line2": "Apt 5C",
      "city": "Jersey City",
      "state": "NJ",
      "zip": "07302",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1009",
    "cleanId": "1009",
    "customerEmail": "i.rossi@mail.com",
    "createdAt": "2026-11-08T16:24:31Z",
    "items": [
      {
        "id": "art-1009-1",
        "generationId": "G-8807",
        "name": "Koenigsegg Agera RS Thunderstorm",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 40.0,
        "lineTotal": 40.0,
        "image": "/template photo/29.webp"
      },
      {
        "id": "art-1009-2",
        "generationId": "G-8852",
        "name": "Neon Night",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 32.0,
        "lineTotal": 64.0,
        "image": "/template photo/4.webp"
      }
    ],
    "subtotal": 104.0,
    "shippingFee": 0.0,
    "total": 104.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QgmZmNXSbn1afvJTeiDW",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QgmZmNXSbn1afvJTeiDW"
    },
    "shipping": {
      "name": "Isabella Rossi",
      "line1": "111 South Wacker Drive",
      "line2": "28th Floor",
      "city": "Chicago",
      "state": "IL",
      "zip": "60606",
      "country": "United States"
    },
    "notes": [
      "Standard museum tube packaging."
    ]
  },
  {
    "id": "#1010",
    "cleanId": "1010",
    "customerEmail": "s.roy@mail.com",
    "createdAt": "2026-11-11T18:00:16Z",
    "items": [
      {
        "id": "art-1010-1",
        "generationId": "G-8822",
        "name": "Koenigsegg Agera RS Thunderstorm + Toyota Supra MK5 Sunburst",
        "type": "Combined",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 34.0,
        "lineTotal": 34.0,
        "image": "/template photo/29.webp"
      },
      {
        "id": "art-1010-2",
        "generationId": "G-8860",
        "name": "Toyota Supra Crimson Red Adrenaline",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 22.0,
        "lineTotal": 22.0,
        "image": "/template photo/15.webp"
      }
    ],
    "subtotal": 56.0,
    "shippingFee": 0.0,
    "total": 56.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QSyVPjQu9T7dyUPqZWZX",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QSyVPjQu9T7dyUPqZWZX"
    },
    "shipping": {
      "name": "Sarah Roy",
      "line1": "1045 Ocean Avenue",
      "line2": "Suite 300",
      "city": "Santa Monica",
      "state": "CA",
      "zip": "90401",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1011",
    "cleanId": "1011",
    "customerEmail": "c.martin@mail.com",
    "createdAt": "2026-11-13T15:50:51Z",
    "items": [
      {
        "id": "art-1011-1",
        "generationId": "G-8866",
        "name": "Ferrari F40 Atrium Spec",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 44.0,
        "lineTotal": 44.0,
        "image": "/template photo/11.webp"
      }
    ],
    "subtotal": 44.0,
    "shippingFee": 7.95,
    "total": 51.95,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QEgwn1IscPhnss6Dwq9s",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QEgwn1IscPhnss6Dwq9s"
    },
    "shipping": {
      "name": "Christian Martin",
      "line1": "1600 Pike Place",
      "line2": "Suite 800",
      "city": "Seattle",
      "state": "WA",
      "zip": "98101",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1012",
    "cleanId": "1012",
    "customerEmail": "l.vance@mail.com",
    "createdAt": "2026-11-14T12:00:46Z",
    "items": [
      {
        "id": "art-1012-1",
        "generationId": "G-8827",
        "name": "Toyota Supra Crimson Red Adrenaline",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 2,
        "unitPrice": 22.0,
        "lineTotal": 44.0,
        "image": "/template photo/15.webp"
      },
      {
        "id": "art-1012-2",
        "generationId": "G-8841",
        "name": "Porsche 992 GT3 RS Modern Minimalist",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 36.0,
        "lineTotal": 36.0,
        "image": "/template photo/7.webp"
      },
      {
        "id": "art-1012-3",
        "generationId": "G-8869",
        "name": "Ferrari 812 GTS Golden Hour + BMW M4 CSL One Life Just One",
        "type": "Combined",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 46.0,
        "lineTotal": 46.0,
        "image": "/template photo/26.webp"
      }
    ],
    "subtotal": 126.0,
    "shippingFee": 0.0,
    "total": 126.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QIRxB94SCO9BGzHdK0Ll",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QIRxB94SCO9BGzHdK0Ll"
    },
    "shipping": {
      "name": "Liam Vance",
      "line1": "1100 Congress Avenue",
      "line2": "Suite 400",
      "city": "Austin",
      "state": "TX",
      "zip": "78701",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1013",
    "cleanId": "1013",
    "customerEmail": "m.das@mail.com",
    "createdAt": "2026-11-15T15:00:00Z",
    "items": [
      {
        "id": "art-1013-1",
        "generationId": "G-8862",
        "name": "Porsche 911 British Racing Green + McLaren 720S Red Street Graffiti",
        "type": "Combined",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 46.0,
        "lineTotal": 92.0,
        "image": "/template photo/2.webp"
      },
      {
        "id": "art-1013-2",
        "generationId": "G-8879",
        "name": "Porsche 911 British Racing Green",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 2,
        "unitPrice": 29.0,
        "lineTotal": 58.0,
        "image": "/template photo/2.webp"
      }
    ],
    "subtotal": 150.0,
    "shippingFee": 0.0,
    "total": 150.0,
    "payment": {
      "status": "Refunded",
      "stripeRef": "pi_3Qopb2ugDveTJL6RpW9OC",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Qopb2ugDveTJL6RpW9OC"
    },
    "shipping": {
      "name": "Marcus Das",
      "line1": "880 North Michigan Avenue",
      "line2": "Unit 19B",
      "city": "Chicago",
      "state": "IL",
      "zip": "60611",
      "country": "United States"
    },
    "notes": [
      "Customer ordered the wrong size and requested a refund to reorder."
    ]
  },
  {
    "id": "#1014",
    "cleanId": "1014",
    "customerEmail": "l.vance@mail.com",
    "createdAt": "2026-11-15T22:11:29Z",
    "items": [
      {
        "id": "art-1014-1",
        "generationId": "G-8882",
        "name": "Nissan 240SX Rain Garage Spec",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 36.0,
        "lineTotal": 36.0,
        "image": "/template photo/20.webp"
      }
    ],
    "subtotal": 36.0,
    "shippingFee": 7.95,
    "total": 43.95,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QHZZ8XSsyxKHKawaf0E4",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QHZZ8XSsyxKHKawaf0E4"
    },
    "shipping": {
      "name": "Liam Vance",
      "line1": "1100 Congress Avenue",
      "line2": "Suite 400",
      "city": "Austin",
      "state": "TX",
      "zip": "78701",
      "country": "United States"
    },
    "notes": [
      "Reinforced corner protectors added."
    ]
  },
  {
    "id": "#1015",
    "cleanId": "1015",
    "customerEmail": "t.ross@mail.com",
    "createdAt": "2026-11-16T07:39:02Z",
    "items": [
      {
        "id": "art-1015-1",
        "generationId": "G-8881",
        "name": "Retro Racer",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 28.0,
        "lineTotal": 28.0,
        "image": "/template photo/1.webp"
      }
    ],
    "subtotal": 28.0,
    "shippingFee": 7.95,
    "total": 35.95,
    "payment": {
      "status": "Cancelled",
      "stripeRef": "pi_3QGPgLUNIbRDRe4xp1BtP",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QGPgLUNIbRDRe4xp1BtP"
    },
    "shipping": {
      "name": "Tara Ross",
      "line1": "350 South Miami Avenue",
      "line2": "Tower 2",
      "city": "Miami",
      "state": "FL",
      "zip": "33130",
      "country": "United States"
    },
    "notes": [
      "Customer changed their mind before production."
    ]
  },
  {
    "id": "#1016",
    "cleanId": "1016",
    "customerEmail": "o.brooks@mail.com",
    "createdAt": "2026-11-16T08:05:19Z",
    "items": [
      {
        "id": "art-1016-1",
        "generationId": "G-8878",
        "name": "Porsche GT3 RS 2022 Matte Obsidian",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 45.0,
        "lineTotal": 90.0,
        "image": "/template photo/19.webp"
      },
      {
        "id": "art-1016-2",
        "generationId": "G-8880",
        "name": "Mazda RX-7 Veilside Tokyo Drift",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 38.0,
        "lineTotal": 38.0,
        "image": "/template photo/13.webp"
      }
    ],
    "subtotal": 128.0,
    "shippingFee": 0.0,
    "total": 128.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3Qr6BYRiMIO2uy0pZ2ufn",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Qr6BYRiMIO2uy0pZ2ufn"
    },
    "shipping": {
      "name": "Olivia Brooks",
      "line1": "1420 17th Street",
      "line2": "Suite 500",
      "city": "Denver",
      "state": "CO",
      "zip": "80202",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1017",
    "cleanId": "1017",
    "customerEmail": "n.coleman@mail.com",
    "createdAt": "2026-11-16T11:24:46Z",
    "items": [
      {
        "id": "art-1017-1",
        "generationId": "G-8830",
        "name": "Pagani Zonda Obsidian Noir",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 30.0,
        "lineTotal": 30.0,
        "image": "/template photo/6.webp"
      },
      {
        "id": "art-1017-2",
        "generationId": "G-8883",
        "name": "Porsche GT3 RS Neon Pink Halo",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 36.0,
        "lineTotal": 36.0,
        "image": "/template photo/9.webp"
      }
    ],
    "subtotal": 66.0,
    "shippingFee": 0.0,
    "total": 66.0,
    "payment": {
      "status": "Refunded",
      "stripeRef": "pi_3QeINSj9ZZI32DPoFnOqt",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QeINSj9ZZI32DPoFnOqt"
    },
    "shipping": {
      "name": "Natalie Coleman",
      "line1": "450 Lexington Avenue",
      "line2": "14th Floor",
      "city": "New York",
      "state": "NY",
      "zip": "10017",
      "country": "United States"
    },
    "notes": [
      "Customer ordered the wrong size and requested a refund to reorder."
    ]
  },
  {
    "id": "#1018",
    "cleanId": "1018",
    "customerEmail": "e.drake@mail.com",
    "createdAt": "2026-11-17T15:43:38Z",
    "items": [
      {
        "id": "art-1018-1",
        "generationId": "G-8817",
        "name": "Porsche 992 GT3 RS Modern Minimalist + Ferrari F40 Atrium Spec",
        "type": "Combined",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 46.0,
        "lineTotal": 46.0,
        "image": "/template photo/7.webp"
      },
      {
        "id": "art-1018-2",
        "generationId": "G-8818",
        "name": "Shelby GT350 Heritage Racing Stripe",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 36.0,
        "lineTotal": 72.0,
        "image": "/template photo/5.webp"
      },
      {
        "id": "art-1018-3",
        "generationId": "G-8884",
        "name": "Toyota Supra MK5 Sunburst",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 28.0,
        "lineTotal": 28.0,
        "image": "/template photo/14.webp"
      }
    ],
    "subtotal": 146.0,
    "shippingFee": 0.0,
    "total": 146.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QGiNMK4ozdV6SgiIhsP3",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QGiNMK4ozdV6SgiIhsP3"
    },
    "shipping": {
      "name": "Ethan Drake",
      "line1": "210 Newbury Street",
      "line2": "3rd Floor",
      "city": "Boston",
      "state": "MA",
      "zip": "02116",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1019",
    "cleanId": "1019",
    "customerEmail": "j.hayes@mail.com",
    "createdAt": "2026-11-17T22:00:00Z",
    "items": [
      {
        "id": "art-1019-1",
        "generationId": "G-8802",
        "name": "McLaren 720S Speed Graphic",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 1,
        "unitPrice": 35.0,
        "lineTotal": 35.0,
        "image": "/template photo/28.webp"
      },
      {
        "id": "art-1019-2",
        "generationId": "G-8803",
        "name": "Ferrari F40 Atrium Spec + Mercedes-AMG CLE 53 Triple Panel",
        "type": "Combined",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 46.0,
        "lineTotal": 92.0,
        "image": "/template photo/11.webp"
      },
      {
        "id": "art-1019-3",
        "generationId": "G-8834",
        "name": "Nissan Skyline GTR R33 1000HP",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 24.0,
        "lineTotal": 24.0,
        "image": "/template photo/21.webp"
      }
    ],
    "subtotal": 151.0,
    "shippingFee": 0.0,
    "total": 151.0,
    "payment": {
      "status": "Pending",
      "stripeRef": "pi_3Q7Vw0GhmyLwSexZ15J5P",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Q7Vw0GhmyLwSexZ15J5P"
    },
    "shipping": {
      "name": "Jordan Hayes",
      "line1": "1120 NW Couch Street",
      "line2": "Suite 600",
      "city": "Portland",
      "state": "OR",
      "zip": "97209",
      "country": "United States"
    },
    "notes": [
      "Awaiting bank authorization."
    ]
  },
  {
    "id": "#1020",
    "cleanId": "1020",
    "customerEmail": "d.ward@mail.com",
    "createdAt": "2026-11-18T05:43:56Z",
    "items": [
      {
        "id": "art-1020-1",
        "generationId": "G-8808",
        "name": "Toyota Supra Crimson Red Adrenaline",
        "type": "Individual",
        "size": "18 x 24 in",
        "qty": 2,
        "unitPrice": 32.0,
        "lineTotal": 64.0,
        "image": "/template photo/15.webp"
      },
      {
        "id": "art-1020-2",
        "generationId": "G-8885",
        "name": "Shelby GT350 Heritage Racing Stripe",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 26.0,
        "lineTotal": 26.0,
        "image": "/template photo/5.webp"
      }
    ],
    "subtotal": 90.0,
    "shippingFee": 0.0,
    "total": 90.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3QKnbKpdGHTzNeE38ZqKb",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QKnbKpdGHTzNeE38ZqKb"
    },
    "shipping": {
      "name": "Dylan Ward",
      "line1": "3799 Las Vegas Boulevard South",
      "line2": null,
      "city": "Las Vegas",
      "state": "NV",
      "zip": "89109",
      "country": "United States"
    },
    "notes": []
  },
  {
    "id": "#1021",
    "cleanId": "1021",
    "customerEmail": "h.davis@mail.com",
    "createdAt": "2026-11-18T13:00:00Z",
    "items": [
      {
        "id": "art-1021-1",
        "generationId": "G-8836",
        "name": "Aventador SVJ Crimson Storm",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 28.0,
        "lineTotal": 28.0,
        "image": "/template photo/8.webp"
      }
    ],
    "subtotal": 28.0,
    "shippingFee": 7.95,
    "total": 35.95,
    "payment": {
      "status": "Pending",
      "stripeRef": "pi_3QbVzq9VINy2Yiqq2MI8P",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3QbVzq9VINy2Yiqq2MI8P"
    },
    "shipping": {
      "name": "Harper Davis",
      "line1": "1700 California Street",
      "line2": "Suite 450",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94109",
      "country": "United States"
    },
    "notes": [
      "Awaiting bank authorization."
    ]
  },
  {
    "id": "#1022",
    "cleanId": "1022",
    "customerEmail": "a.khan@mail.com",
    "createdAt": "2026-11-18T17:30:00Z",
    "items": [
      {
        "id": "art-1022-1",
        "generationId": "G-8850",
        "name": "Porsche GT3 RS 2022 Matte Obsidian",
        "type": "Individual",
        "size": "12 x 18 in",
        "qty": 1,
        "unitPrice": 35.0,
        "lineTotal": 35.0,
        "image": "/template photo/19.webp"
      },
      {
        "id": "art-1022-2",
        "generationId": "G-8891",
        "name": "Mazda RX-7 Veilside Tokyo Drift + Mercedes-AMG CLE 53 Triple Panel",
        "type": "Combined",
        "size": "12 x 18 in",
        "qty": 2,
        "unitPrice": 34.0,
        "lineTotal": 68.0,
        "image": "/template photo/13.webp"
      }
    ],
    "subtotal": 103.0,
    "shippingFee": 0.0,
    "total": 103.0,
    "payment": {
      "status": "Paid",
      "stripeRef": "pi_3Q6ys6VAzgsOfxyplecCi",
      "stripeUrl": "https://dashboard.stripe.com/payments/pi_3Q6ys6VAzgsOfxyplecCi"
    },
    "shipping": {
      "name": "Ayaan Khan",
      "line1": "88 Newark Avenue",
      "line2": "Apt 5C",
      "city": "Jersey City",
      "state": "NJ",
      "zip": "07302",
      "country": "United States"
    },
    "notes": [
      "Customer asked for a signature on delivery."
    ]
  }
]

// PRODUCTION: fulfilment progress for each order (stage, files, carrier, history). Linked by orderId.
export const PRODUCTION_ORDERS: ProductionOrder[] = [
  {
    "orderId": "#1001",
    "cleanId": "1001",
    "customerEmail": "e.drake@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1001-1",
        "title": "Nissan Skyline GTR R33 1000HP",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 2,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/21.webp",
        "colorFallback": "#0a2e1d"
      },
      {
        "id": "art-1001-2",
        "title": "Toyota Supra MK5 Sunburst",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/14.webp",
        "colorFallback": "#2a1033"
      }
    ],
    "carrier": "FedEx Ground",
    "trackingNumber": "544697267398",
    "history": [
      {
        "id": "h-1001-1",
        "time": "2026-09-14T00:27:29Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1001-2",
        "time": "2026-09-14T03:19:58Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1001-3",
        "time": "2026-09-14T08:47:33Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1001-4",
        "time": "2026-09-14T19:21:00Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1001-5",
        "time": "2026-09-15T19:04:26Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1001-6",
        "time": "2026-09-16T05:08:04Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Ground · 544697267398"
      },
      {
        "id": "h-1001-7",
        "time": "2026-09-18T18:00:11Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1001-8",
        "time": "2026-09-18T23:02:17Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1002",
    "cleanId": "1002",
    "customerEmail": "e.drake@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1002-1",
        "title": "BMW M4 CSL One Life Just One",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/24.webp",
        "colorFallback": "#1a2436"
      },
      {
        "id": "art-1002-2",
        "title": "Neon Night",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/4.webp",
        "colorFallback": "#3a200d"
      }
    ],
    "carrier": "UPS 2nd Day Air",
    "trackingNumber": "1ZMQ72B669O8J2RCGQ",
    "history": [
      {
        "id": "h-1002-1",
        "time": "2026-10-04T01:50:59Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1002-2",
        "time": "2026-10-04T04:17:55Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1002-3",
        "time": "2026-10-04T09:48:25Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1002-4",
        "time": "2026-10-04T20:41:27Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1002-5",
        "time": "2026-10-05T15:47:48Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1002-6",
        "time": "2026-10-05T22:43:48Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "UPS 2nd Day Air · 1ZMQ72B669O8J2RCGQ"
      },
      {
        "id": "h-1002-7",
        "time": "2026-10-08T08:50:45Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1002-8",
        "time": "2026-10-08T16:14:19Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1003",
    "cleanId": "1003",
    "customerEmail": "a.morales@mail.com",
    "stage": "Shipped",
    "flag": null,
    "files": [
      {
        "id": "art-1003-1",
        "title": "Retro Racer",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/1.webp",
        "colorFallback": "#0f2d4a"
      }
    ],
    "carrier": "FedEx Ground",
    "trackingNumber": "233322216011",
    "history": [
      {
        "id": "h-1003-1",
        "time": "2026-10-09T04:36:46Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1003-2",
        "time": "2026-10-09T05:42:34Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1003-3",
        "time": "2026-10-09T10:34:38Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1003-4",
        "time": "2026-10-10T03:38:45Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1003-5",
        "time": "2026-10-10T17:18:38Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1003-6",
        "time": "2026-10-10T22:11:01Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Ground · 233322216011"
      }
    ]
  },
  {
    "orderId": "#1004",
    "cleanId": "1004",
    "customerEmail": "a.khan@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1004-1",
        "title": "Shelby GT350 Heritage Racing Stripe",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/5.webp",
        "colorFallback": "#121b2b"
      },
      {
        "id": "art-1004-2",
        "title": "Nissan 240SX Rain Garage Spec + McLaren P1 GTR London Golden Hour",
        "isCombined": true,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/20.webp",
        "colorFallback": "#0f2d4a"
      }
    ],
    "carrier": "FedEx Express",
    "trackingNumber": "543788846845",
    "history": [
      {
        "id": "h-1004-1",
        "time": "2026-10-22T04:59:48Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1004-2",
        "time": "2026-10-22T06:17:51Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1004-3",
        "time": "2026-10-22T10:19:05Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1004-4",
        "time": "2026-10-23T05:54:03Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1004-5",
        "time": "2026-10-24T02:16:28Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1004-6",
        "time": "2026-10-24T12:48:36Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Express · 543788846845"
      },
      {
        "id": "h-1004-7",
        "time": "2026-10-26T22:39:07Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1004-8",
        "time": "2026-10-27T03:46:05Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1005",
    "cleanId": "1005",
    "customerEmail": "c.bennett@mail.com",
    "stage": "Out for Delivery",
    "flag": null,
    "files": [
      {
        "id": "art-1005-1",
        "title": "Toyota Supra MK4 2JZ Fast & Furious",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/17.webp",
        "colorFallback": "#0a2e1d"
      }
    ],
    "carrier": "FedEx Express",
    "trackingNumber": "432771436365",
    "history": [
      {
        "id": "h-1005-1",
        "time": "2026-11-04T21:26:00Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1005-2",
        "time": "2026-11-04T23:52:40Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1005-3",
        "time": "2026-11-05T02:22:31Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1005-4",
        "time": "2026-11-05T13:33:09Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1005-5",
        "time": "2026-11-06T08:07:30Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1005-6",
        "time": "2026-11-06T12:10:54Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Express · 432771436365"
      },
      {
        "id": "h-1005-7",
        "time": "2026-11-09T16:21:34Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1006",
    "cleanId": "1006",
    "customerEmail": "a.morales@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1006-1",
        "title": "Ferrari 812 GTS Golden Hour",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/26.webp",
        "colorFallback": "#1a2436"
      },
      {
        "id": "art-1006-2",
        "title": "Koenigsegg Agera RS Thunderstorm",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/29.webp",
        "colorFallback": "#2a1033"
      },
      {
        "id": "art-1006-3",
        "title": "Porsche GT3 RS Neon Pink Halo",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/9.webp",
        "colorFallback": "#3a200d"
      }
    ],
    "carrier": "UPS Ground",
    "trackingNumber": "1ZRHKAAFAD3JOC2YFW",
    "history": [
      {
        "id": "h-1006-1",
        "time": "2026-11-05T23:21:16Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1006-2",
        "time": "2026-11-06T01:44:18Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1006-3",
        "time": "2026-11-06T06:45:31Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1006-4",
        "time": "2026-11-06T14:23:13Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1006-5",
        "time": "2026-11-07T05:14:47Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1006-6",
        "time": "2026-11-07T17:11:14Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "UPS Ground · 1ZRHKAAFAD3JOC2YFW"
      },
      {
        "id": "h-1006-7",
        "time": "2026-11-10T00:54:48Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1006-8",
        "time": "2026-11-10T07:16:10Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1007",
    "cleanId": "1007",
    "customerEmail": "a.khan@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1007-1",
        "title": "Neon Night + Lamborghini Huracán Tecnica Sunset",
        "isCombined": true,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/4.webp",
        "colorFallback": "#3a200d"
      },
      {
        "id": "art-1007-2",
        "title": "Toyota Supra MK5 Sunburst",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/14.webp",
        "colorFallback": "#121b2b"
      }
    ],
    "carrier": "UPS 2nd Day Air",
    "trackingNumber": "1ZQ38RSLU8VNOQNEI7",
    "history": [
      {
        "id": "h-1007-1",
        "time": "2026-11-06T01:07:05Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1007-2",
        "time": "2026-11-06T03:51:07Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1007-3",
        "time": "2026-11-06T09:40:59Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1007-4",
        "time": "2026-11-07T02:14:52Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1007-5",
        "time": "2026-11-07T22:00:06Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1007-6",
        "time": "2026-11-08T02:17:46Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "UPS 2nd Day Air · 1ZQ38RSLU8VNOQNEI7"
      },
      {
        "id": "h-1007-7",
        "time": "2026-11-10T21:01:55Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1007-8",
        "time": "2026-11-11T06:07:16Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1008",
    "cleanId": "1008",
    "customerEmail": "a.khan@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1008-1",
        "title": "Porsche 911 British Racing Green",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/2.webp",
        "colorFallback": "#0f2d4a"
      },
      {
        "id": "art-1008-2",
        "title": "Nissan 240SX Rain Garage Spec",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 2,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/20.webp",
        "colorFallback": "#102a2a"
      }
    ],
    "carrier": "UPS 2nd Day Air",
    "trackingNumber": "1ZY6OXAV9KXA36BPGC",
    "history": [
      {
        "id": "h-1008-1",
        "time": "2026-11-07T09:17:18Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1008-2",
        "time": "2026-11-07T12:16:02Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1008-3",
        "time": "2026-11-07T14:33:50Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1008-4",
        "time": "2026-11-08T10:06:10Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1008-5",
        "time": "2026-11-09T08:24:11Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1008-6",
        "time": "2026-11-09T18:56:01Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "UPS 2nd Day Air · 1ZY6OXAV9KXA36BPGC"
      },
      {
        "id": "h-1008-7",
        "time": "2026-11-13T02:58:10Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1008-8",
        "time": "2026-11-13T10:58:18Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1009",
    "cleanId": "1009",
    "customerEmail": "i.rossi@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1009-1",
        "title": "Koenigsegg Agera RS Thunderstorm",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/29.webp",
        "colorFallback": "#102a2a"
      },
      {
        "id": "art-1009-2",
        "title": "Neon Night",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/4.webp",
        "colorFallback": "#102a2a"
      }
    ],
    "carrier": "FedEx Express",
    "trackingNumber": "542934416489",
    "history": [
      {
        "id": "h-1009-1",
        "time": "2026-11-08T16:24:31Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1009-2",
        "time": "2026-11-08T18:17:56Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1009-3",
        "time": "2026-11-08T22:55:48Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1009-4",
        "time": "2026-11-09T14:30:07Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1009-5",
        "time": "2026-11-10T11:26:22Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1009-6",
        "time": "2026-11-10T18:51:48Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Express · 542934416489"
      },
      {
        "id": "h-1009-7",
        "time": "2026-11-13T21:56:42Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1009-8",
        "time": "2026-11-14T03:15:41Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1010",
    "cleanId": "1010",
    "customerEmail": "s.roy@mail.com",
    "stage": "Delivered",
    "flag": null,
    "files": [
      {
        "id": "art-1010-1",
        "title": "Koenigsegg Agera RS Thunderstorm + Toyota Supra MK5 Sunburst",
        "isCombined": true,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/29.webp",
        "colorFallback": "#2d1810"
      },
      {
        "id": "art-1010-2",
        "title": "Toyota Supra Crimson Red Adrenaline",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/15.webp",
        "colorFallback": "#102a2a"
      }
    ],
    "carrier": "FedEx Ground",
    "trackingNumber": "569217594223",
    "history": [
      {
        "id": "h-1010-1",
        "time": "2026-11-11T18:00:16Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1010-2",
        "time": "2026-11-11T20:02:18Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1010-3",
        "time": "2026-11-11T22:05:37Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1010-4",
        "time": "2026-11-12T09:55:57Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1010-5",
        "time": "2026-11-13T07:45:48Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1010-6",
        "time": "2026-11-13T13:05:01Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Ground · 569217594223"
      },
      {
        "id": "h-1010-7",
        "time": "2026-11-15T21:58:32Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      },
      {
        "id": "h-1010-8",
        "time": "2026-11-16T05:05:10Z",
        "label": "Delivered",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1011",
    "cleanId": "1011",
    "customerEmail": "c.martin@mail.com",
    "stage": "Shipped",
    "flag": null,
    "files": [
      {
        "id": "art-1011-1",
        "title": "Ferrari F40 Atrium Spec",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/11.webp",
        "colorFallback": "#102a2a"
      }
    ],
    "carrier": "USPS Priority Mail",
    "trackingNumber": "9400323681725364243234",
    "history": [
      {
        "id": "h-1011-1",
        "time": "2026-11-13T15:50:51Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1011-2",
        "time": "2026-11-13T17:39:16Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1011-3",
        "time": "2026-11-13T21:37:00Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1011-4",
        "time": "2026-11-14T13:51:57Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1011-5",
        "time": "2026-11-15T06:26:01Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1011-6",
        "time": "2026-11-15T17:58:45Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "USPS Priority Mail · 9400323681725364243234"
      }
    ]
  },
  {
    "orderId": "#1012",
    "cleanId": "1012",
    "customerEmail": "l.vance@mail.com",
    "stage": "Out for Delivery",
    "flag": null,
    "files": [
      {
        "id": "art-1012-1",
        "title": "Toyota Supra Crimson Red Adrenaline",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 2,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/15.webp",
        "colorFallback": "#102a2a"
      },
      {
        "id": "art-1012-2",
        "title": "Porsche 992 GT3 RS Modern Minimalist",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/7.webp",
        "colorFallback": "#0a2e1d"
      },
      {
        "id": "art-1012-3",
        "title": "Ferrari 812 GTS Golden Hour + BMW M4 CSL One Life Just One",
        "isCombined": true,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/26.webp",
        "colorFallback": "#0f2d4a"
      }
    ],
    "carrier": "USPS Priority Mail",
    "trackingNumber": "9400601594540204650778",
    "history": [
      {
        "id": "h-1012-1",
        "time": "2026-11-14T12:00:46Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1012-2",
        "time": "2026-11-14T13:53:54Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1012-3",
        "time": "2026-11-14T16:50:30Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1012-4",
        "time": "2026-11-14T23:11:25Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1012-5",
        "time": "2026-11-15T17:14:38Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1012-6",
        "time": "2026-11-16T03:21:03Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "USPS Priority Mail · 9400601594540204650778"
      },
      {
        "id": "h-1012-7",
        "time": "2026-11-18T16:09:32Z",
        "label": "Out for Delivery",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1013",
    "cleanId": "1013",
    "customerEmail": "m.das@mail.com",
    "stage": "Order Confirmed",
    "flag": null,
    "files": [
      {
        "id": "art-1013-1",
        "title": "Porsche 911 British Racing Green + McLaren 720S Red Street Graffiti",
        "isCombined": true,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/2.webp",
        "colorFallback": "#102a2a"
      },
      {
        "id": "art-1013-2",
        "title": "Porsche 911 British Racing Green",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 2,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/2.webp",
        "colorFallback": "#2a1033"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1013-1",
        "time": "2026-11-15T15:00:00Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1013-2",
        "time": "2026-11-15T16:02:35Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1013-3",
        "time": "2026-11-15T17:02:35Z",
        "label": "Customer requested cancellation",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1013-4",
        "time": "2026-11-15T17:32:35Z",
        "label": "Refund issued via Stripe",
        "author": "Riya",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1014",
    "cleanId": "1014",
    "customerEmail": "l.vance@mail.com",
    "stage": "Quality Check & Packing",
    "flag": null,
    "files": [
      {
        "id": "art-1014-1",
        "title": "Nissan 240SX Rain Garage Spec",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/20.webp",
        "colorFallback": "#102a2a"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1014-1",
        "time": "2026-11-15T22:11:29Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1014-2",
        "time": "2026-11-15T23:17:03Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1014-3",
        "time": "2026-11-16T05:12:54Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1014-4",
        "time": "2026-11-16T15:08:02Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1014-5",
        "time": "2026-11-17T09:51:07Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1015",
    "cleanId": "1015",
    "customerEmail": "t.ross@mail.com",
    "stage": "Order Received",
    "flag": null,
    "files": [
      {
        "id": "art-1015-1",
        "title": "Retro Racer",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/1.webp",
        "colorFallback": "#1a2436"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1015-1",
        "time": "2026-11-16T07:39:02Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1015-2",
        "time": "2026-11-16T08:57:02Z",
        "label": "Order cancelled by customer",
        "author": "system",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1016",
    "cleanId": "1016",
    "customerEmail": "o.brooks@mail.com",
    "stage": "Shipped",
    "flag": null,
    "files": [
      {
        "id": "art-1016-1",
        "title": "Porsche GT3 RS 2022 Matte Obsidian",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/19.webp",
        "colorFallback": "#102a2a"
      },
      {
        "id": "art-1016-2",
        "title": "Mazda RX-7 Veilside Tokyo Drift",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/13.webp",
        "colorFallback": "#3a200d"
      }
    ],
    "carrier": "FedEx Ground",
    "trackingNumber": "698499841099",
    "history": [
      {
        "id": "h-1016-1",
        "time": "2026-11-16T08:05:19Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1016-2",
        "time": "2026-11-16T10:43:15Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1016-3",
        "time": "2026-11-16T16:15:42Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1016-4",
        "time": "2026-11-17T03:49:26Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1016-5",
        "time": "2026-11-17T15:16:39Z",
        "label": "Quality Check & Packing",
        "author": "Amit",
        "emailSent": true
      },
      {
        "id": "h-1016-6",
        "time": "2026-11-17T20:19:29Z",
        "label": "Shipped",
        "author": "Amit",
        "emailSent": true,
        "note": "FedEx Ground · 698499841099"
      }
    ]
  },
  {
    "orderId": "#1017",
    "cleanId": "1017",
    "customerEmail": "n.coleman@mail.com",
    "stage": "Order Confirmed",
    "flag": null,
    "files": [
      {
        "id": "art-1017-1",
        "title": "Pagani Zonda Obsidian Noir",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/6.webp",
        "colorFallback": "#0a2e1d"
      },
      {
        "id": "art-1017-2",
        "title": "Porsche GT3 RS Neon Pink Halo",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/9.webp",
        "colorFallback": "#102a2a"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1017-1",
        "time": "2026-11-16T11:24:46Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1017-2",
        "time": "2026-11-16T13:32:46Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1017-3",
        "time": "2026-11-16T14:32:46Z",
        "label": "Customer requested cancellation",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1017-4",
        "time": "2026-11-16T15:02:46Z",
        "label": "Refund issued via Stripe",
        "author": "Riya",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1018",
    "cleanId": "1018",
    "customerEmail": "e.drake@mail.com",
    "stage": "Printing",
    "flag": "File replaced",
    "files": [
      {
        "id": "art-1018-1",
        "title": "Porsche 992 GT3 RS Modern Minimalist + Ferrari F40 Atrium Spec",
        "isCombined": true,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/7.webp",
        "colorFallback": "#2a1033"
      },
      {
        "id": "art-1018-2",
        "title": "Shelby GT350 Heritage Racing Stripe",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Replaced by Riya · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": "Riya",
        "image": "/template photo/5.webp",
        "colorFallback": "#121b2b"
      },
      {
        "id": "art-1018-3",
        "title": "Toyota Supra MK5 Sunburst",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/14.webp",
        "colorFallback": "#0a2e1d"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1018-1",
        "time": "2026-11-17T15:43:38Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1018-2",
        "time": "2026-11-17T18:22:37Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1018-3",
        "time": "2026-11-17T21:57:03Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1018-4",
        "time": "2026-11-17T23:35:03Z",
        "label": "Replacement file uploaded (High-res 300 DPI)",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1018-5",
        "time": "2026-11-18T11:34:11Z",
        "label": "Printing",
        "author": "Amit",
        "emailSent": true
      }
    ]
  },
  {
    "orderId": "#1019",
    "cleanId": "1019",
    "customerEmail": "j.hayes@mail.com",
    "stage": "Order Received",
    "flag": null,
    "files": [
      {
        "id": "art-1019-1",
        "title": "McLaren 720S Speed Graphic",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 1,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/28.webp",
        "colorFallback": "#2d1810"
      },
      {
        "id": "art-1019-2",
        "title": "Ferrari F40 Atrium Spec + Mercedes-AMG CLE 53 Triple Panel",
        "isCombined": true,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/11.webp",
        "colorFallback": "#0a2e1d"
      },
      {
        "id": "art-1019-3",
        "title": "Nissan Skyline GTR R33 1000HP",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/21.webp",
        "colorFallback": "#121b2b"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1019-1",
        "time": "2026-11-17T22:00:00Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1019-2",
        "time": "2026-11-17T22:02:00Z",
        "label": "Awaiting bank authorization",
        "author": "system",
        "emailSent": false
      }
    ]
  },
  {
    "orderId": "#1020",
    "cleanId": "1020",
    "customerEmail": "d.ward@mail.com",
    "stage": "Preparing Artwork",
    "flag": "File replaced",
    "files": [
      {
        "id": "art-1020-1",
        "title": "Toyota Supra Crimson Red Adrenaline",
        "isCombined": false,
        "size": "18 x 24 in",
        "qty": 2,
        "fileStatus": "Original · 5400 x 7200 px",
        "dimensions": "5400 x 7200 px",
        "replacedBy": null,
        "image": "/template photo/15.webp",
        "colorFallback": "#102a2a"
      },
      {
        "id": "art-1020-2",
        "title": "Shelby GT350 Heritage Racing Stripe",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Replaced by Riya · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": "Riya",
        "image": "/template photo/5.webp",
        "colorFallback": "#0a2e1d"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1020-1",
        "time": "2026-11-18T05:43:56Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1020-2",
        "time": "2026-11-18T08:08:37Z",
        "label": "Order Confirmed",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1020-3",
        "time": "2026-11-18T12:36:19Z",
        "label": "Preparing Artwork",
        "author": "Riya",
        "emailSent": false
      },
      {
        "id": "h-1020-4",
        "time": "2026-11-18T13:06:19Z",
        "label": "Replacement file uploaded (High-res 300 DPI)",
        "author": "Riya",
        "emailSent": false
      }
    ]
  },
  {
    "orderId": "#1021",
    "cleanId": "1021",
    "customerEmail": "h.davis@mail.com",
    "stage": "Order Received",
    "flag": null,
    "files": [
      {
        "id": "art-1021-1",
        "title": "Aventador SVJ Crimson Storm",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/8.webp",
        "colorFallback": "#121b2b"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1021-1",
        "time": "2026-11-18T13:00:00Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      },
      {
        "id": "h-1021-2",
        "time": "2026-11-18T13:02:00Z",
        "label": "Awaiting bank authorization",
        "author": "system",
        "emailSent": false
      }
    ]
  },
  {
    "orderId": "#1022",
    "cleanId": "1022",
    "customerEmail": "a.khan@mail.com",
    "stage": "Order Received",
    "flag": null,
    "files": [
      {
        "id": "art-1022-1",
        "title": "Porsche GT3 RS 2022 Matte Obsidian",
        "isCombined": false,
        "size": "12 x 18 in",
        "qty": 1,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/19.webp",
        "colorFallback": "#2d1810"
      },
      {
        "id": "art-1022-2",
        "title": "Mazda RX-7 Veilside Tokyo Drift + Mercedes-AMG CLE 53 Triple Panel",
        "isCombined": true,
        "size": "12 x 18 in",
        "qty": 2,
        "fileStatus": "Original · 3600 x 5400 px",
        "dimensions": "3600 x 5400 px",
        "replacedBy": null,
        "image": "/template photo/13.webp",
        "colorFallback": "#2d1810"
      }
    ],
    "carrier": null,
    "trackingNumber": null,
    "history": [
      {
        "id": "h-1022-1",
        "time": "2026-11-18T17:30:00Z",
        "label": "Order Received",
        "author": "system",
        "emailSent": false
      }
    ]
  }
]

// ============================== HELPERS ==============================

const norm = (s: string) => s.trim().toLowerCase()
const cleanOrderId = (s: string) => s.replace("#", "").trim()

// ---- US formatting ----
export const formatMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: DISPLAY_TIME_ZONE }).format(new Date(iso))

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: DISPLAY_TIME_ZONE }).format(new Date(iso))

const etDay = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: DISPLAY_TIME_ZONE }).format(new Date(iso))

export const formatAddress = (a: Address) =>
  `${a.line1}${a.line2 ? `, ${a.line2}` : ""}, ${a.city}, ${a.state} ${a.zip}`

// ---- Lookups ----
export const getCustomerByEmail = (email: string) =>
  CUSTOMERS.find((c) => norm(c.email) === norm(email))

export const getCustomerById = (idOrCleanId: string) =>
  CUSTOMERS.find((c) => c.id === idOrCleanId || c.cleanId === idOrCleanId)

export const getGenerationsByEmail = (email: string) =>
  GENERATIONS.filter((g) => norm(g.customerEmail) === norm(email))

export const getOrdersByEmail = (email: string) =>
  ORDERS.filter((o) => norm(o.customerEmail) === norm(email))

export const getGenerationById = (id: string) => {
  const q = id.replace("#", "").trim().toLowerCase()
  return GENERATIONS.find((g) => g.cleanId.toLowerCase() === q)
}

export const getOrderById = (id: string) => {
  const q = cleanOrderId(id)
  return ORDERS.find((o) => o.cleanId === q)
}

export const getProductionByOrderId = (id: string) => {
  const q = cleanOrderId(id)
  return PRODUCTION_ORDERS.find((p) => p.cleanId === q)
}

// ---- Calculated values (never stored, so they always match the data) ----
export interface CustomerSummary {
  posters: number // completed generations
  individualUsed: number
  combinedUsed: number
  failedJobs: number
  orders: number
  totalSpent: number // paid orders only
  lastOrderAt: string | null
}

export function getCustomerSummary(email: string): CustomerSummary {
  const gens = getGenerationsByEmail(email)
  const orders = getOrdersByEmail(email)
  const notFailed = gens.filter((g) => g.state !== "Failed")
  const paid = orders.filter((o) => o.payment.status === "Paid")
  return {
    posters: gens.filter((g) => g.state === "Completed").length,
    individualUsed: notFailed.filter((g) => g.type === "Individual").length,
    combinedUsed: notFailed.filter((g) => g.type === "Combined").length,
    failedJobs: gens.filter((g) => g.state === "Failed").length,
    orders: orders.length,
    totalSpent: Math.round(paid.reduce((s, o) => s + o.total, 0) * 100) / 100,
    lastOrderAt: orders.length ? orders.map((o) => o.createdAt).sort().at(-1)! : null,
  }
}

export const getOrderStage = (orderId: string) => getProductionByOrderId(orderId)?.stage

// ---- Joined views (what a backend "detail" endpoint would return) ----
export function getCustomerFull(email: string) {
  const customer = getCustomerByEmail(email)
  if (!customer) return undefined
  return {
    customer,
    summary: getCustomerSummary(email),
    generations: getGenerationsByEmail(email),
    orders: getOrdersByEmail(email).map((o) => ({ ...o, production: getProductionByOrderId(o.id) })),
  }
}

export function getOrderFull(id: string) {
  const order = getOrderById(id)
  if (!order) return undefined
  return {
    order,
    customer: getCustomerByEmail(order.customerEmail),
    production: getProductionByOrderId(order.id),
    generations: order.items.map((it) => getGenerationById(it.generationId)),
  }
}

export function getGenerationFull(id: string) {
  const job = getGenerationById(id)
  if (!job) return undefined
  const customer = getCustomerByEmail(job.customerEmail)
  return { job, customer, summary: customer ? getCustomerSummary(customer.email) : undefined }
}

// ---- Dashboard numbers ----
export function getProductionKpis() {
  return PRODUCTION_STAGES.map((s) => ({
    label: s.shortLabel,
    stageKey: s.key,
    count: PRODUCTION_ORDERS.filter((p) => p.stage === s.key).length,
  }))
}

export function getAiStats() {
  const today = etDay(DATA_AS_OF)
  const isToday = (iso: string) => etDay(iso) === today
  return {
    totalGenerations: GENERATIONS.length,
    queued: GENERATIONS.filter((g) => g.state === "Queued").length,
    processing: GENERATIONS.filter((g) => g.state === "Processing").length,
    completedToday: GENERATIONS.filter((g) => g.state === "Completed" && isToday(g.createdAt)).length,
    failedToday: GENERATIONS.filter((g) => g.state === "Failed" && isToday(g.createdAt)).length,
  }
}
