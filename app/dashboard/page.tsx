"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const kpis = [
    {
      title: "Total customers",
      value: "1,284",
      delta: "+42 this week",
    },
    {
      title: "Paid orders",
      value: "356",
      delta: "+18 this week",
    },
    {
      title: "Total revenue",
      value: "$14,920",
      delta: "+6.2%",
    },
    {
      title: "Individual generations",
      value: "2,310",
      delta: "+120 this week",
    },
    {
      title: "Combined generations",
      value: "486",
      delta: "+31 this week",
    },
    {
      title: "Average order value",
      value: "$41.90",
      delta: "+1.4%",
    },
  ]

  // Order status data styled with brand harmony
  const orderStatuses = [
    { label: "Paid", count: 142, pct: 90, barColor: "bg-primary" },
    { label: "Cancelled", count: 9, pct: 6, barColor: "bg-zinc-600" },
    { label: "Refunded", count: 6, pct: 4, barColor: "bg-zinc-700" },
  ]

  // Production overview data matching atelier production workflow
  const productionStatuses = [
    { label: "Received", count: 24, pct: 35, barColor: "bg-amber-500/90" },
    { label: "Printing", count: 38, pct: 55, barColor: "bg-primary" },
    { label: "Ready to ship", count: 12, pct: 18, barColor: "bg-zinc-400" },
    { label: "Shipped", count: 51, pct: 75, barColor: "bg-emerald-500/90" },
  ]

  // Recent orders with brand badges
  const recentOrders = [
    {
      order: "#1042",
      customer: "a.khan@mail.com",
      items: 2,
      total: "$68",
      stage: "Printing",
      badgeClass: "bg-primary/15 text-primary border-primary/30",
    },
    {
      order: "#1041",
      customer: "s.roy@mail.com",
      items: 1,
      total: "$29",
      stage: "Shipped",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    {
      order: "#1040",
      customer: "j.lee@mail.com",
      items: 3,
      total: "$96",
      stage: "Received",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-xs font-normal text-muted-foreground mt-0.5">
            Automotive atelier performance, generative render pipeline, and order fulfillment.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer shadow-sm"
        >
          <Calendar className="size-3.5 text-primary" />
          <span>Last 30 days</span>
        </button>
      </div>

      {/* KPI Cards: 2 rows of 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm hover:border-primary/30 transition-colors"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">
              {kpi.title}
            </span>
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-2">
              {kpi.value}
            </div>
            <p className="text-xs font-normal text-emerald-400 mt-1.5 flex items-center gap-1">
              <span>{kpi.delta}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Two Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Chart: Generations per day */}
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm flex flex-col justify-between hover:border-border transition-colors">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Generations per day
            </h2>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
                <span className="size-2.5 rounded-sm bg-primary" />
                <span>Individual</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-normal">
                <span className="size-2.5 rounded-sm bg-zinc-400" />
                <span>Combined</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="w-full mt-4">
            <svg
              viewBox="0 0 500 220"
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="brandRedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d83138" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#d83138" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-axis subtle gridlines & tick labels */}
              {[
                { val: 120, y: 20 },
                { val: 100, y: 46.7 },
                { val: 80, y: 73.3 },
                { val: 60, y: 100 },
                { val: 40, y: 126.7 },
                { val: 20, y: 153.3 },
                { val: 0, y: 180 },
              ].map((tick) => (
                <g key={tick.val}>
                  <line
                    x1="45"
                    y1={tick.y}
                    x2="480"
                    y2={tick.y}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x="35"
                    y={tick.y + 3.5}
                    textAnchor="end"
                    fill="#71717a"
                    fontSize="11"
                    className="font-normal"
                  >
                    {tick.val}
                  </text>
                </g>
              ))}

              {/* Individual Area Fill (Brand Red Gradient) */}
              <path
                d="M 45 100 L 116.7 84 L 188.3 92 L 260 62.7 L 331.7 54.7 L 403.3 33.3 L 475 17.3 L 475 180 L 45 180 Z"
                fill="url(#brandRedGradient)"
              />

              {/* Combined Dashed Line (Muted Silver/Slate) */}
              <path
                d="M 45 166.7 L 116.7 161.3 L 188.3 164 L 260 156 L 331.7 153.3 L 403.3 145.3 L 475 140"
                fill="none"
                stroke="#a1a1aa"
                strokeWidth="1.75"
                strokeDasharray="4 3"
              />

              {/* Individual Solid Line (Brand Red #d83138) */}
              <path
                d="M 45 100 L 116.7 84 L 188.3 92 L 260 62.7 L 331.7 54.7 L 403.3 33.3 L 475 17.3"
                fill="none"
                stroke="#d83138"
                strokeWidth="2.5"
              />

              {/* Combined Points */}
              {[
                { x: 45, y: 166.7 },
                { x: 116.7, y: 161.3 },
                { x: 188.3, y: 164 },
                { x: 260, y: 156 },
                { x: 331.7, y: 153.3 },
                { x: 403.3, y: 145.3 },
                { x: 475, y: 140 },
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill="#a1a1aa"
                  stroke="#121315"
                  strokeWidth="1.5"
                />
              ))}

              {/* Individual Points (Brand Red with Dark Ring) */}
              {[
                { x: 45, y: 100 },
                { x: 116.7, y: 84 },
                { x: 188.3, y: 92 },
                { x: 260, y: 62.7 },
                { x: 331.7, y: 54.7 },
                { x: 403.3, y: 33.3 },
                { x: 475, y: 17.3 },
              ].map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#d83138"
                  stroke="#121315"
                  strokeWidth="2"
                />
              ))}

              {/* X-axis tick labels */}
              {[
                { label: "Mon", x: 45 },
                { label: "Tue", x: 116.7 },
                { label: "Wed", x: 188.3 },
                { label: "Thu", x: 260 },
                { label: "Fri", x: 331.7 },
                { label: "Sat", x: 403.3 },
                { label: "Sun", x: 475 },
              ].map((day) => (
                <text
                  key={day.label}
                  x={day.x}
                  y="204"
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize="11"
                  className="font-normal"
                >
                  {day.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Chart: Revenue per week */}
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm flex flex-col justify-between hover:border-border transition-colors">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Revenue per week
            </h2>
          </div>

          {/* SVG Bar Chart with Brand Red Palette */}
          <div className="w-full mt-4">
            <svg
              viewBox="0 0 500 220"
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Y-axis gridlines & labels */}
              {[
                { val: "3,500", y: 20 },
                { val: "3,000", y: 42.9 },
                { val: "2,500", y: 65.7 },
                { val: "2,000", y: 88.6 },
                { val: "1,500", y: 111.4 },
                { val: "1,000", y: 134.3 },
                { val: "500", y: 157.1 },
                { val: "0", y: 180 },
              ].map((tick) => (
                <g key={tick.val}>
                  <line
                    x1="45"
                    y1={tick.y}
                    x2="480"
                    y2={tick.y}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x="35"
                    y={tick.y + 3.5}
                    textAnchor="end"
                    fill="#71717a"
                    fontSize="11"
                    className="font-normal"
                  >
                    {tick.val}
                  </text>
                </g>
              ))}

              {/* Vertical Bars: Brand Red with Smooth Hover State */}
              {[
                { label: "W1", val: 1800, x: 70, h: 82.3, y: 97.7 },
                { label: "W2", val: 2100, x: 140, h: 96, y: 84 },
                { label: "W3", val: 2000, x: 210, h: 91.4, y: 88.6 },
                { label: "W4", val: 2600, x: 280, h: 118.9, y: 61.1 },
                { label: "W5", val: 2900, x: 350, h: 132.6, y: 47.4 },
                { label: "W6", val: 3200, x: 420, h: 146.3, y: 33.7 },
              ].map((bar) => (
                <g key={bar.label} className="group cursor-pointer">
                  <rect
                    x={bar.x}
                    y={bar.y}
                    width="26"
                    height={bar.h}
                    rx="3"
                    fill="#d83138"
                    className="transition-colors group-hover:fill-[#e05359]"
                  />
                  <text
                    x={bar.x + 13}
                    y="204"
                    textAnchor="middle"
                    fill="#71717a"
                    fontSize="11"
                    className="font-normal"
                  >
                    {bar.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row: Order status & Production overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Order status */}
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Order status
          </h2>
          <div className="space-y-4">
            {orderStatuses.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="w-24 text-sm font-normal text-muted-foreground">
                  {item.label}
                </span>
                <div className="flex-1 h-3 rounded-md bg-secondary border border-border/40 overflow-hidden">
                  <div
                    className={`h-full rounded-md ${item.barColor} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Production overview */}
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Production overview
          </h2>
          <div className="space-y-4">
            {productionStatuses.map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="w-28 text-sm font-normal text-muted-foreground">
                  {item.label}
                </span>
                <div className="flex-1 h-3 rounded-md bg-secondary border border-border/40 overflow-hidden">
                  <div
                    className={`h-full rounded-md ${item.barColor} transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Card: Recent orders */}
      <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">
            Recent orders
          </h2>
          <span className="text-xs font-normal text-muted-foreground">
            Live atelier fulfillment stream
          </span>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/40 text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {recentOrders.map((ord) => (
                <tr
                  key={ord.order}
                  onClick={() => router.push(`/dashboard/orders/${ord.order.replace("#", "")}`)}
                  className="hover:bg-secondary/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 font-medium text-foreground group-hover:text-primary transition-colors">
                    {ord.order}
                  </td>
                  <td className="py-3 font-normal text-muted-foreground group-hover:text-foreground/90 transition-colors">
                    {ord.customer}
                  </td>
                  <td className="py-3 font-medium text-foreground">{ord.items}</td>
                  <td className="py-3 font-semibold text-foreground">{ord.total}</td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${ord.badgeClass}`}
                    >
                      {ord.stage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
