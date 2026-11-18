export interface StaffAction {
  id: string
  date: string
  text: string
}

export type StaffRole = "Full administrator" | "Order staff" | "Production staff"

export interface StaffMember {
  id: string
  cleanId: string
  name: string
  email: string
  phone?: string
  role: string
  status: "Active" | "Deactivated"
  permissionsSummary: string
  lastSignIn: string
  actions: StaffAction[]
}

export interface PermissionRow {
  page: string
  fullAdmin: "Yes" | "No" | "View only"
  orderStaff: "Yes" | "No" | "View only"
  productionStaff: "Yes" | "No" | "View only"
}

export const PERMISSIONS_MATRIX: PermissionRow[] = [
  { page: "Dashboard", fullAdmin: "Yes", orderStaff: "Yes", productionStaff: "Yes" },
  { page: "Customers", fullAdmin: "Yes", orderStaff: "View only", productionStaff: "No" },
  { page: "Templates", fullAdmin: "Yes", orderStaff: "No", productionStaff: "No" },
  { page: "AI generations", fullAdmin: "Yes", orderStaff: "No", productionStaff: "No" },
  { page: "Orders", fullAdmin: "Yes", orderStaff: "Yes", productionStaff: "View only" },
  { page: "Production", fullAdmin: "Yes", orderStaff: "No", productionStaff: "Yes" },
  { page: "Reports", fullAdmin: "Yes", orderStaff: "No", productionStaff: "No" },
  { page: "Staff and settings", fullAdmin: "Yes", orderStaff: "No", productionStaff: "No" },
]

export const DEMO_STAFF: StaffMember[] = [
  {
    id: "staff-amit",
    cleanId: "amit-paul",
    name: "Amit Paul",
    email: "amit@company.com",
    phone: "+1 (555) 392-8140",
    role: "Production staff",
    status: "Active",
    permissionsSummary: "Fulfillment & Print Line",
    lastSignIn: "Today 09:10",
    actions: [
      { id: "act-1", date: "12 Oct", text: "Account created by Riya" },
      { id: "act-2", date: "20 Oct", text: "Role set to Production staff by Riya" },
    ],
  },
  {
    id: "staff-alex",
    cleanId: "alexander-drake",
    name: "Alexander Drake",
    email: "alex@carposters.io",
    phone: "+1 (555) 724-1189",
    role: "Full administrator",
    status: "Active",
    permissionsSummary: "Full Studio Access",
    lastSignIn: "Today 09:10",
    actions: [
      { id: "act-alex-1", date: "01 Sep", text: "Account created as Full administrator" },
      { id: "act-alex-2", date: "15 Oct", text: "Two-factor authentication enabled" },
    ],
  },
  {
    id: "staff-elena",
    cleanId: "elena-santos",
    name: "Elena Santos",
    email: "elena@carposters.io",
    phone: "+1 (555) 891-3042",
    role: "Order staff",
    status: "Active",
    permissionsSummary: "Templates & Typography",
    lastSignIn: "Today 08:30",
    actions: [
      { id: "act-elena-1", date: "10 Sep", text: "Account created by Alexander" },
      { id: "act-elena-2", date: "24 Oct", text: "Role updated to Order staff" },
    ],
  },
  {
    id: "staff-kenji",
    cleanId: "kenji-sato",
    name: "Kenji Sato",
    email: "kenji@carposters.io",
    phone: "+1 (555) 438-9921",
    role: "Full administrator",
    status: "Active",
    permissionsSummary: "Neural Models & Upscaler",
    lastSignIn: "16 Nov",
    actions: [
      { id: "act-kenji-1", date: "15 Sep", text: "Account created by Alexander" },
      { id: "act-kenji-2", date: "01 Nov", text: "API key privileges granted" },
    ],
  },
  {
    id: "staff-david",
    cleanId: "david-kim",
    name: "David Kim",
    email: "david@carposters.io",
    phone: "+1 (555) 234-5678",
    role: "Production staff",
    status: "Active",
    permissionsSummary: "Fulfillment & Materials",
    lastSignIn: "02 Nov",
    actions: [
      { id: "act-david-1", date: "18 Sep", text: "Account created by Alexander" },
      { id: "act-david-2", date: "05 Oct", text: "Print facility access approved" },
    ],
  },
]

export function getDemoStaffById(idOrCleanId: string): StaffMember | undefined {
  const q = idOrCleanId.toLowerCase().trim()
  return DEMO_STAFF.find(
    (s) =>
      s.id.toLowerCase().trim() === q ||
      s.cleanId.toLowerCase().trim() === q ||
      s.email.toLowerCase().trim() === q ||
      s.name.toLowerCase().replace(/\s+/g, "-") === q
  )
}
