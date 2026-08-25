import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronRight, KanbanSquare } from "lucide-react";
import { useOrderStore } from "@/store/orders";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatDate } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function OrdersPage() {
  const orders = useOrderStore((s) => s.orders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    return [...orders]
      .filter((o) => {
        if (status && o.status !== status) return false;
        if (
          query &&
          !o.id.toLowerCase().includes(query.toLowerCase()) &&
          !o.customerName.toLowerCase().includes(query.toLowerCase())
        )
          return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, query, status]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-muted">{orders.length} total orders</p>
        </div>
        <Link
          to="/orders/board"
          className="flex items-center gap-2 border border-white/15 px-4 py-2.5 text-sm text-foreground hover:border-gold/40 hover:text-gold"
        >
          <KanbanSquare className="h-4 w-4" />
          Board View
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order ID or customer…"
            className="w-full border border-white/15 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
        >
          <option value="">All statuses</option>
          {[...ORDER_STATUS_FLOW, "cancelled"].map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr
                key={o.id}
                className={cn(
                  "border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]",
                )}
              >
                <td className="px-4 py-3 text-foreground">{o.id}</td>
                <td className="px-4 py-3 text-muted">{o.customerName}</td>
                <td className="px-4 py-3 text-muted">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-gold">{formatINR(o.total)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/orders/${o.id}`}
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
                  No orders match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
