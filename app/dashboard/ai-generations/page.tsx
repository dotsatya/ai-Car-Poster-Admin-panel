import { WandSparkles } from "lucide-react"

export default function AiGenerationsPage() {
  const jobs = [
    { prompt: "1994 Toyota Supra Turbo, studio lightning, hyperrealistic reflections, 8k", style: "Cyberpunk Studio", time: "2 mins ago", status: "Rendered", upscaled: "8K PRINT READY", statusClass: "bg-primary/15 text-primary border-primary/25" },
    { prompt: "BMW M1 Procar, historic Nürburgring pit lane, 1980 film grain aesthetic", style: "Vintage 35mm", time: "8 mins ago", status: "Rendered", upscaled: "8K PRINT READY", statusClass: "bg-primary/15 text-primary border-primary/25" },
    { prompt: "Audi Sport Quattro S1 E2, rally stage dust cloud, evening sun glare", style: "Action Dynamic", time: "15 mins ago", status: "Upscaling", upscaled: "4K PROCESSING", statusClass: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    { prompt: "Lamborghini Countach LP500, sunset Miami backdrop, palm trees reflections", style: "Synthwave Sunset", time: "24 mins ago", status: "Rendered", upscaled: "8K PRINT READY", statusClass: "bg-primary/15 text-primary border-primary/25" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            AI Generations
          </h1>
          <p className="text-sm font-normal text-muted-foreground mt-1">
            Zero-stock automotive generative rendering, reflection synthesis, and 8K upscaling.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-red-950/30 hover:bg-primary/90 transition-colors">
          <WandSparkles className="size-4" /> Generate
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-[0.03em]">Monthly Compute Quota</span>
          <div className="text-2xl font-semibold tracking-tight mt-1.5 text-foreground">18,420 / 25,000</div>
          <p className="text-xs font-normal text-muted-foreground mt-1">Flux 1.1 Pro & Real-ESRGAN Upscaler</p>
        </div>
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-[0.03em]">Avg Synthesis Latency</span>
          <div className="text-2xl font-semibold tracking-tight mt-1.5 text-foreground">4.2s / Frame</div>
          <p className="text-xs font-normal text-muted-foreground mt-1">TensorRT Automotive Acceleration</p>
        </div>
        <div className="rounded-md border border-border/80 bg-card p-5 text-card-foreground shadow-sm">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-[0.03em]">8K Upscale Precision</span>
          <div className="text-2xl font-semibold tracking-tight mt-1.5 text-emerald-400">99.8% Acceptance</div>
          <p className="text-xs font-normal text-muted-foreground mt-1">Verified 300 DPI Physical Millimeter</p>
        </div>
      </div>

      <div className="rounded-md border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/60">
          <h3 className="font-semibold text-base text-foreground">Recent Generative Pipelines</h3>
        </div>
        <div className="divide-y divide-border/40">
          {jobs.map((job, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-secondary/40 transition-colors">
              <div className="space-y-1.5">
                <p className="text-sm font-medium leading-snug text-foreground">{job.prompt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md bg-secondary border border-border/60 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
                    {job.style}
                  </span>
                  <span>•</span>
                  <span>{job.time}</span>
                  <span>•</span>
                  <span className="text-primary font-medium tracking-wide">{job.upscaled}</span>
                </div>
              </div>
              <span className={`rounded-md px-2.5 py-0.5 text-xs font-medium border shrink-0 self-start sm:self-auto ${job.statusClass}`}>
                {job.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
