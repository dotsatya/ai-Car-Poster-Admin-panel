import { Search, Mail, MapPin } from "lucide-react"

export default function CustomersPage() {
  const customers = [
    { name: "Liam Vance", email: "liam.vance@example.com", location: "Los Angeles, CA", ordersCount: 6, totalSpent: "$294.00" },
    { name: "Sophia Chen", email: "sophia.chen@example.com", location: "Vancouver, BC", ordersCount: 4, totalSpent: "$182.00" },
    { name: "Marcus Miller", email: "marcus.m@example.com", location: "London, UK", ordersCount: 12, totalSpent: "$680.00" },
    { name: "Elena Rostova", email: "e.rostova@example.com", location: "Berlin, DE", ordersCount: 3, totalSpent: "$145.00" },
    { name: "Noah Patel", email: "noah.patel@example.com", location: "Austin, TX", ordersCount: 8, totalSpent: "$412.00" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          Customers
        </h1>
        <p className="text-sm font-normal text-muted-foreground mt-1">
          Customer directory, order frequencies, and lifetime buyer value.
        </p>
      </div>

      <div className="rounded-md border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-border/60 flex items-center gap-2.5 bg-card/60">
          <Search className="size-4 text-muted-foreground" />
          <input
            placeholder="Search customers by name or email..."
            className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground/70"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border/60 bg-muted/30 text-muted-foreground text-left">
              <tr>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Customer</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Contact</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Location</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Total Orders</th>
                <th className="p-4 font-medium text-xs uppercase tracking-[0.03em]">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {customers.map((cust) => (
                <tr key={cust.email} className="hover:bg-secondary/40 transition-colors">
                  <td className="p-4 font-medium text-foreground">{cust.name}</td>
                  <td className="p-4 font-normal text-muted-foreground flex items-center gap-1.5 pt-4">
                    <Mail className="size-3.5 text-muted-foreground/70" />
                    <span>{cust.email}</span>
                  </td>
                  <td className="p-4 font-normal text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground/70" /> {cust.location}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-mono font-medium text-foreground/90">
                      {cust.ordersCount} posters
                    </span>
                  </td>
                  <td className="p-4 font-semibold tracking-tight text-foreground">{cust.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
