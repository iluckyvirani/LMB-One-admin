import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { IndianRupee, Package, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import { useProductStore } from "@/store/products";
import { useOrderStore } from "@/store/orders";
import { useCustomerStore } from "@/store/customers";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatDate } from "@/lib/format";

export function DashboardPage() {
  const products = useProductStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);
  const customers = useCustomerStore((s) => s.customers);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const chartData = Array.from({ length: 10 }, (_, i) => {
    const day = 9 - i;
    const d = new Date();
    d.setDate(d.getDate() - day);
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const dayOrders = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return od.toDateString() === d.toDateString();
    });
    return {
      day: label,
      revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
    };
  });

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Welcome back — here&apos;s what&apos;s happening with your store.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatINR(revenue)} Icon={IndianRupee} />
        <StatCard
          label="Orders"
          value={String(orders.length)}
          Icon={ShoppingBag}
          hint={`${orders.filter((o) => o.status === "ordered").length} new`}
        />
        <StatCard label="Products" value={String(products.length)} Icon={Package} />
        <StatCard label="Customers" value={String(customers.length)} Icon={Users} />
      </div>

      {(lowStock > 0 || outOfStock > 0) && (
        <Link
          to="/products"
          className="mt-6 flex items-center gap-3 border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm text-amber-300 hover:bg-amber-400/10"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {outOfStock > 0 && <span>{outOfStock} product(s) out of stock</span>}
          {outOfStock > 0 && lowStock > 0 && <span>·</span>}
          {lowStock > 0 && <span>{lowStock} product(s) running low</span>}
        </Link>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-heading text-lg text-foreground">
            Revenue — last 10 days
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a227" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#c9a227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#a6a6a6"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#a6a6a6"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={36}
                tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
              />
              <Tooltip
                contentStyle={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => formatINR(Number(value))}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#c9a227"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-heading text-lg text-foreground">Recent Orders</h2>
          <ul className="space-y-3">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="flex items-center justify-between gap-3 border border-white/10 p-3 text-sm transition-colors hover:border-gold/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-foreground">
                      {o.customerName}
                    </span>
                    <span className="block text-xs text-muted">
                      {o.id} · {formatDate(o.createdAt)}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-[family-name:var(--font-poppins)] text-gold">
                      {formatINR(o.total)}
                    </span>
                    <StatusBadge status={o.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
