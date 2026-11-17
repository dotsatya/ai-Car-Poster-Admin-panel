import { Save } from "lucide-react"

export default function StoreSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Store Settings
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Configure store branding, print defaults, currency, and fulfillment endpoints.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors">
          <Save className="size-4" /> Save Settings
        </button>
      </div>

      <div className="grid gap-6">
        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <h3 className="font-semibold text-base text-foreground">Store Identity</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Brand Name</label>
              <input
                defaultValue="POSTER GEN • Automotive Atelier"
                className="mt-1.5 w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Concierge Email</label>
              <input
                defaultValue="concierge@postergen.io"
                className="mt-1.5 w-full rounded-md border border-border/80 bg-background/80 px-3.5 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border/80 bg-card p-6 text-card-foreground shadow-sm space-y-4">
          <h3 className="font-semibold text-base text-foreground">Print & Substrate Specifications</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Default Substrate</label>
              <select className="mt-1.5 w-full rounded-md border border-border/80 bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60">
                <option>310 GSM 100% Acid-Free Cotton Rag</option>
                <option>Museum Archival Giclée Matte</option>
                <option>Heavyweight Fine Art Luster</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Pricing Currency</label>
              <select className="mt-1.5 w-full rounded-md border border-border/80 bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60">
                <option>INR (₹) - Primary Domestic</option>
                <option>USD ($) - International</option>
                <option>EUR (€) - European Union</option>
                <option>GBP (£) - United Kingdom</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.03em]">Fulfillment Method</label>
              <select className="mt-1.5 w-full rounded-md border border-border/80 bg-background px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-primary/60">
                <option>In-House Giclée Print Lab (Direct)</option>
                <option>Prodigi Global Art Network</option>
                <option>Fine Art Print Express Dispatch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
