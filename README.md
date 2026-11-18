# POSTER GEN • Automotive Atelier Admin Portal

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.6-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://turbo.build/pack)

> **Enterprise Operations, Production Fulfillment, and AI Telemetry Management Platform for the Fine Art Automotive Poster Atelier.**

---

## 🏎️ Executive Summary

**POSTER GEN Admin** is the centralized operational headquarters for a premier automotive fine art poster platform. Combining generative AI styling workflows with physical archival print craftsmanship, the platform enables atelier directors, fulfillment technicians, and studio administrators to oversee the complete customer journey—from generative prompt execution to 300 DPI giclée printing and carrier logistics.

Crafted with a bespoke **Dark Automotive Atelier** aesthetic (`#0b0c0e` carbon background, `#121315` matte graphite cards, and `#d83138` Italian racing red accents), this administration portal delivers real-time telemetry, comprehensive inventory and customer tracking, an 8-stage physical production pipeline, and granular analytics.

---

## 📑 Table of Contents

- [🏎️ Executive Summary](#️-executive-summary)
- [✨ Core Capabilities \& Modules](#-core-capabilities--modules)
  - [1. Executive Dashboard Overview](#1-executive-dashboard-overview)
  - [2. Commerce — Orders Management](#2-commerce--orders-management)
  - [3. Commerce — Customer Directory \& CRM](#3-commerce--customer-directory--crm)
  - [4. Commerce — Templates Atelier](#4-commerce--templates-atelier)
  - [5. Operations — 8-Stage Production Pipeline](#5-operations--8-stage-production-pipeline)
  - [6. Operations — AI Generations Telemetry](#6-operations--ai-generations-telemetry)
  - [7. Management — Staff Directory \& RBAC](#7-management--staff-directory--rbac)
  - [8. Management — Reports \& Business Intelligence](#8-management--reports--business-intelligence)
  - [9. Store Settings \& System Controls](#9-store-settings--system-controls)
- [🎨 Design Language \& Atelier UI Philosophy](#-design-language--atelier-ui-philosophy)
- [🛠️ Technical Stack \& Architecture](#️-technical-stack--architecture)
- [📂 Project Directory Structure](#-project-directory-structure)
- [🚀 Quickstart \& Installation](#-quickstart--installation)
  - [Demo Credentials](#demo-credentials)
- [📦 Build \& Production Verification](#-build--production-verification)
- [🛡️ Security \& Data Integrity Guidelines](#️-security--data-integrity-guidelines)

---

## ✨ Core Capabilities & Modules

### 1. Executive Dashboard Overview (`/dashboard`)
The central nerve center providing real-time operational visibility:
- **Atelier Metric Strips**: Live counts for total orders, net gross revenue, total AI generations, and active customer base.
- **Dynamic Time Filters**: Interactive time presets (`7d`, `30d`, `6m`, `1y`) updating KPI curves dynamically.
- **Real-Time Revenue Analytics**: Interactive charts visualizing daily/monthly revenue trends versus average order values.
- **Top Templates Leaderboard**: Adoption analytics showcasing top-performing poster aesthetics (*Retro Racer*, *Neon Night*, *Clean Line*, etc.).
- **Live Orders Feed**: Direct access to recently placed transactions with instant fulfillment status tags.

### 2. Commerce — Orders Management (`/dashboard/orders`, `/dashboard/orders/[id]`)
End-to-end commercial transaction lifecycle management:
- **Universal Order Registry**: Search by order clean ID (`#1042`), customer name, or email.
- **Multi-Parameter Filtering**: Filter by payment state (*Paid*, *Pending*, *Failed*, *Refunded*) and fulfillment status.
- **One-Click Standardized CSV Export**: Export cleanly filtered transaction batches for finance and ERP reconciliation.
- **Order Detail Workspace**:
  - Detailed line items breakdown with thumbnail previews, custom text specifications, and chosen paper weights (200 GSM, 250 GSM, 300 GSM Archival).
  - Shipping address formatting, carrier information, and live tracking links.
  - Interactive status transitions (*Mark as Paid*, *Cancel Order*, *Issue Refund*).
  - Internal audit trail and staff activity notes.

### 3. Commerce — Customer Directory & CRM (`/dashboard/customers`, `/dashboard/customers/[id]`)
Deep client profile insights and activity tracking:
- **Client Ledger**: Tracks lifetime spend, total orders placed, AI prompt iterations, and account status (*Active* vs. *Disabled*).
- **Customer Detail Profile**:
  - Contact metadata, registered dates, and default delivery addresses.
  - Linked generation gallery showcasing the user's generated car art.
  - Complete order history with one-click navigation to fulfillment.
  - Account status controls with deactivation and reactivation confirmation workflows.
- **CSV Data Export**: Single-click client book export for marketing campaigns and VIP outreach.

### 4. Commerce — Templates Atelier (`/dashboard/templates`)
Curate, configure, and maintain the poster design catalog:
- **Visual Catalog Grid**: High-resolution gallery previewing template aesthetics, tags, and category taxonomies.
- **Interactive Template Modal**:
  - Add new design templates or edit existing master styles.
  - Configure supported print dimensions: `A4`, `A3`, `12x18 in`, `A2` (all calibrated to 300 DPI).
  - Paper GSM compatibility toggles (200 GSM Heavyweight, 250 GSM Satin, 300 GSM Museum Archival).
  - Custom customer typography slot rules (Header, Subtitle, Chassis/VIN stamp).
  - Publish, unpublish, and archival workflows.

### 5. Operations — 8-Stage Production Pipeline (`/dashboard/production`, `/dashboard/production/[id]`)
Archival print fulfillment and physical workshop orchestration:
- **8 Distinct Fulfillment Stages**:
  ```
  [1. Order Received] ──> [2. Order Confirmed] ──> [3. Preparing Artwork] ──> [4. Printing]
           │
           └──> [5. QC & Packing] ──> [6. Shipped] ──> [7. Out for Delivery] ──> [8. Delivered]
  ```
- **Fulfillment Operations**:
  - Interactive stepper component advancing orders forward or reverting stages.
  - High-resolution artwork review with 300 DPI print-ready asset downloads.
  - Artwork replacement upload workflow for customer revision requests.
  - Carrier shipment logging (FedEx, DHL, BlueDart, Delhivery) with tracking IDs and customer email notifications.
  - Full audit trail recording timestamps and staff initials for every movement.

### 6. Operations — AI Generations Telemetry (`/dashboard/ai-generations`, `/dashboard/ai-generations/[id]`)
Machine learning inference monitoring and quality assurance:
- **Inference Telemetry Cards**: Monitor total generations, average model latency, daily generation volume, and engine error rates.
- **Job History Table**: Filter by model style, status (*Completed*, *Processing*, *Failed*), and prompt keywords.
- **Detailed Generation Inspector**:
  - High-res multi-view inspection (Isometric, Side Profile, Front Three-Quarter, Rear Action).
  - Prompt parameter breakdown: Positive prompt, negative tokens, aspect ratios, seed numbers, sampler steps, and CFG scale.
  - One-click association back to customer profiles and commercial orders.

### 7. Management — Staff Directory & RBAC (`/dashboard/staff`, `/dashboard/staff/[id]`)
Role-based team administration and access control:
- **Staff Roster**: Manage studio personnel across 3 distinct operational roles:
  1. **Full Administrator**: Complete system control, financial reporting, store killswitches, and staff management.
  2. **Order Staff**: Customer care, order modifications, address updates, and manual refunds.
  3. **Production Staff**: Physical print shop access, artwork preparation, queue progression, and carrier manifest management.
- **Staff Profiles**: Real-time permission matrix visualizer, contact updates, and instant account deactivation controls.

### 8. Management — Reports & Business Intelligence (`/dashboard/reports`)
Macro-level atelier analytics and commercial reporting:
- **Universal Date & Filter Bar**:
  - Time presets (`Last 7 days`, `Last 30 days`, `Last 6 months`, `Last 1 year`) with calendar date ranges.
  - Order state filtering (`All order states`, `Completed`, `Pending`, `Refunded`).
- **Universal KPI Strip**:
  - Total Orders, Net Revenue (after refunds), Average Order Value (AOV), and Total Refunded Capital.
- **Four Dedicated Analytical Views**:
  - **Order Summary**: Weekly and monthly revenue breakdown, unit volume, and refund margins.
  - **Sales by Template**: Performance metrics per template with revenue share and combined poster adoption.
  - **Generation Activity**: Telemetry on prompts per user, turnaround latency, and prompt-to-purchase conversion rates.
  - **Sales by Print Size**: Dimensional breakdown (`18x24 in`, `24x36 in`, `12x18 in`) featuring visual percentage bars, revenue contribution, and dominant template styles.
- **CSV Data Extraction**: Dedicated export controls on every analytical view.

### 9. Store Settings & System Controls (`/dashboard/store-settings`, `/dashboard/settings`)
Comprehensive store configuration with client-side state persistence:
- **Store Identity**: Atelier brand name, legal entity, support email, and telephone hotline.
- **Store Status & Emergency Controls**:
  - Live store operational toggle (Emergency Maintenance Killswitch).
  - Custom public notice banner for customer storefront during scheduled downtime.
  - Historical maintenance audit log.
- **Generation Limits**: Quota controls for individual vs. combined poster previews, daily user session caps, and rate limits per minute/hour.
- **Print Sizing & Logistics**: Base pricing for standardized 300 DPI dimensions and shipping thresholds (Free shipping threshold & standard flat-rate fees).
- **Account Settings (`/dashboard/settings`)**: Administrator profile name, password management, and notification dispatch toggles.

---

## 🎨 Design Language & Atelier UI Philosophy

The interface was constructed according to strict automotive atelier design standards:

| Token / Concept | Specification | Description |
| :--- | :--- | :--- |
| **Canvas Background** | `#0b0c0e` | Deep carbon black preventing eye strain in dim print-shop environments. |
| **Card Surface** | `#121315` / `#131418` | Matte graphite elevated container with subtle white borders (`rgba(255, 255, 255, 0.08)`). |
| **Brand Accent** | `#d83138` | Italian Racing Red for primary calls-to-action, active indicators, and critical alerts. |
| **Corner Radius** | `0.375rem` (`rounded-md` / 6px) | Sharp, modern engineering aesthetic replacing bubbly generic borders. |
| **Typography** | Geist Sans / Inter & Geist Mono | High legibility for technical telemetry, VIN identifiers, and fiscal figures. |

### Standardized Button Hierarchy
To guarantee consistent visual rhythm, buttons adhere to strict functional categories:
- **Primary Action** (`bg-primary text-primary-foreground hover:bg-brand-red-hover`): Used exclusively for state commits, new records, and publishing.
- **Secondary / Utility Action** (`border border-border/80 bg-secondary/40 text-foreground hover:bg-secondary/70`): Used universally for CSV exports, filters, modal cancels, and table controls.
- **Inline Row Action** (`text-xs h-7 px-2.5 rounded-md`): Compact utility button for individual row operations.
- **Filter Pills**: Active highlighted state vs. muted outline state.
- **Pagination Controls**: Standardized previous/next buttons and active page indicator.

---

## 🛠️ Technical Stack & Architecture

- **Framework**: [Next.js 16.4.6](https://nextjs.org/) utilizing React Server Components & Client Boundaries (`App Router`).
- **Core Library**: [React 19.3.0](https://react.dev/).
- **Bundler**: [Turbopack](https://turbo.build/pack) for lightning-fast compilation and static route pre-rendering.
- **CSS Architecture**: [Tailwind CSS v4.3.3](https://tailwindcss.com/) with custom `@theme inline` variables and `tw-animate-css`.
- **Primitives**: Radix UI / Base UI inspired shadcn primitives (`sidebar`, `dropdown-menu`, `tooltip`, `collapsible`, `breadcrumb`, `separator`, `sheet`, `avatar`).
- **Icons**: [Lucide React](https://lucide.dev/) (`size-4` standardized operational icons).
- **State & Data Store**:
  - Unified Single Source of Truth in `lib/DemoData.ts`.
  - Production workflow orchestration in `lib/demoProduction.tsx`.
  - Session & configuration persistence via `localStorage` with automated migration.
  - Strict TypeScript type safety across all models (`types/index.ts`).

---

## 📂 Project Directory Structure

```text
poster-gen-admin/
├── app/
│   ├── dashboard/
│   │   ├── ai-generations/         # AI Generation engine telemetry & job inspector
│   │   │   ├── [id]/page.tsx       # Prompt parameter details & multi-view preview
│   │   │   └── page.tsx            # Live telemetry cards & jobs data table
│   │   ├── customers/              # Customer relationship management
│   │   │   ├── [id]/page.tsx       # Customer activity, linked generations & orders
│   │   │   └── page.tsx            # Customer ledger, search, & CSV export
│   │   ├── orders/                 # Commercial order fulfillment & invoices
│   │   │   ├── [id]/page.tsx       # Order details, artwork specs, tracking & notes
│   │   │   └── page.tsx            # Searchable orders table & status filters
│   │   ├── production/             # Physical print shop fulfillment pipeline
│   │   │   ├── [id]/page.tsx       # 8-stage stepper, 300 DPI downloads & tracking
│   │   │   └── page.tsx            # Production orders pipeline queue
│   │   ├── reports/                # Macro analytics, template sales & print sizing
│   │   │   └── page.tsx            # Universal KPI bar, date range picker & 4 views
│   │   ├── settings/               # Personal admin account profile & notifications
│   │   │   └── page.tsx
│   │   ├── staff/                  # Studio team & role-based permissions (RBAC)
│   │   │   ├── [id]/page.tsx       # Staff permission checklist & deactivation
│   │   │   └── page.tsx            # Staff directory & role matrix
│   │   ├── store-settings/         # Atelier identity, emergency killswitch & limits
│   │   │   └── page.tsx            # Tabbed store operations management
│   │   ├── templates/              # Fine art poster catalog & specs atelier
│   │   │   └── page.tsx            # Catalog grid, filter pills & creation modal
│   │   ├── layout.tsx              # Shell with AppSidebar, Header, & AuthGuard
│   │   └── page.tsx                # Main overview dashboard
│   ├── login/                      # Studio admin authentication with demo autofill
│   │   └── page.tsx
│   ├── signup/                     # New staff registration portal
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css                 # Carbon atelier theme & Tailwind v4 theme tokens
│   ├── layout.tsx                  # Root layout with AuthProvider & font definitions
│   └── page.tsx                    # Route handler redirecting to /dashboard
├── components/
│   ├── ai-generations/             # Telemetry cards, filter toolbar, & inspect card
│   ├── customers/                  # CRM profile card, generation tab, & orders tab
│   ├── dashboard/                  # Dashboard KPI cards, charts, & recent orders
│   ├── orders/                     # Orders data table, filter strip, & detail card
│   ├── production/                 # Pipeline stepper, artwork card, & carrier card
│   ├── staff/                      # Staff table & detail permission views
│   ├── templates/                  # Template card & comprehensive creation modal
│   ├── ui/                         # Standardized design system primitives
│   ├── app-sidebar.tsx             # Collapsible primary atelier sidebar navigation
│   ├── auth-guard.tsx              # Route protection client guard
│   ├── dashboard-header.tsx        # Breadcrumb trail & top header bar
│   ├── nav-main.tsx                # Dynamic sidebar grouping navigation
│   └── nav-user.tsx                # Active user profile card & sign-out menu
├── context/
│   └── auth-context.tsx            # Authentication state, session handling & RBAC
├── lib/
│   ├── DemoData.ts                 # Unified immutable single source of truth
│   ├── demoProduction.tsx          # Production helpers & stage transitions
│   ├── templatePhotos.tsx          # Template asset bindings
│   └── utils.ts                    # Class name utility (cn)
├── public/
│   └── template photo/             # High-resolution template art assets (WebP)
├── types/
│   └── index.ts                    # Core TypeScript models and interfaces
├── package.json                    # Project dependencies & runtime scripts
├── tsconfig.json                   # TypeScript compiler configuration
└── README.md                       # Comprehensive documentation manual
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: `v20.x` or higher recommended.
- **Package Manager**: `npm` (v10+), `pnpm` (v9+), or `yarn`.

### Step-by-Step Setup

1. **Clone or Navigate to the Repository**:
   ```bash
   cd poster-gen-admin
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Portal**:
   Open [http://localhost:3000](http://localhost:3000) in your modern browser. If not authenticated, you will be seamlessly directed to `/login`.

### Demo Credentials

The platform includes built-in demo credentials for immediate exploration. You can either click the **"Fill Demo Credentials"** button on the login screen or enter them manually:

| Field | Demo Value | Role |
| :--- | :--- | :--- |
| **Email Address** | `admin1@gmail.com` | Full Administrator |
| **Access Password** | `0000` | Full Access Permissions |

*(Note: Custom accounts created via `/signup` or passwords with 4+ characters are also accepted in local sandbox mode).*

---

## 📦 Build & Production Verification

To test and compile the production build:

```bash
# 1. Type Check verification
npx tsc --noEmit

# 2. Production Build using Turbopack
npm run build

# 3. Start Production Server
npm run start
```

All 179+ static and dynamic routes compile cleanly with zero errors. All search-parameter dependent pages are properly wrapped in React Suspense boundaries for Next.js 16 static optimization.

---

## 🛡️ Security & Data Integrity Guidelines

1. **Client Hydration Guard**: The application implements strict client-side hydration stabilization to ensure server-rendered UI matches client DOM nodes without layout shifts.
2. **Immutable Primary Data**: Base records reside in `lib/DemoData.ts`. User updates (status changes, template additions, store toggles) persist safely to browser `localStorage` without altering base mock fixtures.
3. **Sensitive Production Assets**: Print shop artwork links point to archival 300 DPI files with full asset replacement safeguards and audit logging.

---

*Crafted for the Poster Gen Automotive Atelier.*
