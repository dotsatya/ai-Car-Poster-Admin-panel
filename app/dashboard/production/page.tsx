import { Printer } from "lucide-react"

export default function ProductionPage() {
  const queues = [
    {
      title: "Pre-Flight & Color Proofing",
      count: "14 Jobs",
      description: "Resolutions & CMYK color conversion check",
      badge: "Pending Review",
      badgeClass: "bg-secondary text-muted-foreground border-border/80",
    },
    {
      title: "Active Print Presses",
      count: "8 Jobs",
      description: "Epson SureColor Pro P9570 (Fine Art Matte & Canvas)",
      badge: "In Progress",
      badgeClass: "bg-primary/15 text-primary border-primary/25",
    },
    {
      title: "Curing & Framing Station",
      count: "6 Jobs",
      description: "Drying station & matte black aluminum frames",
      badge: "Assembly",
      badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "Packing & Shipping Labels",
      count: "19 Jobs",
      description: "Protective kraft tubes & DHL express manifests",
      badge: "Ready to Dispatch",
      badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Print Production
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Live press queue, color calibration, archival materials, and packaging dispatch.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {queues.map((q) => (
          <div
            key={q.title}
            className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-medium tracking-[0.03em] px-2 py-0.5 rounded-md border ${q.badgeClass}`}>
                {q.badge}
              </span>
              <Printer className="size-4 text-muted-foreground/80" />
            </div>
            <div className="text-2xl font-semibold tracking-tight mt-3 text-foreground">{q.count}</div>
            <h4 className="text-sm font-semibold mt-1 text-foreground/90">{q.title}</h4>
            <p className="text-xs font-normal text-muted-foreground mt-1">{q.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="font-semibold text-base text-foreground mb-1">
          Archival Stock & Inventory Levels
        </h3>
        <p className="text-xs font-normal text-muted-foreground mb-4">
          Current substrate inventory (310 GSM Cotton Rag, Archival Canvas, and Obsidian frames).
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-border/70 p-4 bg-secondary/30">
            <p className="text-xs font-normal text-muted-foreground">310 GSM 100% Cotton Rag</p>
            <p className="text-xl font-semibold tracking-tight text-foreground mt-1">84% Roll Remaining</p>
            <div className="h-1.5 w-full rounded-md bg-secondary mt-3 overflow-hidden">
              <div className="h-full rounded-md bg-primary/80" style={{ width: "84%" }} />
            </div>
          </div>
          <div className="rounded-md border border-border/70 p-4 bg-secondary/30">
            <p className="text-xs font-normal text-muted-foreground">Museum Archival Canvas</p>
            <p className="text-xl font-semibold tracking-tight text-foreground mt-1">62% Roll Remaining</p>
            <div className="h-1.5 w-full rounded-md bg-secondary mt-3 overflow-hidden">
              <div className="h-full rounded-md bg-primary/80" style={{ width: "62%" }} />
            </div>
          </div>
          <div className="rounded-md border border-border/70 p-4 bg-secondary/30">
            <p className="text-xs font-normal text-muted-foreground">CNC Obsidian Matte Frames</p>
            <p className="text-xl font-semibold tracking-tight text-foreground mt-1">42 Frames In Stock</p>
            <div className="h-1.5 w-full rounded-md bg-secondary mt-3 overflow-hidden">
              <div className="h-full rounded-md bg-emerald-500/70" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
