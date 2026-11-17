import { Calendar, Download } from "lucide-react"

export default function ReportsPage() {
  const topCars = [
    { model: "Porsche 911 GT3 / RS Minimalist Spec", sold: 342, revenue: "$16,758.00", share: "39%", shareClass: "bg-primary/15 text-primary border-primary/25" },
    { model: "Nissan Skyline GT-R (R32 / R33 / R34 Kouki)", sold: 284, revenue: "$11,928.00", share: "28%", shareClass: "bg-secondary text-foreground/90 border-border/60" },
    { model: "BMW M3 (E30 Sport Evo / E46 GTR)", sold: 198, revenue: "$8,910.00", share: "21%", shareClass: "bg-secondary text-foreground/90 border-border/60" },
    { model: "Ferrari F40 / Testarossa Atrium", sold: 112, revenue: "$5,254.00", share: "12%", shareClass: "bg-secondary text-foreground/90 border-border/60" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Sales Reports
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Analyze sales, top automotive models, and buyer analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-border/80 bg-card px-3.5 py-2 text-sm font-medium shadow-sm hover:bg-secondary transition-colors">
            <Calendar className="size-4 text-muted-foreground" /> Last 30 Days
          </button>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors">
            <Download className="size-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-[0.03em]">Gross Archive Sales</span>
          <div className="text-2xl font-semibold tracking-tight mt-1 text-foreground">$42,850.00</div>
          <span className="text-xs text-emerald-400 font-medium inline-block mt-1">+18.2% vs previous period</span>
        </div>
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-[0.03em]">Average Order Value</span>
          <div className="text-2xl font-semibold tracking-tight mt-1 text-foreground">$54.30</div>
          <span className="text-xs text-emerald-400 font-medium inline-block mt-1">+4.1% framed editions</span>
        </div>
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-[0.03em]">Physical Print Volume</span>
          <div className="text-2xl font-semibold tracking-tight mt-1 text-foreground">1,248 Units</div>
          <span className="text-xs text-emerald-400 font-medium inline-block mt-1">+12.4% net volume growth</span>
        </div>
      </div>

      <div className="rounded-md border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <h3 className="font-semibold text-base text-foreground">Top Performing Automotive Models</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-muted-foreground text-left">
              <tr>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Machine Series / Model</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Units Sold</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Gross Revenue</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Market Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {topCars.map((car) => (
                <tr key={car.model} className="hover:bg-secondary/40 transition-colors">
                  <td className="p-4 font-medium text-foreground">{car.model}</td>
                  <td className="p-4 font-normal text-muted-foreground font-mono">{car.sold} editions</td>
                  <td className="p-4 font-semibold tracking-tight text-foreground">{car.revenue}</td>
                  <td className="p-4">
                    <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium border ${car.shareClass}`}>
                      {car.share}
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
