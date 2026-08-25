import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, Ban } from "lucide-react";
import { useCustomerStore } from "@/store/customers";
import { formatINR, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CustomersPage() {
  const customers = useCustomerStore((s) => s.customers);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q),
    );
  }, [customers, query]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Customers</h1>
      <p className="mt-1 text-sm text-muted">{customers.length} total customers</p>

      <label className="relative mt-6 block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          className="w-full border border-white/15 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold"
        />
      </label>

      <div className="mt-6 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Total Spent</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                        c.blocked
                          ? "border-red-400/40 bg-red-400/10 text-red-300"
                          : "border-gold/40 bg-gold/10 text-gold",
                      )}
                    >
                      {c.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <span className="block text-foreground">{c.name}</span>
                      {c.blocked && (
                        <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-red-400">
                          <Ban className="h-3 w-3" />
                          Blocked
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  <p>{c.email}</p>
                  <p className="text-xs">{c.phone}</p>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(c.joinedAt)}</td>
                <td className="px-4 py-3 text-muted">{c.ordersCount}</td>
                <td className="px-4 py-3 text-gold">{formatINR(c.totalSpent)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/customers/${c.id}`}
                    className="inline-flex items-center gap-1 text-sm text-gold hover:underline"
                  >
                    View
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No customers match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
